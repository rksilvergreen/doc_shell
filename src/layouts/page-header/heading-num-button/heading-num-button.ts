/**
 * heading-num-button — button-side wiring for the heading numbers toggle.
 *
 * Dispatches `doc-shell:heading-nums-toggle` on click so the core
 * heading-numbers module (doc-layout/heading-numbers.ts) applies the
 * change.  Listens for `doc-shell:heading-nums-change` to keep
 * `aria-pressed` in sync.
 */
export {};

let ac: AbortController | undefined;

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  const btn = document.querySelector('.doc-heading-num-toggle') as HTMLButtonElement | null;
  if (!btn) return;

  function syncPressed() {
    const on = document.documentElement.classList.contains('heading-nums-on');
    btn!.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  btn.addEventListener('click', function () {
    document.dispatchEvent(new CustomEvent('doc-shell:heading-nums-toggle'));
  }, { signal });

  document.addEventListener('doc-shell:heading-nums-change', syncPressed, { signal });

  syncPressed();
}

document.addEventListener('astro:page-load', init);
