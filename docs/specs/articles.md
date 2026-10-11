# 文章发布

更新日期：2026-10-11。状态：已在 `feat/articles` 分支实现，尚未发布，也还没有真实文章。本地验收见 [文章发布本地验收](../verification/2026-10-10-articles.md)。能力样例在移动端的 Lighthouse 性能分波动较大，此前几轮中位数为 77–78、未达标；2026-10-11 复查中位数为 92，各次在 81–92 之间。是否稳定达标，待真实文章加入后复查。

本文维护文章功能的范围、内容约定、构建行为与验收标准。选型理由与评审修订见 [0004：加入文章发布](../decisions/0004-articles.md)。

## 范围

| 维度     | 要求                                                                     |
| -------- | ------------------------------------------------------------------------ |
| 写作方式 | 可以在任意编辑器中写 Markdown，放入本仓库由 Git 追踪；合入 `main` 即发布 |
| 草稿     | 不设草稿机制；未完成的文章只在本地或分支上预览，不合入 `main`            |
| 内容形式 | 代码块高亮、图片、数学公式、图表、文中嵌入交互组件                       |
| 语言     | 只写中文，不做多语言版本                                                 |
| 组织方式 | 只用标签，不设分类                                                       |
| 订阅     | RSS                                                                      |

不做：草稿、分类、在线编辑器或 CMS、评论、站内搜索、多语言、旧站 `/blog` 地址的恢复或跳转、页内锚点有效性检查。

