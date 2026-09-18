# 开发约定

本文维护环境准备、编码约定和日常验证方法。全局结构与共享约束见 [架构说明](architecture.md)，功能范围见 [重建要求](specs/requirements.md)。

## 环境准备

精确依赖、pnpm 版本和命令以 [package.json](../package.json) 为准；Node 版本由 [.node-version](../.node-version) 固定。直接依赖使用精确版本，保留 [pnpm-lock.yaml](../pnpm-lock.yaml)，通过 `pnpm install --frozen-lockfile` 安装。

升级 TypeScript 或 Nuxt 时需验证 vue-tsc 类型检查和静态构建。同步 Cloudflare 构建环境的方法见 [部署说明](release.md)。

安装完成后运行 `pnpm dev` 启动开发服务，快速开始入口见 [README](../README.md)。

## 编码约定

Vue 组件使用 Composition API 和 `<script setup lang="ts">`。组件职责、主题样式和公共资源边界遵循 [架构说明](architecture.md)。

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

预览读取 `.output/public`，修改源码后需要重新构建。发布时对实际部署地址执行同样的浏览器检查，并完成 [发布验收](release.md#发布验收)。

## 协作约定

通用规则由 [AGENTS.md](../AGENTS.md) 维护。Git 操作继续遵循个人环境中 `~/.agents/AGENTS.md` 的全局约定，账号与提交身份不在项目文档中重复定义。

改变日常开发与验证方法时更新本文；全局结构、产品范围和决策历史分别更新对应文档。部署配置与实际验收分别记录在 [部署说明](release.md) 和 [验收记录](index.md#验收记录)。
