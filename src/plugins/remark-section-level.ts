/**
 * remark-section-level — MDX remark plugin that auto-injects `_level` and
 * `_num` into every <Section> element, and builds a TocEntry[] tree that
 * is attached to the file's frontmatter as `_toc`.
 *
 * `_level` is the 1-based heading depth ("1", "2", …) used by the Section
 * component to pick the right <h1>–<h6> tag.
 *
 * `_num` is the hierarchical section number (e.g. "1", "1.1", "1.1.1")
 * derived from sibling position within the document.
 *
 * The TocEntry[] tree is exposed to Astro via
 * `file.data.astro.frontmatter._toc` so that page templates can collect
 * it from `remarkPluginFrontmatter._toc` after calling `render()`.
 *
 * Additionally, `_toc` is injected as a named ESM export so that other
 * MDX files can import it:
 *   import Content, { _toc } from './partial.mdx';
 *
 * Partial-file support
 * --------------------
 * When an MDX file sets `_sectionBase` in its frontmatter (e.g.
 * `_sectionBase: "4.2"`), the plugin treats the file's top-level
 * <Section> elements as children of that base number.  The first section
 * receives `_num = "4.2.1"`, the second `_num = "4.2.2"`, and so on.
 * `_level` is similarly offset so headings render at the correct depth.
 *
 * Usage (astro.config):
 *   import { remarkSectionLevel } from 'doc-shell/plugins/remark-section-level';
 *   integrations: [mdx({ remarkPlugins: [remarkSectionLevel] })]
 */
import type { TocEntry } from "../layouts/toc/toc.astro";

interface MdxJsxAttribute {
  type: "mdxJsxAttribute";
  name: string;
  value: string | null;
}

interface MdastNode {
  type: string;
  name?: string;
  value?: string;
  attributes?: MdxJsxAttribute[];
  children?: MdastNode[];
  data?: Record<string, any>;
}

function getAttr(node: MdastNode, name: string): string | undefined {
  return node.attributes?.find((a) => a.name === name)?.value ?? undefined;
}

function pushAttr(node: MdastNode, name: string, value: string): void {
  if (!node.attributes) node.attributes = [];
  node.attributes.push({ type: "mdxJsxAttribute", name, value });
}

function walk(
  node: MdastNode,
  depth: number,
  parentNum: string,
  tocParent: TocEntry[],
  idxOffset: number = 0,
): void {
  let sectionIdx = idxOffset;
  if (!node.children) return;
  for (const child of node.children) {
    if (child.type === "mdxJsxFlowElement" && child.name === "Section") {
      sectionIdx++;
      const newDepth = depth + 1;
      const num = parentNum ? `${parentNum}.${sectionIdx}` : `${sectionIdx}`;

      const id = getAttr(child, "id");
      const title = getAttr(child, "title");

      pushAttr(child, "_level", String(newDepth));
      pushAttr(child, "_num", num);

      const entry: TocEntry = { id: id!, text: title!, num };
      tocParent.push(entry);

      const children: TocEntry[] = [];
      walk(child, newDepth, num, children);
      if (children.length) entry.children = children;
    } else {
      walk(child, depth, parentNum, tocParent);
    }
  }
}

/**
 * Parse `_sectionBase` (e.g. "4.2") into the initial walk() parameters.
 *
 *   "4.2" → { parentNum: "4.2", depth: 2, idxOffset: 0 }
 *   ""     → { parentNum: "",   depth: 0, idxOffset: 0 }
 */
function parseSectionBase(base: string | undefined): {
  parentNum: string;
  depth: number;
  idxOffset: number;
} {
  if (!base) return { parentNum: "", depth: 0, idxOffset: 0 };
  const parts = base.split(".");
  return {
    parentNum: base,
    depth: parts.length,
    idxOffset: 0,
  };
}

/** Convert a plain JS value into an ESTree expression node. */
function valueToEstree(value: unknown): any {
  if (value === null || value === undefined)
    return { type: "Literal", value: null, raw: "null" };
  if (typeof value === "string")
    return { type: "Literal", value, raw: JSON.stringify(value) };
  if (typeof value === "number")
    return { type: "Literal", value, raw: String(value) };
  if (typeof value === "boolean")
    return { type: "Literal", value, raw: String(value) };
  if (Array.isArray(value)) {
    return {
      type: "ArrayExpression",
      elements: value.map((v) => valueToEstree(v)),
    };
  }
  if (typeof value === "object") {
    return {
      type: "ObjectExpression",
      properties: Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([key, val]) => ({
          type: "Property",
          method: false,
          shorthand: false,
          computed: false,
          key: { type: "Identifier", name: key },
          value: valueToEstree(val),
          kind: "init",
        })),
    };
  }
  return { type: "Literal", value: null, raw: "null" };
}

/** Build an `mdxjsEsm` AST node for `export const _toc = <value>;` */
function buildTocExportNode(toc: TocEntry[]): MdastNode {
  return {
    type: "mdxjsEsm",
    value: `export const _toc = ${JSON.stringify(toc)};`,
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        comments: [],
        body: [
          {
            type: "ExportNamedDeclaration",
            declaration: {
              type: "VariableDeclaration",
              kind: "const",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: { type: "Identifier", name: "_toc" },
                  init: valueToEstree(toc),
                },
              ],
            },
            specifiers: [],
            source: null,
          },
        ],
      },
    },
  };
}

export function remarkSectionLevel() {
  return (tree: MdastNode, file: any) => {
    const sectionBase: string | undefined =
      file.data?.astro?.frontmatter?._sectionBase;
    const { parentNum, depth, idxOffset } = parseSectionBase(sectionBase);

    const toc: TocEntry[] = [];
    walk(tree, depth, parentNum, toc, idxOffset);

    if (!file.data) file.data = {};
    if (!file.data.astro) file.data.astro = {};
    if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {};
    file.data.astro.frontmatter._toc = toc;

    if (!tree.children) tree.children = [];
    tree.children.push(buildTocExportNode(toc));
  };
}
