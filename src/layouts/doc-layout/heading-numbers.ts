/**
 * heading-numbers — core feature that shows/hides section numbers in both
 * document headings and the TOC sidebar.
 *
 * The actual numbers are baked into the HTML at build time by the
 * remark-section-level plugin (as `<span class="heading-num">` inside
 * headings) and by the TOC component (as `<span class="toc-num">`).
 * This script only toggles the `heading-nums-on` class on `<html>` and
 * persists the preference.
 *
 * Preference is persisted to localStorage ("doc-shell-heading-numbers").
 *
 * Communication with the heading-num button:
 *   - Listens for `doc-shell:heading-nums-toggle`  → toggles the feature
 *   - Dispatches `doc-shell:heading-nums-change`   → button syncs aria-pressed,
 *     sticky-headers recalculates slot heights
 */
export {};

const STORAGE_KEY = "doc-shell-heading-numbers";

/** Returns true when heading numbers are currently visible. */
function isEnabled(): boolean {
  return document.documentElement.classList.contains("heading-nums-on");
}

/** Apply heading-number state, persist to localStorage, and notify. */
function setEnabled(on: boolean) {
  document.documentElement.classList.toggle("heading-nums-on", on);
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch (_e) {
    /* noop */
  }
  document.dispatchEvent(new CustomEvent("doc-shell:heading-nums-change"));
}

function init() {
  let initialOn = true;
  try {
    if (localStorage.getItem(STORAGE_KEY) === "off") initialOn = false;
  } catch (_e) {
    /* noop */
  }
  setEnabled(initialOn);

  document.addEventListener("doc-shell:heading-nums-toggle", function () {
    setEnabled(!isEnabled());
  });
}

document.addEventListener("astro:page-load", init);

/**
 * Pre-restore heading-number class after a View Transition DOM swap,
 * before the new page paints.
 */
document.addEventListener("astro:after-swap", function () {
  let on = true;
  try {
    if (localStorage.getItem(STORAGE_KEY) === "off") on = false;
  } catch (_e) {
    /* noop */
  }
  document.documentElement.classList.toggle("heading-nums-on", on);
});
