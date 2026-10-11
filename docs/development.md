# 开发约定

全局结构见 [架构说明](architecture.md)，功能范围见 [产品要求](specs/requirements.md)。

## 环境准备

精确依赖、pnpm 版本和命令以 [package.json](../package.json) 为准，Node 版本由 [.node-version](../.node-version) 固定。直接依赖使用精确版本，通过 `pnpm install --frozen-lockfile` 安装，然后运行 `pnpm dev` 启动开发服务。

[patches/](../patches/) 中的补丁由 `pnpm-workspace.yaml` 的 `patchedDependencies` 声明，安装时自动应用。当前只有 `nuxt-content-assets@3.0.1` 一个：该版本的开发期客户端插件从只有类型声明的 `../types` 导入常量，会使开发服务下的页面无法水合。升级该模块后，如果新版本已修复，删除补丁与对应声明。

## 编码约定

- Vue 组件使用 Composition API 和 `<script setup lang="ts">`，组件职责与样式边界遵循 [架构说明](architecture.md)。
- `app/` 中的源码（包括注释）会被收入每个页面都要下载的站点字体子集，新增注释不要引入页面文案以外的汉字，需要说明时用英文。

## 写文章

文章的完整约定见 [文章发布](specs/articles.md)。

1. 新建 `content/posts/<slug>/index.md`，目录名即访问地址 `/posts/<slug>`：

   ```markdown
   ---
   title: 文章标题
   description: 一句话摘要，用于列表、分享与 RSS
   date: 2026-10-10
   tags: [nuxt, css] # 可选
   image: ./images/cover.png # 可选，合成到分享卡片右侧
   ---
   ```

   正文从二级标题开始。不要用名称以 `.` 开头的目录存放草稿，也不要使用符号链接，两者都会使构建失败。

2. 图片放在同一目录，正文用相对路径引用，如 `![替代文本](./images/a.png "图片说明")`，引号中的文字显示为图片说明。正文中的交互组件放在 `app/components/content/`，以 MDC 语法引用，如 `::demo-name`。
3. 运行 `pnpm dev` 预览。内容校验只在开发服务启动时执行，修改 frontmatter 或图片引用后需重启。开发服务使用完整字库、不生成分享卡片，直接访问 `/posts` 会被重定向到 `/posts/`，这些都不影响构建产物。
4. 合入 `main` 即发布。未完成的文章不要合入 `main`。

## 检查

```bash
pnpm check   # lint、格式与类型检查
pnpm build   # 静态生成，同时执行文章校验
pnpm preview # 用 Wrangler 预览 .output/public
```

需要统一格式时运行 `pnpm format`。预览读取构建产物，修改源码后需要重新构建；字体子集与分享卡片只能在构建产物中检查，卡片位于 `.output/public/og/posts/`。

改动页面后，在浏览器中打开预览看一遍：浅色、深色与跟随系统，手机宽度，以及涉及的页面能正常交互。

通用规则见 [AGENTS.md](../AGENTS.md)；Git 操作遵循个人环境中 `~/.agents/AGENTS.md` 的约定。
