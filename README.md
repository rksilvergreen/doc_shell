# doc-shell

An Astro layout library for long-form, single-page reference documents. It provides a persistent page header, a fixed sidebar table of contents, sticky section headings, hover previews, in-page navigation history, a dark/light theme toggle, automatic section numbering, and a complete typographic baseline — all from a handful of layout components and a remark plugin.

## Quick start

### 1. Install

Add `doc-shell` and `@astrojs/mdx` as dependencies in your Astro project:

```json
{
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "doc-shell": "file:../doc_shell"
  }
}
```

### 2. Configure Astro

Register the MDX integration with the `remarkSectionLevel` plugin. This plugin automatically assigns heading levels, section numbers, and builds the sidebar TOC from your `<Section>` nesting in MDX.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkSectionLevel } from 'doc-shell/plugins/remark-section-level';

export default defineConfig({
  integrations: [mdx({ remarkPlugins: [remarkSectionLevel] })],
});
```

### 3. Define a content collection

Create a `documents` content collection. Each document is an MDX file with `title`, an optional `description`, and an `order` field for sorting.

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

export const collections = {
  documents: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      order: z.number(),
    }),
  }),
};
```

### 4. Write content in MDX

Content is authored using nested `<Section>` components. The `remarkSectionLevel` plugin reads the nesting to auto-inject heading levels (`_level`), section numbers (`_num`), and the sidebar TOC entries. You never set those manually.

```mdx
---
title: "My Document"
description: "A short description for the home page card."
order: 1
---

<Section id="sec-1" title="Introduction">

This is the introduction.

<Section id="sec-1-1" title="Background">

Nested sections become deeper headings automatically.
Use <Link to="sec-2">cross-references</Link> to link between sections.

</Section>
</Section>

<Section id="sec-2" title="Details">

Another top-level section.

</Section>
```

Components like `Section`, `Link`, `LinkTarget`, and the full `Table` family (`Table`, `THead`, `TBody`, `TR`, `TH`, `TD`) are automatically available in MDX — `DocLayout` registers them as default MDX components. You do not need to import them in your content files.

### 5. Create pages

**Home page** — renders a card grid linking to each document:

```astro
---
// src/pages/index.astro
import MainLayout from "doc-shell/layouts/main-layout/main-layout.astro";
import HomePage from "doc-shell/layouts/home-page/home-page.astro";
import { getCollection, type CollectionEntry } from "astro:content";

const title = "My Docs";
const collection: CollectionEntry<"documents">[] = (
  await getCollection("documents")
).sort((a, b) => a.data.order - b.data.order);
---

<MainLayout title={title} collection={collection} buttons={{ theme: true }}>
  <HomePage title={title} collection={collection} />
</MainLayout>
```

**Document page** — renders a single document with TOC sidebar:

```astro
---
// src/pages/[doc].astro
import MainLayout from "doc-shell/layouts/main-layout/main-layout.astro";
import DocLayout from "doc-shell/layouts/doc-layout/doc-layout.astro";
import { getCollection, type CollectionEntry } from "astro:content";

export async function getStaticPaths() {
  const collection = (await getCollection("documents")).sort(
    (a, b) => a.data.order - b.data.order,
  );
  return collection.map((entry) => ({
    params: { doc: entry.slug },
    props: { entry, collection },
  }));
}

const { entry, collection } = Astro.props;
---

<MainLayout title="My Docs" collection={collection} entry={entry}>
  <DocLayout entry={entry} />
</MainLayout>
```

### 6. Pass custom MDX components (optional)

If your project defines its own Astro components for use in MDX, pass them to `DocLayout` via the `components` prop. They merge with the built-in set, so `Section`, `Link`, etc. remain available.

```astro
---
import Tag from "../components/tag/tag.astro";
import Note from "../components/note/note.astro";
const components = { Tag, Note };
---

<DocLayout entry={entry} components={components} />
```

Then use them directly in your `.mdx` files:

```mdx
<Section id="sec-1" title="Overview">

This section covers <Tag>important</Tag> topics.

<Note>This is a custom callout component.</Note>

</Section>
```

## Architecture

### Shell components (`src/layouts/`)

The `src/layouts/` directory contains the **shell** — the structural UI that wraps every page. These are not meant for use inside content files; they are the page-level chrome that consuming projects import in their Astro page files.

