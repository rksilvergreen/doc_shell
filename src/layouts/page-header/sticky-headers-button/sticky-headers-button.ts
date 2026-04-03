/**
 * sticky-headers-button — button-side wiring for the sticky headers toggle.
 *
 * Dispatches `doc-shell:sticky-toggle` on click so the core sticky-headers
 * module (doc-layout/sticky-headers.ts) applies the change.  Listens for
 * `doc-shell:sticky-change` to keep `aria-pressed` in sync.
 */
export {};

let ac: AbortController | undefined;

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  const btn = document.querySelector('.doc-sticky-toggle') as HTMLButtonElement | null;
  if (!btn) return;

  function syncPressed() {
    const on = document.documentElement.classList.contains('sticky-on');
    btn!.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  btn.addEventListener('click', function () {
    document.dispatchEvent(new CustomEvent('doc-shell:sticky-toggle'));
  }, { signal });

  document.addEventListener('doc-shell:sticky-change', syncPressed, { signal });

  syncPressed();
}

document.addEventListener('astro:page-load', init);
