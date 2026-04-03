/**
 * sticky-headers — makes section headings stick to the top of the viewport
 * as the user scrolls, forming a layered breadcrumb trail (H1 on top, then
 * H2, H3, etc.).
 *
 * Each heading level occupies a reserved "slot" whose vertical position is
 * stored in CSS variables (--sticky-h1 … --sticky-h6) so that other code
 * (tables, navigation) can account for the cumulative sticky offset.
 *
 * The `.sticky-active` class is toggled on headings that are currently stuck.
 * When sticky mode is off (`.sticky-on` absent from `<html>`), all headings
 * revert to `position: relative`.
 *
 * The `--table-sticky-top` variable is updated on every pass so that table
 * `<thead>` elements stick just below the lowest active sticky heading.
 *
 * Preference is persisted to localStorage ("doc-shell-sticky-headers").
 *
 * Communication with the sticky-headers button:
 *   - Listens for `doc-shell:sticky-toggle`  → toggles sticky mode
 *   - Dispatches `doc-shell:sticky-change`   → button syncs aria-pressed
 *   - Dispatches `doc-shell:sticky-update`   → TOC/other code reflows
 */
export {};

const STORAGE_KEY = 'doc-shell-sticky-headers';
let ac: AbortController | undefined;

/** Returns true when sticky mode is currently on. */
function isStickyOn(): boolean {
  return document.documentElement.classList.contains('sticky-on');
}

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  const content = document.querySelector('.doc-content');
  if (!content) return;

  const headings = Array.from(content.querySelectorAll<HTMLElement>('.section-heading'));

  /** Extract the heading level (1–6) from a heading element's tag name. */
  function level(el: HTMLElement): number {
    return parseInt(el.tagName.charAt(1), 10);
  }

  /**
   * Recompute `--table-sticky-top` so `<thead>` elements stick just below
   * the lowest visible sticky heading.
   */
  function updateTableStickyTop() {
    let top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--doc-header-height')) || 0;
    if (isStickyOn()) {
      headings.forEach(function (el) {
        if (el.classList.contains('sticky-active')) {
          const b = el.getBoundingClientRect().bottom;
          if (b > top) top = b;
        }
      });
    }
    document.documentElement.style.setProperty('--table-sticky-top', top + 'px');
  }

  const stickySlot: number[] = [];
  const stickyBottom: number[] = [];

  /**
   * Measure heading heights and compute the vertical "slot" each level
   * occupies.  Results are stored in `stickySlot[]` and written to CSS
   * variables `--sticky-h1` … `--sticky-h6`.
   */
  function cacheStickySlots() {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const header = document.querySelector('.doc-page-header') as HTMLElement | null;
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    document.documentElement.style.setProperty('--doc-header-height', headerBottom + 'px');
    const baseTop = headerBottom;
    const heightByLevel: number[] = [0];
    for (let lvl = 1; lvl <= 6; lvl++) {
      const h = headings.find(el => level(el) === lvl);
      heightByLevel[lvl] = h ? h.getBoundingClientRect().height : (heightByLevel[lvl - 1] || 2.5 * rem);
    }
    let cumTop = baseTop;
    for (let lvl = 1; lvl <= 6; lvl++) {
      stickySlot[lvl] = cumTop;
      stickyBottom[lvl] = cumTop + heightByLevel[lvl];
      document.documentElement.style.setProperty('--sticky-h' + lvl, (cumTop / rem) + 'rem');
      cumTop += heightByLevel[lvl];
    }
  }

  cacheStickySlots();

  document.addEventListener('doc-shell:toc-width-change', function () {
    cacheStickySlots();
    updateStickyActive();
  }, { signal });

  document.addEventListener('doc-shell:heading-nums-change', function () {
    cacheStickySlots();
    updateStickyActive();
  }, { signal });

  /**
   * Walk the heading list and toggle `.sticky-active` / `.sticky-departing`
   * / `.heading-incoming` based on scroll position and enabled state.
   */
  function updateStickyActive() {
    if (!isStickyOn()) {
      headings.forEach(function (el) {
        el.classList.remove('sticky-active', 'sticky-departing');
      });
      updateTableStickyTop();
      document.dispatchEvent(new CustomEvent('doc-shell:sticky-update'));
      return;
    }

    let currentIdx = 0;
    for (let i = headings.length - 1; i >= 0; i--) {
      const slot = stickySlot[level(headings[i])];
      if (headings[i].getBoundingClientRect().top <= slot + 1) { currentIdx = i; break; }
    }

    const currentLevel = level(headings[currentIdx]);
    const chain: HTMLElement[] = [];
    for (let lvl = 1; lvl <= currentLevel; lvl++) {
      for (let j = currentIdx; j >= 0; j--) {
        if (level(headings[j]) === lvl) { chain.push(headings[j]); break; }
      }
    }

    const vh = window.innerHeight;
    const incoming = new Set<HTMLElement>();
    const departing = new Set<HTMLElement>();
    for (let i = currentIdx + 1; i < headings.length; i++) {
      const viewportY = headings[i].getBoundingClientRect().top;
      if (viewportY > vh) break;
      const lvl = level(headings[i]);
      for (let k = chain.length - 1; k >= 0; k--) {
        if (level(chain[k]) >= lvl && viewportY <= stickySlot[level(chain[k])]) {
          departing.add(chain[k]);
          chain.splice(k, 1);
        }
      }
      incoming.add(headings[i]);
    }

    headings.forEach(function (el) {
      const inChain = chain.indexOf(el) !== -1;
      const isDep = departing.has(el);
      el.classList.toggle('sticky-active', inChain || isDep);
      el.classList.toggle('sticky-departing', isDep);
      el.classList.toggle('heading-incoming', incoming.has(el));
    });

    updateTableStickyTop();
    document.dispatchEvent(new CustomEvent('doc-shell:sticky-update'));
  }

  /** Enable or disable sticky mode, persist the preference, and reflow. */
  function setStickyEnabled(on: boolean) {
    document.documentElement.classList.toggle('sticky-on', on);
    try { localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off'); } catch (_e) { /* noop */ }
    updateStickyActive();
    document.dispatchEvent(new CustomEvent('doc-shell:sticky-change'));
  }

  window.addEventListener('scroll', updateStickyActive, { passive: true, signal });
  window.addEventListener('resize', function () { cacheStickySlots(); updateStickyActive(); }, { signal });
  document.fonts.ready.then(function () { cacheStickySlots(); updateStickyActive(); });

  document.addEventListener('doc-shell:sticky-toggle', function () {
    setStickyEnabled(!isStickyOn());
  }, { signal });

  let initialOn = true;
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'off') initialOn = false;
  } catch (_e) { /* noop */ }
  setStickyEnabled(initialOn);

  updateStickyActive();
}

