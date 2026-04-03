/**
 * document-dropdown — open/close logic, keyboard navigation, click-outside
 * dismissal, and label sync for the header document dropdown.
 *
 * Because the header uses transition:persist, the dropdown DOM survives
 * across View Transition navigations.  On each page load, syncLabel()
 * reads the current URL path to determine which document is active and
 * updates the trigger label + menu .is-active class accordingly.
 */
export {};

/**
 * Read the current URL to determine which document is active, update the
 * trigger label text, and mark the matching menu item with `.is-active`.
 */
function syncLabel() {
  const trigger = document.getElementById('doc-dropdown-trigger');
  const menu = document.getElementById('doc-dropdown-menu');
  if (!trigger || !menu) return;

  trigger.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');

  const path = window.location.pathname.replace(/\/+$/, '');
  const slug = path.split('/').filter(Boolean).pop() || '';

  const items = menu.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]');
  let matchedTitle = '';
  items.forEach((a) => {
    const itemSlug = a.getAttribute('data-slug') || '';
    const active = itemSlug === slug;
    a.classList.toggle('is-active', active);
    if (active) matchedTitle = a.textContent?.trim() || '';
  });

  const label = trigger.querySelector('.doc-dropdown-label');
  if (label) {
    label.textContent = matchedTitle || trigger.getAttribute('data-site-title') || 'Documents';
  }
}

/** Wire up open/close, keyboard navigation, and click-outside dismissal. */
function initDropdown(signal: AbortSignal) {
  const trigger = document.getElementById('doc-dropdown-trigger');
  const menu = document.getElementById('doc-dropdown-menu');
  if (!trigger || !menu) return;

  syncLabel();

  function open() {
    trigger!.setAttribute('aria-expanded', 'true');
    menu!.classList.add('is-open');
    const active = menu!.querySelector<HTMLAnchorElement>('.is-active') ||
      menu!.querySelector<HTMLAnchorElement>('[role="menuitem"]');
    active?.focus();
  }

  function close() {
    trigger!.setAttribute('aria-expanded', 'false');
    menu!.classList.remove('is-open');
  }

  function toggle() {
    trigger!.getAttribute('aria-expanded') === 'true' ? close() : open();
  }

  trigger.addEventListener('click', toggle, { signal });

  document.addEventListener('click', function (e) {
    if (!(e.target as HTMLElement).closest('#doc-dropdown')) close();
  }, { signal });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  }, { signal });

  menu.addEventListener('keydown', function (e) {
    const items = Array.from(menu!.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]'));
    const idx = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    }
  }, { signal });
}

let ac: AbortController | undefined;
document.addEventListener('astro:page-load', function () {
  ac?.abort();
  ac = new AbortController();
  initDropdown(ac.signal);
});
