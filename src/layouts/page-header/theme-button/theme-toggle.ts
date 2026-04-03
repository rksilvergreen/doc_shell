/**
 * theme-toggle — button-side wiring for the theme toggle.
 *
 * Dispatches `doc-shell:theme-toggle` on click so the core theme module
 * (main-layout/theme.ts) applies the change.  Listens for
 * `doc-shell:theme-change` to keep the sun/moon icon in sync.
 */
export {};

let ac: AbortController | undefined;

function isDark(): boolean {
  return document.documentElement.getAttribute('data-theme') !== 'light';
}

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  const btn = document.getElementById('theme-toggle') as HTMLButtonElement;
  if (!btn) return;

  const sunEl = btn.querySelector('.icon-sun') as SVGElement;
  const moonEl = btn.querySelector('.icon-moon') as SVGElement;

  function syncIcon() {
    const dark = isDark();
    sunEl.style.display = dark ? '' : 'none';
    moonEl.style.display = dark ? 'none' : '';
    btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', btn.title);
  }

  btn.addEventListener('click', function () {
    document.dispatchEvent(new CustomEvent('doc-shell:theme-toggle'));
  }, { signal });

  document.addEventListener('doc-shell:theme-change', syncIcon, { signal });

  syncIcon();
}

init();
document.addEventListener('astro:page-load', init);