内容由 [Nuxt Content](https://content.nuxt.com/) 管理，图片由 [nuxt-content-assets](https://nuxt.com/modules/content-assets) 处理。

## 内容模型

```text
content/posts/<slug>/
  index.md
  images/...
```

- 所有文章平铺在 `content/posts/` 下，一篇文章一个目录。目录名即 slug，也是访问地址 `/posts/<slug>`。
- slug 必须匹配 `^[a-z0-9]+(?:-[a-z0-9]+)*$`，不能为 `index`，因为 Content 的路径规则会特殊处理这个名字。
- 文章文件只能是 `<slug>/index.md`。`content/` 下的其他 `.md`、`.yml`、`.yaml`、`.json` 文件都会使构建失败，避免未经校验的文件进入集合。
- `content/posts/` 下不能有隐藏目录（名称以 `.` 开头），因为 Content 会把 `posts/.draft/index.md` 这样的文件当作文章收录。其他位置的隐藏条目（如 `.obsidian/`、`.DS_Store`）不会被发布，校验时忽略。
- `content/` 中不能使用符号链接：nuxt-content-assets 不会复制链接指向的图片，发布后会缺图。
- 正文不使用一级标题。文章页的 `<h1>` 由 frontmatter 的 `title` 提供，正文从二级标题开始。
- 标签不影响目录与 URL，修改标签不会改变文章链接。

frontmatter 采用严格模式，出现未知字段即报错：

| 字段          | 类型                | 说明                                                      |
| ------------- | ------------------- | --------------------------------------------------------- |
| `title`       | string              | 必填                                                      |
| `description` | string              | 必填，用于列表、`<meta name="description">`、分享与 RSS   |
| `date`        | `YYYY-MM-DD` 字符串 | 必填，必须是真实存在的日期；按字符串格式化，不经过 `Date` |
| `updated`     | `YYYY-MM-DD` 字符串 | 可选，必须是真实存在的日期，且不早于 `date`               |
| `tags`        | string[]            | 可选，每项匹配 slug 正则，如 `nuxt`、`css`                |
| `image`       | 相对路径字符串      | 可选，文章目录内的 PNG 或 JPEG，只用于合成分享卡片        |

日期按字符串处理，避免构建环境的时区导致日期偏移；旧博客出现过这个问题（提交 `35d963b`）。

## 集合与构建环境

`content.config.ts` 中的 posts 集合只收录 `{ include: "posts/*/index.md", prefix: "/posts" }`，范围与下文的校验范围一致。nuxt-content-assets 会用 c12 单独加载同一份配置，并把 `@nuxt/content` 替换为 shim，所以 `content.config.ts` 只写声明，不执行校验。

`nuxt.config.ts` 在顶层断言：如果设置了 `NITRO_PRESET`，其值必须为 `static`，否则终止构建。原因是 Content 选择部署预设时优先读取这个变量，值中含 `cloudflare` 会把数据库切换到 D1，与纯静态部署冲突。

## 构建期内容校验

Content 的集合 schema 只用于字段类型与 SQL 生成，不能作为构建校验：缺少必填字段可能写成 `NULL`，单个文件解析失败只会警告并跳过。因此由本地模块 `modules/content-posts.ts` 在异步 `setup` 中独立校验。该模块不依赖 Content 的 hook，因为 Content 命中解析缓存时不会调用 parse。

1. 扫描 `content/` 下的全部条目（包括隐藏条目），拒绝约定以外的内容文件、`content/posts/` 下的隐藏目录与符号链接，检查 slug 正则与 `index` 保留字。
2. 用 `yaml` 包的 `parseDocument` 解析 frontmatter，`document.errors` 非空即报错。
   - Content 底层通过 `remark-mdc` 使用的就是 `yaml` 包。
   - 不使用 `remark-mdc` 的 `parseFrontMatter`：它不检查解析错误，重复的键、未闭合的数组都会被静默接受。
   - `yaml` 作为直接依赖锁定精确版本，升级时核对它与 Content 实际使用的版本是否一致。
3. 用 zod 严格校验上文的字段规则。
4. 用 `mdast-util-from-markdown` 解析正文，检查一级标题、行内图片与引用式图片，跳过代码块。
   - 正文中出现 Markdown 一级标题（`#` 或 Setext 写法）即报错；正文中直接写的 HTML 标签不在检查范围内。
   - 图片地址不能为空；引用式图片必须有对应的定义行，否则 CommonMark 会把它当作普通文本输出。缺少定义的引用从正文文本中识别，只覆盖完整写法 `![说明][标识]` 与折叠写法 `![说明][]`，不覆盖简写 `![说明]`，也不覆盖说明中带有加粗等格式的情况。
   - 相对路径必须指向当前文章目录内已存在的文件，不能用 `..` 越出该目录。
   - MDC 组件属性中的图片不在检查范围内。
5. 汇总全部错误后一次性抛出，使 `dev` 与 `build` 失败。
6. 收集所有文章的标签，把 `/posts`、全部文章页、全部标签页、`/feed.xml`、`/sitemap.xml` 显式加入 `nitro.prerender.routes`。

文章页与标签页查不到数据时抛出 404。如果某篇文章通过校验，正文却被 Content 解析失败后跳过，它的显式路由会预渲染出 404，再由现有的 `prerender.failOnError: true` 使构建失败。`failOnError` 只覆盖实际预渲染到的路由，不检查图片与页内锚点。

## 内容能力

**代码高亮**：使用 Content 内置的 Shiki，配置 `default` 与 `dark` 双主题（`github-light`、`github-dark`）。Content 底层的 MDC 随正文输出的样式已包含 `html.dark` 下读取暗色变量的规则，与现有 color-mode 的 `classSuffix: ""` 一致，无需另写 CSS。

**图片**：正文用相对路径引用同目录图片，如 `![说明](./images/a.png)`。

- 配置 `contentAssets.imageSize: "attrs"`，为 `<img>` 输出 `width` 与 `height`。该项在 3.0.1 中默认关闭。CSS 加上 `max-width: 100%; height: auto`。
- 在 `modules` 中，`nuxt-content-assets` 必须排在 `@nuxt/content` 之前，否则缓存的文档可能保留旧路径或旧尺寸。
- 输出路径为 `/posts/<slug>/images/...`，不带内容哈希。
- 开发时修改图片或改变尺寸后，需要重新保存对应的 Markdown 或重启开发服务。
- Markdown 图片标题（`![替代文本](./images/a.png "图片说明")` 中引号内的文字）显示为图片下方的说明，由 `app/components/content/ProseImg.vue` 渲染。
- 3.0.1 的开发期客户端插件存在打包缺陷，会使开发服务下的页面无法水合，由补丁修复，见 [开发约定](../development.md#环境准备)。
- 退出路径：文章始终是标准 Markdown 加相对路径。如需移除该模块，可用一次性脚本把图片移到 `public/posts/<slug>/` 并改写路径。

**数学公式**：用 `remark-math` 与 `rehype-katex`，通过 `content.build.markdown` 接入，构建时渲染为静态 HTML。KaTeX 样式只在含公式的页面加载：文章页以异步组件引入样式，并在 `build:manifest` 中关闭该组件的预取。

**图表**：写成 ` ```mermaid ` 代码块，GitHub、Obsidian、Typora 都能直接渲染。

- 站点在客户端懒加载 `mermaid`，只有含图表的页面会下载；图表进入视口前 200px 时才开始下载与渲染，避免与首屏资源争抢带宽。
- 切换主题时重新渲染。
- 图表语法有误时，在同一容器中以代码块显示源码，并在浏览器控制台输出错误；构建期不检查图表语法。
- 渲染容器固定高度 20rem，图表在其中按比例缩小并居中，渲染前后不产生布局偏移；较小的图表上下会留白。
- 不在构建时渲染，因为那需要无头浏览器。

**交互组件**：使用 MDC 语法（如 `::demo-name`），组件放在 `app/components/content/`。这种写法在其他编辑器中显示为普通文本。

## 路由与数据获取

| 路由            | 内容                           |
| --------------- | ------------------------------ |
| `/posts`        | 全部文章，按 `date` 倒序       |
| `/posts/<slug>` | 文章页                         |
| `/tags/<tag>`   | 含该标签的文章，按 `date` 倒序 |
| `/feed.xml`     | RSS                            |
| `/sitemap.xml`  | 站点地图                       |

- 所有页面都预渲染，沿用 `nitro.preset: "static"`，路由来源见上文校验的第 6 步。
- `queryCollection` 只在 `useAsyncData` 中调用，key 与路由参数同步：`posts`、`post:<slug>`、`tag:<tag>`。不在 `onMounted`、`watch` 或客户端插件中查询，也不调用 `refresh`。
- 客户端一旦执行查询，Content 会加载 WASM SQLite，见 [静态部署说明](https://content.nuxt.com/docs/deploy/static)。按上面的约束，预渲染页面之间导航应只读取 `_payload.json`，以验收中的网络检查为准。
- SQLite 使用 `content.experimental.sqliteConnector: "native"`，即 Node 自带的 `node:sqlite`。该连接器要求 Node 22.5 及以上，本项目的版本见 [.node-version](../../.node-version)。
- `/posts` 不复用旧站的 `/blog`，旧地址继续返回 404。
- 页面输出为 `posts.html` 这样的文件，Pages 以无尾斜杠的地址提供，带尾斜杠的请求 308 重定向到无斜杠地址。开发服务下 nuxt-content-assets 的图片目录与 `/posts` 同名，直接访问会被重定向到 `/posts/`，不影响构建产物。
- 产物会包含 `/__nuxt_content/posts/sql_dump.txt`，即已发布内容的数据库导出，经过 gzip 与 base64 编码，属于公开数据。

## 标签、RSS 与 sitemap

**标签**：

- 只有一层标签。需要粗粒度划分时，直接用 `tech`、`essay` 这样的标签。
- 标签在各篇文章的 frontmatter 中声明，构建时汇总，不另设定义文件。
- 标签页在 `useAsyncData` 中读取全部文章的 `path`、`title`、`date`、`tags`，筛选出含当前标签的文章；预渲染时只把筛选结果写入页面数据。
- 文章页与列表项都显示标签，链接到对应的标签页。标签页直接展示 slug，不设显示名。
- 标签页是独立的静态页面，不使用 `/posts?tag=` 查询参数。

**RSS**：由 `server/routes/feed.xml.ts` 生成，条目包含标题、摘要、日期与链接，不输出全文，因为组件与图表无法在 RSS 中正确呈现。

**sitemap**：由 `server/routes/sitemap.xml.ts` 生成，包含首页、`/posts`、文章页与标签页，取代手动维护的 `public/sitemap.xml`。

## SEO 与分享

- 文章页设置标题、描述、canonical、Open Graph（`og:type=article`、发布与更新时间）与 Twitter Card。
- 每篇文章在构建时生成一张 1200 × 630 的分享卡片 `/og/posts/<slug>.png`，作为 `og:image`、`twitter:image` 与 JSON-LD 的 `image`，`og:image:alt` 为“文章标题 · Lo”。卡片包含署名、标题与发布日期；填写 `image` 时，图片合成在卡片右侧。版式见 [设计方向](design.md#文章分享卡片)。
- 卡片由 `modules/content-posts.ts` 调用 [渲染模块](../../modules/post-share-cards/render-post-share-card.ts) 生成：用 `satori` 排版、`@resvg/resvg-js` 转为 PNG。satori 不支持 WOFF2 与可变字体，因此按每张卡片用到的字，从主题字体中子集化出 TrueType，并固定 Bricolage Grotesque 的可变轴。
- 卡片只在生产构建中生成，开发服务下 `og:image` 指向的文件不存在。卡片放在 `/og/` 下，不与文章目录中的图片重名。
- `image` 的校验与正文图片相同，另外要求扩展名为 `.png`、`.jpg` 或 `.jpeg`，并按文件内容确认是 PNG 或 JPEG。
- 首页与列表页继续使用站点的 `og-image.png`。
- 文章页输出 schema.org `BlogPosting` JSON-LD，作者信息取自 [profile.ts](../../app/utils/profile.ts)。

## 导航与页面视觉

- 文章入口放在全站 Header 的导航中（“首页”“文章”），首页的图标入口保持不变，只承载个人信息。
- 列表页、文章页与标签页沿用 `SiteFrame` 与内容栏，不使用 `brutal` 风格的粗边框与硬阴影。
- RSS 的可见入口放在文章列表页的标题行；全站 `<head>` 另外声明 `<link rel="alternate" type="application/rss+xml">`，供阅读器自动发现。
- 文章页提供“回到顶部”按钮，并在文章末尾提供“全部文章”入口；顶部不设返回文章列表的链接。
- 正文排版使用 `@ayingott/theme` 的 `--reading-*` 语义变量，不引入 `@tailwindcss/typography`。
- 具体视觉见 [设计方向](design.md) 中的站点导航、文章列表与标签页、文章页三节。

## 字体

文章正文的中文使用 LXGW WenKai：主题的 `--font-reading` 为 Literata 加 LXGW WenKai。

完整字库的 400、500 字重各是一个 7.6–8.5MB 的单文件，子集中没有收录的字会触发完整字库下载。600、700 字重也会匹配到 500 字重的文件。

[字体子集模块](../../modules/theme-font-subsets.ts) 生成两组 `unicode-range` 互不重叠的子集：

| 子集     | 收录字符                                                    | 加载页面               |
| -------- | ----------------------------------------------------------- | ---------------------- |
| 站点子集 | `app/` 源码中的中文字符与中文标点                           | 所有页面               |
| 内容子集 | `content/posts/` 全部文章中的中文字符，减去站点子集已有的字 | 文章页、列表页、标签页 |

400、500 两个字重都收录全部内容字符，不按字重细分。正文加粗、表头、交互组件都可能用到 500 字重，漏收一个字就会下载完整字库。

内容子集必须在主题完整字库之后声明，`unicode-range` 重叠时后声明的字体优先。Nuxt 默认内联的组件样式排在 `entry.css` 之前，因此这三类页面的样式改为 `<link>` 引入，配置见 [架构说明](../architecture.md#文章内容管线)。

文章页在预渲染的 HTML 中预加载 Space Mono 400。行内代码从回退字体换成 Space Mono 时宽度略有变化，可能使段落重新换行；能力样例在移动端因此产生 0.2173 的 CLS，预加载后降到 0.0004。

2026-10-10 用仓库中的中文文档模拟文章，实测结果如下（LXGW WenKai 400）：

| 文本            | 中文字符数 | 按内容生成子集 | 通用分片（`@chinese-fonts/lxgwwenkai` 3.0.0） |
| --------------- | ---------- | -------------- | --------------------------------------------- |
| design.md       | 494        | 108KB          | 886KB，命中 23 片                             |
| architecture.md | 433        | 94KB           | 833KB，命中 22 片                             |
| 全部 docs 合计  | 760        | 166KB          | 1007KB，命中 25 片                            |

实现前站点子集约 16KB；实现后为 86 字、约 19KB，新增的字都来自页面文案。按 GB2312 一级字估算，1500 字约 354KB，3755 字约 838KB。

**预算**：

- 统计口径：冷缓存下，单个页面实际下载的全部 LXGW 文件，包括各字重的站点子集与内容子集。
- 任何页面都不得请求完整字库。
- 首页只下载站点子集。站点子集会随 `app/` 中的文案增长，需记录实际体积，并与 16KB 的基线对比。
- 内容子集的任一字重超过 400KB 时，改为按页面生成子集；列表页与标签页也按页面生成。
- 单篇文章本身就超出预算时，文章内容区域停用 LXGW：`--reading-font-body`、`--reading-font-heading`、`--reading-font-mono` 都改为不含 LXGW 的字体栈，内容子集只收录仍以文楷显示的文本。

## 验收标准

**静态检查**：`pnpm check`、`pnpm build` 通过。

**校验失败用例**：以下每种情况都应使构建失败，并给出可读的错误信息。

- frontmatter：
  - 缺少 `title`；
  - 重复的 `title`；
  - 未闭合的 `tags: [nuxt`；
  - 不存在的日期，如 `2026-02-30`；
  - `updated` 早于 `date`；
  - 非法的 tag；
  - 未知字段。
- 目录与文件：
  - 非法的 slug；
  - 名为 `index` 的 slug；
  - `content/posts/` 下的隐藏目录；
  - 符号链接；
  - 约定以外的内容文件。
- 正文：一级标题。
- 图片：
  - 引用不存在的图片；
  - 用 `..` 越出文章目录的引用；
  - 空的图片地址；
  - 没有定义行的引用式图片。
- 分享卡片图片（`image`）：不存在、越出文章目录、空字符串、非字符串、绝对地址、PNG 与 JPEG 以外的格式、扩展名与文件内容不符。
- 构建环境：设置 `NITRO_PRESET=cloudflare_pages`。

**能力样例**：本地临时加入一篇覆盖全部内容能力的文章，验收后删除，不提交。检查内容：

- 代码高亮在浅色、深色、跟随系统三种偏好下都正确。
- KaTeX 正确渲染为静态 HTML。
- Mermaid 正常渲染，切换主题后重新渲染。
- MDC 组件出现在预渲染 HTML 中，并且可以交互。
- KaTeX 样式与 `mermaid` 只在含对应内容的页面加载。
- 标签页只列出含该标签的文章，各处标签链接正确。

**导航与请求**：

- 直接打开文章页与标签页均正常。
- 客户端导航覆盖：首页→列表→文章、文章→文章、标签→标签、浏览器前进与后退。
- 全程网络请求中不出现 `/__nuxt_content/**` 下的任何请求，也不出现 SQLite WASM。
- Header 导航在首页、列表页、文章页、标签页标记正确的当前栏目，错误页没有当前栏目。
- 回到顶部按钮在标题滚出视口后出现、回到顶部附近隐藏；点击后回到顶部，焦点落在正文；启用“减少动态效果”时直接跳转。

**字体**：按上文的预算口径统计每类页面，所有页面都没有完整字库请求。

**XML**：`/feed.xml` 与 `/sitemap.xml` 内容正确。

**分享卡片**：有图与无图、短标题与超长标题（中文与英文）、横图与竖图的卡片版式正确，超长标题以省略号截断；每篇文章的 `og:image`、`twitter:image` 与 JSON-LD 的 `image` 指向对应卡片。

**图片**：

- 输出带 `width` 与 `height`，路径格式符合上文。
- 替换同名图片、改变尺寸、删除图片后，分别重新构建，结果都正确。
- 删除仍被引用的图片后，校验应失败。

**Lighthouse**：

- 固定 Lighthouse 与 Chrome 版本，冷缓存，移动与桌面两种预设，每个对象各跑三次取中位数。
- 样例文章在本地产物上检查；真实文章在正式的本地产物或生产环境上检查。
- 标准：性能 ≥ 90；无障碍、最佳实践、SEO 均为 100；CLS 原始值 ≤ 0.01。
- Cloudflare 预览部署默认带 `X-Robots-Tag: noindex`，其 SEO 结果不计入标准，只记录该响应头。

**部署**：

- Cloudflare 构建命令不变。
- 构建日志中不出现 D1 切换警告。
- 预览部署通过后再合入 `main`，实际结果记入 [验收记录](../index.md#验收记录)。