document.addEventListener('astro:page-load', init);

/**
 * Pre-restore sticky class + CSS slot variables BEFORE Astro scrolls to any
 * hash fragment during a View Transition.  `astro:after-swap` fires after
 * the DOM swap but before the scroll, so `.sticky-on` scroll-margin-top
 * rules will already be in effect when the browser positions the target.
 */
document.addEventListener('astro:after-swap', function () {
  let on = true;
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'off') on = false;
  } catch (_e) { /* noop */ }
  document.documentElement.classList.toggle('sticky-on', on);

  const header = document.querySelector('.doc-page-header') as HTMLElement | null;
  const hb = header ? header.getBoundingClientRect().bottom : 0;
  document.documentElement.style.setProperty('--doc-header-height', hb + 'px');

  if (!on) return;

  const content = document.querySelector('.doc-content');
  if (!content) return;
  const hs = Array.from(content.querySelectorAll<HTMLElement>('.section-heading'));
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  const heights: number[] = [0];
  for (let lvl = 1; lvl <= 6; lvl++) {
    const found = hs.find(function (el) { return parseInt(el.tagName.charAt(1), 10) === lvl; });
    heights[lvl] = found ? found.getBoundingClientRect().height : (heights[lvl - 1] || 2.5 * rem);
  }
  let cumTop = hb;
  for (let lvl = 1; lvl <= 6; lvl++) {
    document.documentElement.style.setProperty('--sticky-h' + lvl, (cumTop / rem) + 'rem');
    cumTop += heights[lvl];
  }
});