| Layout | Purpose |
|---|---|
| `main-layout/main-layout.astro` | The HTML document shell (`<html>`, `<head>`, `<body>`). Provides meta tags, fonts (DM Sans + Libre Baskerville), View Transitions, pre-paint `localStorage` restoration (theme, sticky headers, heading numbers), and the persistent `PageHeader`. Every page wraps its content in this. |
| `doc-layout/doc-layout.astro` | The single-document view. Renders the entry via `entry.render()`, reads the auto-generated TOC from `remarkPluginFrontmatter._toc`, renders the resizable TOC sidebar and `<main>` content area, and loads client scripts for sticky headers, heading numbers, and navigation. |
| `home-page/home-page.astro` | A landing page card grid. Renders a title and a card for each document in the collection (title + description + link). |
| `page-header/page-header.astro` | The persistent toolbar at the top of every page (persisted across View Transitions). Contains: home button, back/forward nav, document dropdown, sticky-headers toggle, heading-numbers toggle, and theme toggle. Button visibility is controlled via the `buttons` prop. |
| `toc/toc.astro` | The sidebar table of contents. Receives a `TocEntry[]` tree, flattens it into indented links with `data-depth` attributes, and loads client scripts for resize and active-section tracking. |

### Content components (`src/components/`)

The `src/components/` directory contains **content-level components** for use inside MDX documents. `DocLayout` automatically registers all of these as default MDX components, so they are available in `.mdx` files without explicit imports.

| Component | Purpose |
|---|---|
| `section/section.astro` | Wraps a heading and its content. Accepts `id` and `title`; the remark plugin auto-injects `_level` and `_num`. Renders the appropriate `<h1>`–`<h6>` tag based on nesting depth. Sections are linkable and previewable via `LinkTarget`. |
| `link/link.astro` | An internal cross-reference anchor. The `to` prop accepts a bare id (`"sec-2-1"`), a hash (`"#sec-2-1"`), or a full path (`"/other-doc/#sec-2"`). Links get the `.doc-link` class for hover preview integration. |
| `link-target/link-target.astro` | Marks any element as linkable and previewable. Used internally by `Section` and `TR`, but can also be used directly for arbitrary preview targets. |
| `table/table.astro` | A styled document table wrapped in `.doc-table-wrap`. Uses custom elements (`doc-table`, `doc-tr`, etc.) for styling control. |
| `table/tr.astro` | A table row. When given an `id`, it becomes a linkable, previewable target (row previews show the row with its header). |
| `table/thead.astro`, `tbody.astro`, `th.astro`, `td.astro` | Thin wrappers emitting custom elements for consistent table styling in MDX. |

### Remark plugin (`src/plugins/`)

| Plugin | Purpose |
|---|---|
| `remark-section-level.ts` | Walks the MDX AST for `<Section>` elements. For each one, it injects `_level` (heading depth) and `_num` (hierarchical number like `"2.3.1"`), and builds a `TocEntry[]` tree attached to `file.data.astro.frontmatter._toc`. This is what powers the sidebar TOC — no hand-maintained TOC file is needed. |

## Layout API

### MainLayout

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Page `<title>` text |
| `collection` | `CollectionEntry<"documents">[]` | All document entries (used for the header dropdown) |
| `entry` | `CollectionEntry<"documents">` | The active document entry (omit on the home page) |
| `buttons` | `HeaderButtons` | Which header buttons to show (all visible by default) |

**Slot:** default — body content rendered after the PageHeader.

### DocLayout

| Prop | Type | Description |
|---|---|---|
| `entry` | `CollectionEntry<"documents">` | The content collection entry to render |
| `components` | `Record<string, any>` | Additional MDX components to merge with the built-in set |

### HomePage

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Site-level title for the page heading |
| `collection` | `CollectionEntry<"documents">[]` | Document entries to render as cards |

### HeaderButtons

Controls which buttons appear in the page header toolbar. When a `buttons` object is passed to `MainLayout`, only keys set to `true` are shown. When omitted, all buttons are visible.

```ts
interface HeaderButtons {
  home?: boolean;
  nav?: boolean;
  dropdown?: boolean;
  stickyHeaders?: boolean;
  headingNumbers?: boolean;
  theme?: boolean;
}
```

## Features

### Table of contents sidebar

A fixed sidebar on the left with resizable width (drag the right edge). The active section is highlighted as you scroll. Width is persisted to `localStorage`. The TOC is generated automatically by the `remarkSectionLevel` plugin from your `<Section>` nesting — no separate TOC file is needed.

### Sticky section headings

When enabled (toggle in the page header), headings stack at the top of the viewport as you scroll, forming a breadcrumb trail of the current section hierarchy. The toggle state is persisted to `localStorage`.

#### How sticky headers behave

