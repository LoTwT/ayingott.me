import type { Component } from "vue"
import NicolePreview from "~/components/projects/NicolePreview.vue"

export type ProjectPreviewContent =
  | { kind: "image"; src: string; alt: string }
  | { kind: "component"; component: Component; label: string }

export interface Project {
  id: string
  name: string
  category?: string
  // Natural phrase boundaries, including spaces and punctuation. Join for plain text.
  description?: readonly string[]
  facts?: readonly { label: string; value: string }[]
  links?: readonly { label: string; href: string }[]
  preview?: ProjectPreviewContent
}

// Array order is the display order. Capabilities describe the current source;
// released installers may differ. Source and cover provenance: docs/specs/projects.md.
export const projects: readonly Project[] = [
  {
    id: "nicole",
    name: "Nicole",
    category: "桌面应用",
    description: [
      "面向",
      "个人文章",
      "与",
      "文档",
      "的",
      "轻量",
      " ",
      "Markdown",
      " ",
      "编辑器。",
    ],
    facts: [
      { label: "平台", value: "macOS · Windows · Linux" },
      { label: "源码能力", value: "实时预览 · 沉浸 · 源码编辑" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/LoTwT/nicole" }],
    preview: {
      kind: "component",
      component: NicolePreview,
      label: "Nicole 的 Markdown 写作封面示意，非应用截图",
    },
  },
  {
    id: "design-system",
    name: "Ayingott Design System",
    category: "设计系统",
    description: [
      "面向",
      " ",
      "Tailwind CSS v4",
      " ",
      "的",
      "主题包，",
      "统一",
      "设计令牌、",
      "语义变量",
      "与",
      "基础样式。",
    ],
    facts: [
      { label: "包名", value: "@ayingott/theme" },
      { label: "配套", value: "自托管字体 · 可访问性工具" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/LoTwT/design-system" },
    ],
  },
]
