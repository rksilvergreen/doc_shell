/**
 * toc-active — highlights the current section in the TOC sidebar as the user
 * scrolls.
 *
 * Non-sticky mode: finds the last heading whose top edge has crossed above
 * 100 px from the viewport top (or the last visible heading if scrolled to the
 * very bottom).
 *
 * Sticky mode: highlights the deepest heading in the active sticky chain
 * (has .sticky-active but not .sticky-departing).  Updates are driven by the
 * "doc-shell:sticky-update" custom event dispatched by sticky-headers.ts so
 * that TOC state is always in sync with the sticky header classes.
 *
 * The matching TOC link receives .is-active and is scrolled into view within
 * the sidebar when it falls outside the visible area.
 */
export {};

let ac: AbortController | undefined;

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  const toc = document.querySelector('.doc-toc');
  const content = document.querySelector('.doc-content');
  if (!toc || !content) return;

  const links = toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
  const headings: { id: string; el: HTMLElement; a: HTMLAnchorElement }[] = [];

  links.forEach(function (a) {
    const id = a.getAttribute('href')!.slice(1);
    const el = document.getElementById(id);
    if (el) headings.push({ id, el, a });
  });

  /** Resolve the section heading element for a TOC entry. */
  function getHeading(entry: (typeof headings)[number]): HTMLElement | null {
    return entry.el.querySelector(':scope > .section-heading') || entry.el;
  }

  /**
   * Determine which TOC entry is "active" and apply `.is-active` to its
   * link.  In sticky mode, the deepest non-departing sticky heading wins.
   * In normal mode, the last heading past the 100px threshold wins.
   * When at the very bottom of the page, the last visible heading wins.
   */
  function updateActive() {
    let active: (typeof headings)[number] | null = null;
    const stickyOn = document.documentElement.classList.contains('sticky-on');

    if (stickyOn) {
      for (let i = headings.length - 1; i >= 0; i--) {
        const h = getHeading(headings[i]);
        if (h && h.classList.contains('sticky-active') && !h.classList.contains('sticky-departing')) {
          active = headings[i];
          break;
        }
      }
    } else {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
      if (atBottom) {
        for (let i = headings.length - 1; i >= 0; i--) {
          if (headings[i].el.getBoundingClientRect().top <= window.innerHeight) {
            active = headings[i];
            break;
          }
        }
      } else {
        for (let i = headings.length - 1; i >= 0; i--) {
          if (headings[i].el.getBoundingClientRect().top <= 100) {
            active = headings[i];
            break;
          }
        }
      }
    }

    if (!active && headings.length) active = headings[0];
    links.forEach(function (a) { a.classList.remove('is-active'); });
    if (active) {
      active.a.classList.add('is-active');
      const tocEl = toc as HTMLElement;
      const linkRect = active.a.getBoundingClientRect();
      const tocRect = tocEl.getBoundingClientRect();
      if (linkRect.bottom > tocRect.bottom - 20 || linkRect.top < tocRect.top + 20) {
        active.a.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  window.addEventListener('scroll', updateActive, { passive: true, signal });
  window.addEventListener('resize', updateActive, { signal });
  document.addEventListener('doc-shell:sticky-update', updateActive, { signal });
  updateActive();
}

document.addEventListener('astro:page-load', init);
