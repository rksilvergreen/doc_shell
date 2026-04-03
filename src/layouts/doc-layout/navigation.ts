/**
 * navigation — maintains a scroll-position stack so the custom back / forward
 * buttons can navigate between previously-visited anchors, across documents.
 *
 * Same-document `.doc-link` clicks push scroll positions onto the stack.
 * Cross-document navigations (remote links, dropdown) are also tracked so the
 * user can press back/forward to return to the previous document and scroll
 * position.  Navigating to the home page resets the entire stack.
 *
 * Highlight styles applied after a jump:
 *   - `.doc-section`  → `.heading-highlight` on its heading child (1.8 s fade)
 *   - everything else → `.target-highlight`  (2.1 s fade)
 *
 * Scroll targets account for sticky headers (`getStickyOffset`) and doc-table
 * header height so the element appears in the expected position.
 *
 * Custom events consumed:
 *   - `astro:before-preparation` — saves scroll position before View Transition
 *   - `astro:page-load`         — re-initialises after each navigation
 */

export const DOC_NAV_BACK_EVENT = 'doc-shell:nav-back';
export const DOC_NAV_FWD_EVENT = 'doc-shell:nav-forward';

export function emitNavBack(): void {
  document.dispatchEvent(new CustomEvent(DOC_NAV_BACK_EVENT));
}

export function emitNavForward(): void {
  document.dispatchEvent(new CustomEvent(DOC_NAV_FWD_EVENT));
}

/** A single entry in the back/forward navigation stack. */
interface NavEntry {
  path: string;
  scrollY: number;
}

/** The full history stack of visited positions. */
let stack: NavEntry[] = [];
/** Cursor into `stack` — the entry the user is currently viewing. */
let idx = -1;
/** Scroll position to restore after a cross-document nav-button navigation. */
let pendingRestore: number | null = null;
/** True while a nav-button cross-document navigation is in flight. */
let isNavBtn = false;
let ac: AbortController | undefined;

/** Returns true if the given pathname is the site home page. */
function isHomePath(p: string): boolean {
  const clean = p.replace(/\/+$/, '');
  return clean === '' || clean === '/index.html';
}

/**
 * Before a View Transition begins, snapshot the current scroll position
 * and push the destination onto the stack (unless navigating via back/fwd
 * buttons or going home).
 */
