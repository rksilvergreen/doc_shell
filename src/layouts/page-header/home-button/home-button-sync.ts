/**
 * home-button-sync — updates the data-show-* attributes on the persisted
 * PageHeader after every View Transition navigation.
 *
 * Because the header uses `transition:persist`, its server-rendered
 * attributes survive across page loads.  This script corrects button
 * visibility based on the current route:
 *
 *   Home page (/)   → only data-show-theme is present
 *   Doc page (/*)   → all data-show-* attributes are present
 */

export {};

/** Attributes that should only appear on doc pages. */
const DOC_ATTRS = [
  'data-show-home',
  'data-show-nav',
  'data-show-dropdown',
  'data-show-sticky',
  'data-show-heading-num',
];

function syncHeaderState() {
  const header = document.querySelector('.doc-page-header');
  if (!header) return;

  const path = window.location.pathname.replace(/\/+$/, '');
  const isHome = path === '' || path === '/';

  if (isHome) {
    DOC_ATTRS.forEach(a => header.removeAttribute(a));
  } else {
    DOC_ATTRS.forEach(a => header.setAttribute(a, ''));
  }

  header.setAttribute('data-show-theme', '');
}

document.addEventListener('astro:page-load', syncHeaderState);
