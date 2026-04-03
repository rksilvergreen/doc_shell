/**
 * link-preview — unified hover-preview system for all LinkTarget elements.
 *
 * Replaces the former section-tooltip.ts and row-tooltip.ts with a single
 * delegated handler.  Any .doc-link whose href resolves to a .doc-link-target
 * element triggers a preview tooltip on hover.
 *
 * Preview content is adapted by element context:
 *   .doc-section  — section heading + direct non-section children (char-budgeted)
 *   table row     — doc-table header + the target row (with live column widths)
 *   other         — all children cloned (char-budgeted)
 *
 * Cross-document links (href with a path before #) are fetched, parsed, and
 * cached.  TOC links get a dark backdrop; inline links don't.
 */
export {};

/** Cache of fetched cross-document HTML pages (keyed by normalised path). */
const pageCache = new Map<string, Document>();

/**
 * Parse a link href into a path (null for same-page) and a hash id.
 * Returns null if the href has no hash target.
 */
function resolveLink(href: string): { path: string | null; hash: string } | null {
  if (!href || href === '#') return null;
  const hashIdx = href.indexOf('#');
  if (hashIdx === -1) return null;
  const hash = href.slice(hashIdx + 1);
  if (!hash) return null;
  const path = hashIdx === 0 ? null : href.slice(0, hashIdx);
  return { path, hash };
}

/**
 * Return the Document containing the target element.  Same-page links
 * return the live `document`; cross-document links are fetched, parsed,
 * and cached.
 */
async function getDocument(path: string | null): Promise<Document> {
  if (!path) return document;
  const key = path.replace(/\/$/, '') || '/';
  if (pageCache.has(key)) return pageCache.get(key)!;
  const resp = await fetch(path);
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  pageCache.set(key, doc);
  return doc;
}

/**
 * Resolve a human-friendly document title for preview bars.
 * Prefer the dropdown's active document label; fall back to <title>.
 */
function getPreviewDocTitle(doc: Document): string | null {
  const dropdownLabel = doc.querySelector('.doc-dropdown-label')?.textContent?.trim();
  if (dropdownLabel) return dropdownLabel;
  const pageTitle = doc.title?.trim();
  return pageTitle || null;
}

