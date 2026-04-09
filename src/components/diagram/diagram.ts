/**
 * diagram.ts — client-side Mermaid diagram renderer for doc-shell.
 *
 * Finds all `.doc-diagram` containers on the page, lazily loads the
 * Mermaid library from CDN, and replaces the raw source text with
 * rendered SVGs.  Respects the current dark/light theme and re-renders
 * when the theme is toggled.
 *
 * The original Mermaid source is preserved in `dataset.code` so that
 * theme-switch re-renders can reconstruct the diagram without a page
 * reload.
 */
export {};

let mermaidMod: any = null;
let counter = 0;

async function loadMermaid(): Promise<any> {
  if (!mermaidMod) {
    mermaidMod = (
      await import(
        /* @vite-ignore */
        'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
      )
    ).default;
  }
  return mermaidMod;
}

function isDark(): boolean {
  return document.documentElement.dataset.theme !== 'light';
}

function mermaidConfig() {
  const dark = isDark();
  return {
    startOnLoad: false,
    theme: dark ? 'dark' : 'default',
    themeVariables: dark
      ? {
          darkMode: true,
          background: '#222228',
          primaryColor: '#2d5a4a',
          primaryTextColor: '#dcd8d0',
          primaryBorderColor: '#5aaa8a',
          lineColor: '#5aaa8a',
          secondaryColor: '#35363d',
          tertiaryColor: '#1a1b1f',
        }
      : {
          background: '#faf8f5',
          primaryColor: '#d6ebe2',
          primaryTextColor: '#1c1c1c',
          primaryBorderColor: '#2d5a4a',
          lineColor: '#2d5a4a',
          secondaryColor: '#e8e4de',
          tertiaryColor: '#f3eee7',
        },
  };
}

async function renderDiagrams() {
  const containers = document.querySelectorAll<HTMLElement>('.doc-diagram');
  if (!containers.length) return;

  const mermaid = await loadMermaid();
  mermaid.initialize(mermaidConfig());

  for (const container of containers) {
    let code = container.dataset.code;
    if (!code) {
      const pre = container.querySelector('.doc-diagram-code');
      if (!pre) continue;
      code = (pre.textContent || '').trim();
      if (!code) continue;
      container.dataset.code = code;
    }

    if (container.classList.contains('doc-diagram-rendered')) continue;

    try {
      const id = `doc-mermaid-${counter++}`;
      const { svg } = await mermaid.render(id, code);
      container.innerHTML = svg;
      container.classList.add('doc-diagram-rendered');
    } catch (err) {
      console.error('[doc-shell] Diagram render failed:', err);
      container.classList.add('doc-diagram-error');
    }
  }
}

let ac: AbortController | undefined;

function init() {
  ac?.abort();
  ac = new AbortController();

  mermaidMod = null;
  counter = 0;

  renderDiagrams();

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        document.querySelectorAll('.doc-diagram-rendered').forEach((el) => {
          el.classList.remove('doc-diagram-rendered');
        });
        mermaidMod = null;
        renderDiagrams();
        break;
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  ac.signal.addEventListener('abort', () => observer.disconnect());
}

document.addEventListener('astro:page-load', init);
