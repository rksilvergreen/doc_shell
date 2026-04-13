/**
 * inspectable.ts — client-side logic for the Inspectable component.
 *
 * Delegated click handler on `.doc-inspectable` elements opens a centred
 * modal with the cloned content.  Supports mouse-wheel zoom, +/- buttons,
 * a direct zoom % input, and drag-to-pan when content overflows.
 */
export {};

const INITIAL_ZOOM = 1.2;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.2;
/** Minimum padding between modal edge and viewport edge. */
const EDGE_PAD = () => Math.max(window.innerWidth * 0.05, 40);

let ac: AbortController | undefined;

function init() {
  ac?.abort();
  ac = new AbortController();
  const signal = ac.signal;

  let activeBackdrop: HTMLElement | null = null;
  let activeModal: HTMLElement | null = null;

  // ── helpers ───────────────────────────────────────────────────────────

  function maxModalWidth() {
    return window.innerWidth - 2 * EDGE_PAD();
  }
  function maxModalHeight() {
    return window.innerHeight - 2 * EDGE_PAD();
  }

  /** Compute the zoom level at which the modal exactly fills max bounds. */
  function maxZoomForModal(srcW: number, srcH: number): number {
    const zw = maxModalWidth() / srcW;
    const zh = maxModalHeight() / srcH;
    return Math.min(zw, zh);
  }

  // ── open modal ────────────────────────────────────────────────────────

  function openModal(trigger: HTMLElement) {
    if (activeModal) closeModal();

    const srcRect = trigger.getBoundingClientRect();
    const srcW = srcRect.width;
    const srcH = srcRect.height;

    let zoom = INITIAL_ZOOM;
    const maxZoom = maxZoomForModal(srcW, srcH);
    if (zoom > maxZoom) zoom = maxZoom;

    // -- backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'inspectable-backdrop';
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add('is-visible'));

    // -- modal shell
    const modal = document.createElement('div');
    modal.className = 'inspectable-modal';

    // -- close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'inspectable-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00d7';
    modal.appendChild(closeBtn);

    // -- content viewport
    const content = document.createElement('div');
    content.className = 'inspectable-content';
    modal.appendChild(content);

    // -- sizer (provides layout dimensions for scroll area)
    const sizer = document.createElement('div');
    sizer.className = 'inspectable-sizer';
    content.appendChild(sizer);

    // -- inner (scaled clone)
    const inner = document.createElement('div');
    inner.className = 'inspectable-inner';
    inner.innerHTML = trigger.innerHTML;
    sizer.appendChild(inner);

    // -- toolbar
    const toolbar = buildToolbar();
    modal.appendChild(toolbar.root);

    document.body.appendChild(modal);

    activeBackdrop = backdrop;
    activeModal = modal;

    // ── apply zoom ──────────────────────────────────────────────────────

    function applyZoom() {
      const mzl = maxZoomForModal(srcW, srcH);
      const toolbarH = toolbar.root.offsetHeight;

      const modalW = Math.min(srcW * zoom, maxModalWidth());
      const modalH = Math.min(srcH * zoom + toolbarH, maxModalHeight());
      modal.style.width = modalW + 'px';
      modal.style.height = modalH + 'px';

      inner.style.width = srcW + 'px';
      inner.style.height = srcH + 'px';
      inner.style.transform = `scale(${zoom})`;

      sizer.style.width = (srcW * zoom) + 'px';
      sizer.style.height = (srcH * zoom) + 'px';

      const isOverflowing = zoom > mzl;
      if (isOverflowing) {
        content.classList.add('is-pannable');
      } else {
        content.classList.remove('is-pannable');
        content.scrollLeft = 0;
        content.scrollTop = 0;
      }

      toolbar.panUp.disabled = !isOverflowing;
      toolbar.panDown.disabled = !isOverflowing;
      toolbar.panLeft.disabled = !isOverflowing;
      toolbar.panRight.disabled = !isOverflowing;

      toolbar.zoomInput.value = Math.round(zoom * 100) + '%';
    }

    applyZoom();

    /**
     * Set zoom, optionally keeping a focal point (in viewport coords
     * relative to the content element) anchored in place.
     */
    function setZoom(newZoom: number, focalX?: number, focalY?: number) {
      const oldZoom = zoom;
      zoom = Math.max(MIN_ZOOM, newZoom);

      if (focalX !== undefined && focalY !== undefined) {
        const srcX = (content.scrollLeft + focalX) / oldZoom;
        const srcY = (content.scrollTop + focalY) / oldZoom;
        applyZoom();
        content.scrollLeft = srcX * zoom - focalX;
        content.scrollTop = srcY * zoom - focalY;
      } else {
        const cx = content.clientWidth / 2;
        const cy = content.clientHeight / 2;
        const srcX = (content.scrollLeft + cx) / oldZoom;
        const srcY = (content.scrollTop + cy) / oldZoom;
        applyZoom();
        content.scrollLeft = srcX * zoom - cx;
        content.scrollTop = srcY * zoom - cy;
      }
    }

    // ── wheel zoom (cursor-anchored) ────────────────────────────────────

    modal.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const rect = content.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      setZoom(zoom + delta, localX, localY);
    }, { passive: false, signal });

    // ── toolbar events ──────────────────────────────────────────────────

    toolbar.zoomIn.addEventListener('click', () => setZoom(zoom + ZOOM_STEP), { signal });
    toolbar.zoomOut.addEventListener('click', () => setZoom(zoom - ZOOM_STEP), { signal });

    const PAN_STEP = 80;
    toolbar.panUp.addEventListener('click', () => { content.scrollTop -= PAN_STEP; }, { signal });
    toolbar.panDown.addEventListener('click', () => { content.scrollTop += PAN_STEP; }, { signal });
    toolbar.panLeft.addEventListener('click', () => { content.scrollLeft -= PAN_STEP; }, { signal });
    toolbar.panRight.addEventListener('click', () => { content.scrollLeft += PAN_STEP; }, { signal });

    toolbar.zoomInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const raw = parseFloat(toolbar.zoomInput.value);
        if (!isNaN(raw) && raw > 0) setZoom(raw / 100);
        else toolbar.zoomInput.value = Math.round(zoom * 100) + '%';
      }
    }, { signal });

    toolbar.zoomInput.addEventListener('blur', () => {
      toolbar.zoomInput.value = Math.round(zoom * 100) + '%';
    }, { signal });

    // ── drag-to-pan ─────────────────────────────────────────────────────

    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let scrollStartX = 0;
    let scrollStartY = 0;

    content.addEventListener('pointerdown', (e: PointerEvent) => {
      if (!content.classList.contains('is-pannable')) return;
      if ((e.target as HTMLElement).closest('.inspectable-toolbar')) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      scrollStartX = content.scrollLeft;
      scrollStartY = content.scrollTop;
      content.classList.add('is-dragging');
      content.setPointerCapture(e.pointerId);
      e.preventDefault();
    }, { signal });

    content.addEventListener('pointermove', (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      content.scrollLeft = scrollStartX - dx;
      content.scrollTop = scrollStartY - dy;
    }, { signal });

    const endDrag = () => {
      dragging = false;
      content.classList.remove('is-dragging');
    };
    content.addEventListener('pointerup', endDrag, { signal });
    content.addEventListener('pointercancel', endDrag, { signal });

    // ── close handlers ──────────────────────────────────────────────────

    closeBtn.addEventListener('click', closeModal, { signal });
    backdrop.addEventListener('click', closeModal, { signal });
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    }, { signal });
  }

  // ── close modal ───────────────────────────────────────────────────────

  function closeModal() {
    if (activeBackdrop) {
      activeBackdrop.classList.remove('is-visible');
      const bd = activeBackdrop;
      bd.addEventListener('transitionend', () => bd.remove(), { once: true });
      setTimeout(() => bd.remove(), 300);
      activeBackdrop = null;
    }
    if (activeModal) {
      activeModal.remove();
      activeModal = null;
    }
  }

  // ── build toolbar ─────────────────────────────────────────────────────

  function buildToolbar() {
    const root = document.createElement('div');
    root.className = 'inspectable-toolbar';

    const zoomOut = makeBtn('\u2212', 'Zoom out');
    const zoomInput = document.createElement('input');
    zoomInput.type = 'text';
    zoomInput.className = 'inspectable-zoom-input';
    zoomInput.value = Math.round(INITIAL_ZOOM * 100) + '%';
    const zoomIn = makeBtn('+', 'Zoom in');

    const sep = document.createElement('span');
    sep.className = 'inspectable-toolbar-sep';

    const panUp = makeBtn('\u2191', 'Pan up', true);
    const panDown = makeBtn('\u2193', 'Pan down', true);
    const panLeft = makeBtn('\u2190', 'Pan left', true);
    const panRight = makeBtn('\u2192', 'Pan right', true);

    root.append(zoomOut, zoomInput, zoomIn, sep, panLeft, panUp, panDown, panRight);

    return { root, zoomOut, zoomIn, zoomInput, panUp, panDown, panLeft, panRight };
  }

  function makeBtn(label: string, title: string, disabled = false): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.title = title;
    btn.disabled = disabled;
    return btn;
  }

  // ── delegated click listener ──────────────────────────────────────────

  document.addEventListener('click', (e: MouseEvent) => {
    const trigger = (e.target as HTMLElement).closest('.doc-inspectable') as HTMLElement | null;
    if (!trigger) return;
    if ((e.target as HTMLElement).closest('a')) return;
    e.preventDefault();
    openModal(trigger);
  }, { signal });

  signal.addEventListener('abort', closeModal);
}

document.addEventListener('astro:page-load', init);