let ac: AbortController | undefined;

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  /** Max text characters cloned into any single preview. */
  const CHAR_BUDGET = 1200;
  /** Max tooltip width in px (mirrored in link-preview.css). */
  const SECTION_MAX_W = 1500;
  /** Max tooltip height in px (mirrored in link-preview.css). */
  const SECTION_MAX_H = 1020;
  const SCALE = 1.00;

  const sectionTip = document.createElement('div');
  sectionTip.className = 'section-preview-tooltip';
  const rowTip = document.createElement('div');
  rowTip.className = 'row-preview-tooltip';
  const backdrop = document.createElement('div');
  backdrop.className = 'section-preview-backdrop';

  document.body.appendChild(backdrop);
  document.body.appendChild(sectionTip);
  document.body.appendChild(rowTip);

  let activeTip: HTMLElement | null = null;
  let activeLink: HTMLAnchorElement | null = null;

  // ── Section preview ────────────────────────────────────────────────────

  /**
   * Build a section preview: heading + direct non-section children
   * (char-budgeted).  Returns false if the section has no heading.
   */
  function buildSectionPreview(section: HTMLElement, docTitle?: string): boolean {
    const heading = section.querySelector(':scope > .section-heading');
    if (!heading) return false;

    const inner = document.createElement('div');
    inner.className = 'sec-preview-inner document';

    const h = document.createElement(heading.tagName);
    h.textContent = heading.textContent;
    inner.appendChild(h);

    let chars = 0;
    for (const child of Array.from(section.children)) {
      if (child === heading) continue;
      if ((child as HTMLElement).classList?.contains('doc-section')) continue;
      const clone = child.cloneNode(true) as HTMLElement;
      inner.appendChild(clone);
      chars += (child.textContent || '').length;
      if (chars >= CHAR_BUDGET) break;
    }

    sectionTip.innerHTML = '';
    sectionTip.style.setProperty('--sec-preview-scale', String(SCALE));

    if (docTitle) {
      const bar = document.createElement('div');
      bar.className = 'sec-preview-doc-title';
      bar.textContent = docTitle;
      sectionTip.appendChild(bar);
    }

    sectionTip.appendChild(inner);

    const rawW = inner.scrollWidth * SCALE;
    const titleBar = sectionTip.querySelector('.sec-preview-doc-title') as HTMLElement | null;
    const titleH = titleBar ? titleBar.offsetHeight : 0;
    const rawH = inner.scrollHeight * SCALE + titleH;
    sectionTip.dataset.idealW = String(Math.min(rawW + 2, SECTION_MAX_W));
    sectionTip.dataset.idealH = String(Math.min(rawH + 2, SECTION_MAX_H));

    return true;
  }

  // ── Row preview ────────────────────────────────────────────────────────

  /** Remove all `id` attributes from an element tree to avoid duplicates. */
  function stripIds(root: ParentNode): void {
    if (root instanceof Element && root.id) root.removeAttribute('id');
    root.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  }

  /**
   * Build a table-row preview: cloned thead + target row.  When the
   * link is same-page, column widths are copied from the live table
   * so the preview matches the original layout.
   */
  function buildRowPreview(row: HTMLElement, isSamePage: boolean): boolean {
    const table = row.closest('doc-table');
    if (!table) return false;

    const tableClone = table.cloneNode(false) as HTMLElement;
    tableClone.style.width = 'auto';
    tableClone.style.minHeight = 'auto';

    const thead = table.querySelector('doc-thead');
    if (isSamePage) {
      const sourceThs = table.querySelectorAll<HTMLElement>('doc-thead doc-th');
      if (!sourceThs.length) return false;
      const colWidths: number[] = [];
      sourceThs.forEach(th => colWidths.push(th.getBoundingClientRect().width));

      tableClone.style.tableLayout = 'fixed';
      if (thead) {
        const theadClone = thead.cloneNode(true) as HTMLElement;
        theadClone.querySelectorAll<HTMLElement>('doc-th').forEach((th, i) => {
          if (i < colWidths.length) th.style.width = colWidths[i] + 'px';
        });
        tableClone.appendChild(theadClone);
      }
    } else {
      tableClone.style.tableLayout = 'auto';
      if (thead) tableClone.appendChild(thead.cloneNode(true));
    }

    const tbody = document.createElement('doc-tbody');
    const rowClone = row.cloneNode(true) as HTMLElement;
    stripIds(rowClone);
    tbody.appendChild(rowClone);
    tableClone.appendChild(tbody);

    const wrapper = document.createElement('div');
    wrapper.className = 'document';
    wrapper.appendChild(tableClone);

    rowTip.innerHTML = '';
    rowTip.appendChild(wrapper);
    return true;
  }

  // ── Generic preview ────────────────────────────────────────────────────

  /**
   * Build a generic preview for non-section, non-row targets by cloning
   * their child nodes up to CHAR_BUDGET.
   */
  function buildGenericPreview(target: HTMLElement, docTitle?: string): boolean {
    const inner = document.createElement('div');
    inner.className = 'sec-preview-inner sec-preview-inner--fit document';

    let chars = 0;
    // Use childNodes so direct text (e.g. " — description" after inline elements in <li>)
    // is included; target.children is element-only and would drop those text nodes.
    for (const node of Array.from(target.childNodes)) {
      if (chars >= CHAR_BUDGET) break;
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        if (!text) continue;
        inner.appendChild(node.cloneNode(false));
        chars += text.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const child = node as HTMLElement;
        inner.appendChild(child.cloneNode(true) as HTMLElement);
        chars += (child.textContent || '').length;
      }
      if (chars >= CHAR_BUDGET) break;
    }
    if (!inner.children.length) {
      if (!target.textContent?.trim()) return false;
      const clone = target.cloneNode(true) as HTMLElement;
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      inner.appendChild(clone);
    }

    sectionTip.innerHTML = '';
    sectionTip.style.setProperty('--sec-preview-scale', String(SCALE));

    if (docTitle) {
      const bar = document.createElement('div');
      bar.className = 'sec-preview-doc-title';
      bar.textContent = docTitle;
      sectionTip.appendChild(bar);
    }

    sectionTip.appendChild(inner);

    const rawW = inner.scrollWidth * SCALE;
    const titleBar = sectionTip.querySelector('.sec-preview-doc-title') as HTMLElement | null;
    const titleH = titleBar ? titleBar.offsetHeight : 0;
    const rawH = inner.scrollHeight * SCALE + titleH;
    sectionTip.dataset.idealW = String(Math.min(rawW + 2, SECTION_MAX_W));
    sectionTip.dataset.idealH = String(Math.min(rawH + 2, SECTION_MAX_H));

    return true;
  }

  // ── Positioning ────────────────────────────────────────────────────────

  /**
   * Position the section/generic tooltip relative to the trigger link.
   * TOC links open to the right of the sidebar; inline links open below
   * (or above if there isn't enough space).
   */
  function positionSectionTip(link: HTMLElement) {
    const rect = link.getBoundingClientRect();
    const margin = 10;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxAvailW = vw - 2 * margin;
    const maxAvailH = vh - 2 * margin;
    const isTocLink = link.closest('.doc-toc') !== null;

    let idealW = Number(sectionTip.dataset.idealW) || SECTION_MAX_W;
    let idealH = Number(sectionTip.dataset.idealH) || SECTION_MAX_H;
    let tw = Math.min(idealW, maxAvailW);
    let th = Math.min(idealH, maxAvailH);

    let left: number;
    let top: number;

    if (isTocLink) {
      left = rect.right + margin;
      top = rect.top;
      tw = Math.min(tw, vw - left - margin);
      if (tw < 200) { left = margin; tw = maxAvailW; }
      if (top + th > vh - margin) top = vh - th - margin;
      if (top < margin) top = margin;
      th = Math.min(th, vh - top - margin);
    } else {
      left = rect.left;
      if (left + tw > vw - margin) left = vw - tw - margin;
      if (left < margin) left = margin;
      tw = Math.min(tw, vw - left - margin);
      const spaceBelow = vh - rect.bottom - margin;
      const spaceAbove = rect.top - margin;
      if (th <= spaceBelow) {
        top = rect.bottom + margin;
      } else if (th <= spaceAbove) {
        top = rect.top - th - margin;
      } else if (spaceBelow >= spaceAbove) {
        top = rect.bottom + margin;
        th = spaceBelow;
      } else {
        top = margin;
        th = spaceAbove;
      }
    }

    sectionTip.style.width = tw + 'px';
    sectionTip.style.height = th + 'px';
    sectionTip.style.top = top + 'px';
    sectionTip.style.left = left + 'px';
  }

  /** Position the row tooltip below (or above) the trigger link. */
  function positionRowTip(link: HTMLElement) {
    const rect = link.getBoundingClientRect();
    const margin = 10;
    const tw = rowTip.offsetWidth;
    const th = rowTip.offsetHeight;

    let top = rect.bottom + margin;
    if (top + th > window.innerHeight - margin) {
      top = rect.top - th - margin;
    }

    let left = rect.left;
    if (left + tw > window.innerWidth - margin) {
      left = window.innerWidth - tw - margin;
    }
    if (left < margin) left = margin;

    rowTip.style.top = top + 'px';
    rowTip.style.left = left + 'px';
  }

  // ── Show / hide ────────────────────────────────────────────────────────

  /**
   * Resolve the link, fetch the target document if needed, build the
   * appropriate preview (section / row / generic), and display it.
   */
  async function showPreview(link: HTMLAnchorElement) {
    if (link === activeLink) return;
    if (link.hasAttribute('data-skip-preview')) return;

    const href = link.getAttribute('href');
    if (!href) return;
    const parsed = resolveLink(href);
    if (!parsed) return;

    let sourceDoc: Document;
    try {
      sourceDoc = await getDocument(parsed.path);
    } catch { return; }

    const el = sourceDoc.getElementById(parsed.hash);
    if (!el) return;
    const target = el.classList.contains('doc-link-target')
      ? el
      : el.closest('.doc-link-target') as HTMLElement | null;
    if (!target) return;

    const isSamePage = !parsed.path;
    const docTitle = parsed.path ? getPreviewDocTitle(sourceDoc) : null;
    let ok = false;
    let tip: HTMLElement;

    if (target.tagName === 'DOC-TR') {
      ok = buildRowPreview(target, isSamePage);
      tip = rowTip;
    } else if (target.classList.contains('doc-section')) {
      ok = buildSectionPreview(target, docTitle || undefined);
      tip = sectionTip;
    } else {
      ok = buildGenericPreview(target, docTitle || undefined);
      tip = sectionTip;
    }

    if (!ok) return;

    activeLink = link;
    activeTip = tip;

    const isTocLink = link.closest('.doc-toc') !== null;
    if (isTocLink) backdrop.classList.add('is-visible');
    else backdrop.classList.remove('is-visible');

    tip.classList.add('is-visible');

    if (tip === sectionTip) {
      positionSectionTip(link);
      sectionTip.classList.toggle('has-overflow', sectionTip.scrollHeight > sectionTip.clientHeight + 1);
    } else {
      positionRowTip(link);
    }
  }

  /** Hide the active tooltip and backdrop. */
  function hidePreview() {
    activeLink = null;
    if (activeTip) activeTip.classList.remove('is-visible');
    activeTip = null;
    backdrop.classList.remove('is-visible');
  }

  // ── Delegated events ───────────────────────────────────────────────────

  document.addEventListener('mouseover', function (e) {
    const a = (e.target as HTMLElement).closest('.doc-link') as HTMLAnchorElement | null;
    if (a) showPreview(a);
  }, { signal });

  document.addEventListener('mouseout', function (e) {
    const a = (e.target as HTMLElement).closest('.doc-link') as HTMLAnchorElement | null;
    if (a && !a.contains(e.relatedTarget as Node)) hidePreview();
  }, { signal });

  signal.addEventListener('abort', () => {
    sectionTip.remove();
    rowTip.remove();
    backdrop.remove();
  });
}

document.addEventListener('astro:page-load', init);
