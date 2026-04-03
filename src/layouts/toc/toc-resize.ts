/**
 * toc-resize — lets the user drag the right edge of the TOC sidebar to resize
 * it.  Width is clamped between MIN_WIDTH and MAX_WIDTH and persisted to
 * localStorage so it survives reloads.  Updates the --doc-toc-width CSS
 * variable which both .doc-toc and .doc-content read for positioning.
 */
export {};

const MIN_WIDTH = 200;
const MAX_WIDTH = 480;
const STORAGE_KEY = 'doc-shell-toc-width';

let ac: AbortController | undefined;

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  const handle = document.querySelector<HTMLElement>('.doc-toc-resize');
  if (!handle) return;

  const root = document.documentElement;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const w = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Number(saved)));
    root.style.setProperty('--doc-toc-width', `${w}px`);
  }

  let startX = 0;
  let startW = 0;

  /** Update `--doc-toc-width` as the user drags the handle. */
  function onPointerMove(e: PointerEvent) {
    const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startW + (e.clientX - startX)));
    root.style.setProperty('--doc-toc-width', `${newW}px`);
    document.dispatchEvent(new CustomEvent('doc-shell:toc-width-change'));
  }

  /** End the drag and persist the final width to localStorage. */
  function onPointerUp(_e: PointerEvent) {
    handle!.classList.remove('is-dragging');
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    const current = parseInt(getComputedStyle(root).getPropertyValue('--doc-toc-width'));
    if (!isNaN(current)) localStorage.setItem(STORAGE_KEY, String(current));
    document.dispatchEvent(new CustomEvent('doc-shell:toc-width-change'));
  }

  handle.addEventListener('pointerdown', (e: PointerEvent) => {
    e.preventDefault();
    handle.classList.add('is-dragging');
    startX = e.clientX;
    startW = parseInt(getComputedStyle(root).getPropertyValue('--doc-toc-width')) || 280;
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }, { signal });
}

document.addEventListener('astro:page-load', init);
