# 文章发布

本文维护文章功能的范围、内容约定与构建行为。页面视觉见 [设计方向](design.md)。

## 范围与选型

- 在任意编辑器中写 Markdown，放入本仓库，合入 `main` 即发布。不设草稿，未完成的文章不合入 `main`。
- 支持代码高亮、图片、数学公式、Mermaid 图表与文中交互组件；只写中文；只用标签，不设分类；提供 RSS。
- 不做：分类、在线编辑器或 CMS、评论、站内搜索、多语言、旧站 `/blog` 地址的恢复或跳转、页内锚点有效性检查。
- 内容由 [Nuxt Content](https://content.nuxt.com/) 管理：它与站点同为 Nuxt，自带集合查询、Shiki 高亮与 MDC 组件语法；自建 Markdown 编译需要自己实现列表、标签与 RSS 索引，VitePress、Astro 等独立引擎无法复用站点框架与字体管线。
- 图片由 [nuxt-content-assets](https://nuxt.com/modules/content-assets) 处理：文章目录整体搬入即可使用，相对路径在其他编辑器中照常预览，构建时补全图片尺寸。代价是它依赖 Content 的内部机制，升级 Content 时可能要等它适配。需要移除时，用一次性脚本把图片移到 `public/posts/<slug>/` 并改写路径即可。

## 内容模型

```text
content/posts/<slug>/
  index.md
  images/...
```

- 一篇文章一个目录，目录名即 slug，也是访问地址 `/posts/<slug>`。slug 匹配 `^[a-z0-9]+(?:-[a-z0-9]+)*$`，不能为 `index`（Content 的路径规则会特殊处理这个名字）。
- 文章文件只能是 `<slug>/index.md`，`content/` 下的其他 `.md`、`.yml`、`.yaml`、`.json` 文件会使构建失败。
- `content/posts/` 下不能有隐藏目录，因为 Content 会把 `posts/.draft/index.md` 当作文章收录；其他位置的隐藏条目（如 `.obsidian/`、`.DS_Store`）被忽略。
- `content/` 中不能使用符号链接，nuxt-content-assets 不会复制链接指向的图片。
- 正文从二级标题开始，文章页的 `<h1>` 由 `title` 提供。
- 标签不影响目录与 URL。

frontmatter 采用严格模式，出现未知字段即报错：

| 字段          | 类型                | 说明                                                    |
| ------------- | ------------------- | ------------------------------------------------------- |
| `title`       | string              | 必填                                                    |
| `description` | string              | 必填，用于列表、`<meta name="description">`、分享与 RSS |
| `date`        | `YYYY-MM-DD` 字符串 | 必填，必须是真实存在的日期                              |
| `updated`     | `YYYY-MM-DD` 字符串 | 可选，不早于 `date`                                     |
| `tags`        | string[]            | 可选，每项匹配 slug 正则，如 `nuxt`、`css`              |
| `image`       | 相对路径字符串      | 可选，文章目录内的 PNG 或 JPEG，只用于合成分享卡片      |

日期始终按字符串处理，不经过 `Date`，避免构建环境的时区导致日期偏移。

## 构建期校验

Content 的集合 schema 不能当作校验：缺少必填字段可能写成 `NULL`，单个文件解析失败只会警告并跳过。因此由 [modules/content-posts.ts](../../modules/content-posts.ts) 在构建开始时独立校验，不依赖 Content 的 hook（命中解析缓存时 Content 不会调用 parse）：

1. 扫描 `content/` 下的全部条目，检查上文的目录与文件规则。
2. 用 `yaml` 的 `parseDocument` 解析 frontmatter 并检查解析错误，再用 zod 严格校验字段。不用 `remark-mdc` 的 `parseFrontMatter`，它会静默接受重复的键与未闭合的数组。`yaml` 作为直接依赖锁定版本，升级时与 Content 实际使用的版本保持一致。
3. 用 `mdast-util-from-markdown` 解析正文，检查 Markdown 一级标题与图片：图片地址不能为空，相对路径必须指向文章目录内已存在的文件；引用式图片必须有定义行（只识别 `![说明][标识]` 与 `![说明][]` 两种写法）。代码块、正文中的 HTML 与 MDC 组件属性不在检查范围内。
4. `image` 字段按同样的规则检查，并按文件内容确认是 PNG 或 JPEG。
5. 汇总全部错误后一次性报出，使 `dev` 与 `build` 失败。
6. 把 `/posts`、全部文章页、全部标签页、`/feed.xml`、`/sitemap.xml` 显式加入预渲染。XML 路由不会被爬虫发现；文章与标签路由显式列出后，若某篇文章被 Content 解析失败跳过，该路由会渲染 404，由 `prerender.failOnError` 使构建失败。

`content.config.ts` 只收录 `posts/*/index.md`，与校验范围一致。nuxt-content-assets 会把 `@nuxt/content` 替换为 shim 后单独加载这份配置，因此其中只写声明。

`nuxt.config.ts` 要求 `NITRO_PRESET` 未设置或为 `static`：Content 遇到含 `cloudflare` 的值会切换到 D1，与纯静态部署冲突。

## 内容能力

**代码高亮**：Content 内置的 Shiki，`github-light` 与 `github-dark` 双主题。Content 随正文输出的样式已包含 `html.dark` 下的暗色规则。

**图片**：

- `contentAssets.imageSize: "attrs"` 为 `<img>` 输出宽高（该模块默认关闭）。`nuxt-content-assets` 必须排在 `@nuxt/content` 之前，否则缓存的文档可能保留旧路径或旧尺寸。
- 输出路径为 `/posts/<slug>/images/...`，不带内容哈希。开发时修改图片后，需要重新保存对应的 Markdown 或重启开发服务。
- Markdown 图片标题（`![替代文本](./images/a.png "图片说明")` 引号中的文字）显示为图片说明。

**数学公式**：`remark-math` 与 `rehype-katex`，构建时渲染为静态 HTML。KaTeX 样式只在含公式的文章页加载：以异步组件引入，并在 `build:manifest` 中关闭该组件及其样式文件的预取。

**图表**：写成 ` ```mermaid ` 代码块，在客户端渲染（构建时渲染需要无头浏览器）。

- `mermaid` 只在图表进入视口前 200px 时下载，切换主题后重新渲染。
- 渲染容器固定高 20rem，图表按比例缩放，避免布局偏移；语法有误时以代码块显示源码。

**交互组件**：MDC 语法（如 `::demo-name`），组件放在 `app/components/content/`。

## 路由与数据获取

| 路由            | 内容                            |
| --------------- | ------------------------------- |
| `/posts`        | 全部文章，按 `date` 倒序        |
| `/posts/<slug>` | 文章页                          |
| `/tags/<tag>`   | 含该标签的文章，按 `date` 倒序  |
| `/feed.xml`     | RSS，只含标题、摘要、日期与链接 |
| `/sitemap.xml`  | 首页、`/posts`、文章页与标签页  |

- 所有页面都预渲染。`queryCollection` 只在 `useAsyncData` 中调用，key 为 `posts`、`post:<slug>`、`tag:<tag>`，不在客户端额外查询；这样页面间导航只读取 `_payload.json`，不会加载 Content 的 WASM SQLite。
- 构建用 Node 自带的 `node:sqlite`（`content.experimental.sqliteConnector: "native"`）。
- 页面输出为 `posts.html` 这样的文件，Pages 以无尾斜杠的地址提供，带尾斜杠的请求 308 重定向。
- 产物包含 `/__nuxt_content/posts/sql_dump.txt`，即已发布内容的数据库导出，属于公开数据。
- 标签只有一层，在各篇文章的 frontmatter 中声明，不设显示名；标签页是独立的静态页面，只为已有标签生成。RSS 不输出全文，因为组件与图表无法在阅读器中呈现。

## SEO 与分享

- 文章页设置标题、描述、canonical、Open Graph（`og:type=article`、发布与更新时间）、Twitter Card 与 schema.org `BlogPosting`。
- 每篇文章在构建时生成 1200 × 630 的分享卡片 `/og/posts/<slug>.png`，作为 `og:image`、`twitter:image` 与 JSON-LD 的 `image`。卡片包含署名、标题与发布日期，填写 `image` 时图片合成在右侧，版式见 [设计方向](design.md#文章分享卡片)。列表页与标签页不设分享图。
- 卡片由 [渲染模块](../../modules/post-share-cards/render-post-share-card.ts) 用 `satori` 排版、`@resvg/resvg-js` 转为 PNG。satori 不支持 WOFF2 与可变字体，因此按每张卡片用到的字从主题字体子集化出 TrueType，并固定 Bricolage Grotesque 的可变轴。卡片只在生产构建中生成。

## 字体

正文中文使用 LXGW WenKai。完整字库的每个字重都是 7.6–8.5MB 的单文件，子集未收录的字会触发完整字库下载。[字体子集模块](../../modules/theme-font-subsets.ts) 按内容生成两组 `unicode-range` 互不重叠的子集，下载量约为通用分片方案的五分之一到八分之一：

| 子集     | 收录字符                                   | 加载页面               |
| -------- | ------------------------------------------ | ---------------------- |
| 站点子集 | `app/` 源码中的中文字符与中文标点          | 所有页面               |
| 内容子集 | 全部文章中的中文字符，减去站点子集已有的字 | 文章页、列表页、标签页 |

- 400、500 字重都收录全部字符，不按字重细分，以免漏字。
- 内容子集必须在主题完整字库之后声明，因此这三类页面的样式以 `<link>` 引入而不内联，见 [架构说明](../architecture.md#文章内容管线)。
- 文章页预加载 Space Mono 400，避免行内代码换用该字体后段落重新换行造成布局偏移。
- 任何页面都不应请求完整字库。内容子集任一字重超过 400KB 时，构建会警告，届时改为按页面生成子集；单篇文章本身就超出时，文章正文停用 LXGW。