document.addEventListener('astro:before-preparation', function (e: Event) {
  const ev = e as Event & { to: URL; from: URL };
  const toPath = ev.to.pathname;

  if (idx >= 0) {
    stack[idx].scrollY = window.scrollY;
  }

  if (isHomePath(toPath)) {
    stack = [];
    idx = -1;
    isNavBtn = false;
    pendingRestore = null;
    return;
  }

  if (isNavBtn) return;

  stack.splice(idx + 1);
  stack.push({ path: toPath, scrollY: 0 });
  idx = stack.length - 1;
});

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  const currentPath = location.pathname;

  const backBtn = document.getElementById('doc-nav-back') as HTMLButtonElement;
  const fwdBtn = document.getElementById('doc-nav-fwd') as HTMLButtonElement;
  if (!backBtn || !fwdBtn) return;

  if (isHomePath(currentPath)) {
    stack = [];
    idx = -1;
    pendingRestore = null;
    isNavBtn = false;
    backBtn.disabled = true;
    fwdBtn.disabled = true;
    return;
  }

  if (idx < 0) {
    stack.push({ path: currentPath, scrollY: window.scrollY });
    idx = 0;
  }

  let ignoreScrollUntil = 0;
  let scrollTimer: ReturnType<typeof setTimeout> | null = null;

  /** Enable/disable the back and forward buttons based on stack position. */
  function updateButtons() {
    backBtn.disabled = idx <= 0;
    fwdBtn.disabled = idx >= stack.length - 1;
  }

  /**
   * Flash a transient highlight on the target element after a jump.
   * Sections get `.heading-highlight` on their heading; other targets
   * get `.target-highlight`.
   */
  function highlight(el: HTMLElement) {
    const heading = el.classList.contains('doc-section')
      ? el.querySelector(':scope > .section-heading') as HTMLElement | null
      : null;
    if (heading) {
      heading.classList.remove('heading-highlight');
      void heading.offsetHeight;
      heading.classList.add('heading-highlight');
      setTimeout(function () { heading.classList.remove('heading-highlight'); }, 1800);
    } else {
      el.classList.remove('target-highlight');
      void el.offsetHeight;
      el.classList.add('target-highlight');
      setTimeout(function () { el.classList.remove('target-highlight'); }, 2100);
    }
  }

  /** Compute the absolute page-level offset top for an element. */
  function elOffsetTop(el: HTMLElement): number {
    let top = 0;
    let node: HTMLElement | null = el;
    while (node) { top += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
    return top;
  }

  /**
   * Calculate how many pixels of header + sticky heading space to subtract
   * from a scroll target's position.  When sticky mode is off, only the
   * fixed page header height is subtracted.  When on, the sticky slot for
   * the element's heading level is used instead.
   */
  function getStickyOffset(el: HTMLElement): number {
    const style = getComputedStyle(document.documentElement);
    if (!document.documentElement.classList.contains('sticky-on')) {
      return parseFloat(style.getPropertyValue('--doc-header-height')) || 0;
    }

    let heading: HTMLElement | null = null;
    if (el.classList.contains('doc-section')) {
      heading = el.querySelector(':scope > .section-heading');
    } else if (/^H[1-6]$/.test(el.tagName)) {
      heading = el;
    }

    if (heading && /^H[1-6]$/.test(heading.tagName)) {
      const level = heading.tagName.charAt(1);
      const val = style.getPropertyValue('--sticky-h' + level);
      return parseFloat(val) * parseFloat(style.fontSize) || 0;
    }

    const section = el.closest('.doc-section') as HTMLElement | null;
    if (section) {
      const sh = section.querySelector(':scope > .section-heading') as HTMLElement | null;
      if (sh && /^H[1-6]$/.test(sh.tagName)) {
        const lvl = parseInt(sh.tagName.charAt(1), 10);
        if (lvl < 6) {
          const val = style.getPropertyValue('--sticky-h' + (lvl + 1));
          return parseFloat(val) * parseFloat(style.fontSize) || 0;
        }
        const val = style.getPropertyValue('--sticky-h6');
        return (parseFloat(val) * parseFloat(style.fontSize) || 0) + sh.offsetHeight;
      }
    }

    return parseFloat(style.getPropertyValue('--doc-header-height')) || 0;
  }

  /**
   * Resolve the ideal scroll-Y for an element by id, accounting for
   * sticky offset and table-header height.
   */
  function getTargetY(id: string): number {
    const el = document.getElementById(id);
    if (!el) return 0;
    let y = elOffsetTop(el) - getStickyOffset(el);
    if (el.matches('doc-tr')) {
      const table = el.closest('doc-table');
      if (table) {
        const thead = table.querySelector('doc-thead') as HTMLElement | null;
        if (thead) y -= thead.offsetHeight;
      }
    }
    return Math.max(0, y - 8);
  }

  /** Instant-scroll to a Y position, suppressing scroll-tracking briefly. */
  function go(y: number) {
    ignoreScrollUntil = Date.now() + 500;
    window.scrollTo({ top: y, behavior: 'instant' });
  }

  function isSameDocHashLink(href: string): boolean {
    return href.charAt(0) === '#' && href.length > 1;
  }

  /**
   * Navigate to a different document via Astro's client-side router,
   * flagging the navigation as a back/forward button action.
   */
  async function navigateToEntry(entry: NavEntry) {
    isNavBtn = true;
    pendingRestore = entry.scrollY;
    try {
      // @ts-ignore — virtual module resolved by Astro's bundler
      const mod = await import('astro:transitions/client');
      mod.navigate(entry.path);
    } catch (_e) {
      location.href = entry.path;
    }
  }

  document.addEventListener('click', function (e) {
    const a = (e.target as HTMLElement).closest('.doc-link[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute('href')!;
    if (!isSameDocHashLink(href)) return;

    e.preventDefault();
    e.stopPropagation();

    const id = href.replace(/^#/, '');
    const destY = getTargetY(id);

    stack.splice(idx + 1);
    stack[idx].scrollY = window.scrollY;
    stack.push({ path: currentPath, scrollY: destY });
    idx = stack.length - 1;

    go(destY);
    try { history.replaceState(null, '', '#' + id); } catch (_ex) { /* noop */ }

    const target = document.getElementById(id);
    if (target) highlight(target);

    updateButtons();
  }, { capture: true, signal });

  window.addEventListener('scroll', function () {
    if (Date.now() < ignoreScrollUntil) return;
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      if (Date.now() < ignoreScrollUntil) return;
      if (idx < stack.length - 1) {
        stack.splice(idx + 1);
      }
      stack[idx].scrollY = window.scrollY;
      updateButtons();
    }, 250);
  }, { passive: true, signal });

  document.addEventListener(DOC_NAV_BACK_EVENT, function () {
    if (idx <= 0) return;
    stack[idx].scrollY = window.scrollY;
    idx--;
    if (stack[idx].path !== currentPath) {
      navigateToEntry(stack[idx]);
    } else {
      go(stack[idx].scrollY);
    }
    updateButtons();
  }, { signal });

  document.addEventListener(DOC_NAV_FWD_EVENT, function () {
    if (idx >= stack.length - 1) return;
    stack[idx].scrollY = window.scrollY;
    idx++;
    if (stack[idx].path !== currentPath) {
      navigateToEntry(stack[idx]);
    } else {
      go(stack[idx].scrollY);
    }
    updateButtons();
  }, { signal });

  updateButtons();

  if (pendingRestore !== null) {
    const y = pendingRestore;
    pendingRestore = null;
    isNavBtn = false;
    document.fonts.ready.then(function () {
      setTimeout(function () {
        go(y);
        stack[idx].scrollY = y;
      }, 0);
    });
  } else if (location.hash) {
    document.fonts.ready.then(function () {
      setTimeout(function () {
        const id = location.hash.slice(1);
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;
        const destY = getTargetY(id);
        go(destY);
        stack[idx].scrollY = destY;
        highlight(el);
      }, 0);
    });
  }
}

document.addEventListener('astro:page-load', init);
