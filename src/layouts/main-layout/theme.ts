/**
 * theme — core dark/light theme feature.
 *
 * Dark mode is the default (no `data-theme` attribute on `<html>`).
 * Light mode sets `[data-theme="light"]`.  The preference is persisted
 * to localStorage under "doc-shell-theme" and restored before first
 * paint by the inline script in MainLayout.
 *
 * Communication with the theme button:
 *   - Listens for `doc-shell:theme-toggle` → toggles the theme
 *   - Dispatches `doc-shell:theme-change`  → button syncs its icon
 */
export {};

const STORAGE_KEY = 'doc-shell-theme';
let ac: AbortController | undefined;

/** Returns true when the current theme is dark (the default). */
function isDark(): boolean {
  return document.documentElement.getAttribute('data-theme') !== 'light';
}

/** Apply theme and persist the preference to localStorage. */
function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  } catch (_e) { /* noop */ }
  document.dispatchEvent(new CustomEvent('doc-shell:theme-change'));
}

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  let dark = true;
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'light') dark = false;
  } catch (_e) { /* noop */ }
  applyTheme(dark);

  document.addEventListener('doc-shell:theme-toggle', function () {
    applyTheme(!isDark());
  }, { signal });
}

init();
document.addEventListener('astro:page-load', init);
