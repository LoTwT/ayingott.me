# 2026-09-14：首轮工程验收

这是该次验收的历史记录，不代表后续修改已经通过相同检查。操作步骤见 [部署说明](../release.md)。

对象为 `codex/nuxt-foundation` 分支的未提交工作区。环境为 Node 24.19.0、pnpm 10.33.0，接入 `@ayingott/theme@0.3.0`；TypeScript 6.0.3 已通过 Nuxt/vue-tsc 验证。

## 工程与本地运行

- `pnpm install --frozen-lockfile`、`pnpm check`、`pnpm build`、`pnpm verify:static` 通过。
- Nuxt 开发服务启动成功，HTTP 请求返回 200 和已渲染的首页 HTML。
- 静态产物包含霞鹜文楷 400/500 字重，字体由 Vite 输出为带 hash 的资源。
- Wrangler 本地 HTTP 验证通过：首页 200、未知嵌套路由 404、简历 PDF 和 11 个脚本、样式、字体资源。

## Cloudflare 预览与浏览器

[本次预览](https://ee551145.ayingott-me.pages.dev) 部署成功；分支别名为 [codex-nuxt-foundation.ayingott-me.pages.dev](https://codex-nuxt-foundation.ayingott-me.pages.dev)。本次环境为 `preview`，使用已验证的本地产物直接上传。

- 同一 HTTP 验证脚本在线上预览通过：首页和未知路由状态正确，PDF、CSS、JS、字体文件与本地产物的 SHA-256 一致。
- 浏览器验证通过：390px 移动端无横向溢出、跟随系统与明暗切换、刷新保留偏好、404 页面与返回首页。首页无控制台警告或错误。
- 原简历 PDF 的源码、生成文件和线上响应字节一致，SHA-256 为 `e77a78a03624a402812a71c53c2efd4a43e9fc3c8d54b58d728dd6dd641bdbb6`。
- 域名绑定与现有生产部署 `d43f84ff-cc67-4f2f-8fec-9950337c75cf` 未改变。

## 构建配置迁移

通过 Cloudflare API 核对，旧设置为 `npm run build`、输出目录 `dist`、v2 构建环境；生产环境设置 `NODE_VERSION=22.14.0`，预览环境未固定 Node/pnpm。

Production 与 Preview 已同时改为 v3 构建环境，设置固定的 Node、pnpm 和安装变量；构建命令与输出目录已更新。目标配置见 [部署说明](../release.md)，上述变更均通过 API 回读核对。

## 已知警告

构建存在一条 Nuxt/Nitro 依赖内部的 H3 未使用导入警告；开发服务有 Nuxt DevTools 的 `configResolved` 钩子被 Vite 忽略的警告。开发服务、构建、类型检查和运行验证均通过，未修改依赖或屏蔽警告。

## 待验证事项

本次验收时工程代码尚未提交或推送，Cloudflare 从 Git 拉取源码后的自动构建尚未验证。发布分支后需另行检查构建日志和该次预览；直接上传成功只验证真实托管行为。控制台配置已面向新工程，后续 Git 构建需使用新工程代码。
