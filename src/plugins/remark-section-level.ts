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

export function remarkSectionLevel() {
  return (tree: MdastNode, file: any) => {
    const toc: TocEntry[] = [];
    walk(tree, 0, "", toc);

    if (!file.data) file.data = {};
    if (!file.data.astro) file.data.astro = {};
    if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {};
    file.data.astro.frontmatter._toc = toc;
  };
}
