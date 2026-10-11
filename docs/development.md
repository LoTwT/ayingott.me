# 开发约定

本文维护环境准备、编码约定和日常验证方法。全局结构与共享约束见 [架构说明](architecture.md)，功能范围见 [重建要求](specs/requirements.md)。

## 环境准备

精确依赖、pnpm 版本和命令以 [package.json](../package.json) 为准；Node 版本由 [.node-version](../.node-version) 固定。直接依赖使用精确版本，保留 [pnpm-lock.yaml](../pnpm-lock.yaml)，通过 `pnpm install --frozen-lockfile` 安装。

升级 TypeScript 或 Nuxt 时需验证 vue-tsc 类型检查和静态构建。

[patches/](../patches/) 中的补丁由 `pnpm-workspace.yaml` 的 `patchedDependencies` 声明，安装时自动应用。当前只有 `nuxt-content-assets@3.0.1` 一个：该版本仅在开发模式下注册的客户端插件，从发布包中只有类型声明的 `../types` 导入常量，浏览器加载失败，导致整个页面无法水合；补丁把这个常量直接写入插件。升级该模块时先检查新版本是否已修复，修复后删除补丁与对应声明。开发服务的检查要在浏览器中确认页面可以交互，不能只看服务端返回的 HTML。同步 Cloudflare 构建环境的方法见 [部署说明](release.md)。

安装完成后运行 `pnpm dev` 启动开发服务，快速开始入口见 [README](../README.md)。

## 编码约定

Vue 组件使用 Composition API 和 `<script setup lang="ts">`。`app/` 中的源码（包括注释）会被收入每个页面都要下载的站点字体子集，新增注释不要引入页面文案以外的汉字，需要说明时可用英文。组件职责、主题样式和公共资源边界遵循 [架构说明](architecture.md)。

## 写作与发布

文章的完整约定见 [文章发布](specs/articles.md)，日常步骤如下：

1. 新建 `content/posts/<slug>/index.md`，目录名即访问地址 `/posts/<slug>`。frontmatter 写 `title`、`description`、`date`，可选 `updated`、`tags`，日期格式为 `YYYY-MM-DD`：

   ```markdown
   ---
   title: 文章标题
   description: 一句话摘要，用于列表、分享与 RSS
   date: 2026-10-10
   tags: [nuxt, css]
   ---
   ```

   正文从二级标题开始，不写一级标题。不要用名称以 `.` 开头的目录存放草稿，也不要使用符号链接，两者都会使构建失败。

2. 图片放在同一目录，正文用相对路径引用，如 `![替代文本](./images/a.png "图片说明")`；引号中的标题显示为图片下方的说明，可省略。
3. 运行 `pnpm dev` 预览。内容校验在开发服务启动时执行，修改 frontmatter 或图片引用后需重启开发服务才会重新校验；修改图片或其尺寸后，重新保存对应的 Markdown 或重启开发服务。开发时使用完整字库，字体子集只能在构建产物中检查。开发服务下直接访问 `/posts` 或文章页会被重定向到带尾斜杠的地址，原因见 [文章发布](specs/articles.md#路由与数据获取)，构建产物不受影响。
4. 在分支上完成下文的检查与预览，合入 `main` 即发布。未完成的文章不要合入 `main`。

正文中的交互组件放在 `app/components/content/`，以 MDC 语法引用，如 `::demo-name`。该目录中的 `ProsePre.vue`、`ProseImg.vue` 覆盖 Content 的默认渲染，分别负责 Mermaid 图表与图片说明。

## 检查

修改代码后运行：

```bash
pnpm check
pnpm build
```

`pnpm check` 包含 lint、格式检查和类型检查。Oxlint 主要检查 Vue 的 `<script>` 部分，不能替代 `pnpm typecheck` 与实际构建对模板的检查。需要统一格式时使用 `pnpm format`。

当前阶段通过基础检查、实际预览和发布验收确认质量。资源加载与 PDF 保留要求在发布时检查，具体步骤见 [发布验收](release.md#发布验收)。

`.output`、`node_modules` 等生成内容不提交到 Git。

## 本地预览

完成上面的检查与静态构建后，启动 Wrangler：

```bash
pnpm preview
```

打开终端显示的地址，检查首页内容、样式与字体加载、跟随系统、浅色/深色切换及刷新后的偏好保留、键盘操作、移动端宽度和未知页面返回首页。

涉及文章时，另外检查：

- `/posts`、文章页与标签页的内容和排版，Header 导航标记正确的当前栏目。
- 新文章中的代码高亮、公式、图表与组件在浅色、深色主题下都正常显示。
- 在开发者工具中禁用缓存，确认文章页没有请求 `lxgw-wenkai-*-normal` 完整字库；构建日志中内容子集的体积在预算内。
- 客户端导航时网络请求中没有 `/__nuxt_content/` 与 SQLite WASM。
- `/feed.xml` 与 `/sitemap.xml` 包含新文章。

预览读取 `.output/public`，修改源码后需要重新构建。发布时对实际部署地址执行同样的浏览器检查，并完成 [发布验收](release.md#发布验收)。

## 协作约定

通用规则由 [AGENTS.md](../AGENTS.md) 维护。Git 操作继续遵循个人环境中 `~/.agents/AGENTS.md` 的全局约定，账号与提交身份不在项目文档中重复定义。

改变日常开发与验证方法时更新本文；全局结构、产品范围和决策历史分别更新对应文档。部署配置与实际验收分别记录在 [部署说明](release.md) 和 [验收记录](index.md#验收记录)。