The sticky header stack always consists of headers at consecutive nesting levels, forming an ancestor chain from the shallowest (top) to the deepest (bottom).

**Scrolling down** — transitions occur when the upcoming header meets the bottom edge of the sticky stack:

- **Deeper level** (child) — attaches to the bottom of the stack.
- **Same level** (sibling) — slides up and replaces the current header at that level.
- **Shallower level** (ancestor) — slides up past deeper headers, removing them from the stack.

**Scrolling up** — the process reverses: headers detach from the stack when their original document position scrolls back into view.

### Automatic section numbering

When enabled (toggle in the page header), sections display their hierarchical number (e.g. "2.3.1") before the title. Numbers are computed by the remark plugin based on `<Section>` nesting order. The toggle state is persisted to `localStorage`.

### Hover previews

- **Section links** (`#sec-*`) — hovering shows a floating preview of that section's content.
- **Row links** (`#row-*`) — hovering shows a floating preview of the table row with its header.
- Links with `[data-skip-preview]` are excluded, allowing consumers to implement their own tooltip systems.

### Navigation history

Clicking any internal `#`-link pushes the current scroll position onto a stack. The back/forward buttons in the page header step through this stack. Target elements receive a brief highlight animation after each jump.

### Dark / light theme

Dark is the default. Click the sun/moon icon in the page header to switch. Preference is persisted to `localStorage` and restored before first paint (no flash).

### Document dropdown

When a site has multiple documents, the page header shows a dropdown to navigate between them.

### View Transitions

Pages use Astro View Transitions for smooth navigation. The page header is persisted across transitions so its state (active document, toggle states) carries over.

## CSS custom properties

All colours and layout values are controlled via CSS custom properties on `:root`. Override them in your own stylesheet to customise the look.

| Variable | Purpose |
|---|---|
| `--heading-indent-step` | Left-margin increment per nesting level |
| `--doc-ink` / `--doc-ink-light` | Primary / secondary text colour |
| `--doc-cream` | Page background |
| `--doc-border` | Universal border colour |
| `--doc-highlight` | Interactive/active colour (links, TOC active) |
| `--doc-surface` | Raised-surface background (cards, table cells) |
| `--doc-toc-bg` | TOC sidebar background |
| `--doc-accent` / `--doc-accent-muted` | Accent colour (bullets, header strip) and its muted variant |
| `--doc-table-default` | Default table header background |
| `--doc-tint` / `--doc-tint-subtle` | Translucent tints for hover/active states |

## Exports

The package uses subpath exports. All imports follow the pattern `doc-shell/<folder>/<path>`:

| Import path | What it provides |
|---|---|
| `doc-shell/layouts/main-layout/main-layout.astro` | HTML shell with header, fonts, View Transitions |
| `doc-shell/layouts/doc-layout/doc-layout.astro` | Single-document view with TOC and content area |
| `doc-shell/layouts/home-page/home-page.astro` | Landing page card grid |
| `doc-shell/layouts/page-header/page-header.astro` | Page header toolbar (+ `HeaderButtons` type) |
| `doc-shell/layouts/toc/toc.astro` | TOC component (+ `TocEntry` type) |
| `doc-shell/components/*` | Content components: `section`, `link`, `link-target`, `table` |
| `doc-shell/plugins/remark-section-level` | Remark plugin for section levels and TOC generation |
| `doc-shell/styles/document.css` | Global design tokens, reset, and print styles |

## Project structure

```
doc-shell/
├── src/
│   ├── layouts/                  # Shell — page-level structure (not for use in content)
│   │   ├── main-layout/         #   HTML document shell
│   │   ├── doc-layout/          #   Single-document view + client scripts
│   │   ├── home-page/           #   Landing card grid
│   │   ├── page-header/         #   Persistent header toolbar + sub-components
│   │   └── toc/                 #   Sidebar table of contents
│   ├── components/              # Content — MDX components (for use in .mdx files)
│   │   ├── section/             #   Section wrapper with auto heading level
│   │   ├── link/                #   Internal cross-reference anchor
│   │   ├── link-target/         #   Linkable/previewable target marker
│   │   └── table/               #   Table, TR, THead, TBody, TH, TD
│   ├── plugins/
│   │   └── remark-section-level.ts  # Remark plugin for section levels + TOC
│   └── styles/
│       └── document.css         # Design tokens, reset, print styles
├── example/                     # Working example site
├── package.json
└── README.md
```

## Running the example

```bash
cd example
npm install
npm run dev
```

The example site demonstrates all doc-shell features with sample documents, nested sections, tables, cross-references, and section previews.
