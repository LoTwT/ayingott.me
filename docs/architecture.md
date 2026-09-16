# 全局架构

当前应用的全局结构、模块职责和共享约束记录在这里。产品范围见 [重建要求](specs/requirements.md)，页面布局见 [设计方向](specs/design.md)，选择原因见 [项目重建决策](decisions/0001-project-foundation.md)。

## 技术栈

| 用途           | 选择                                          |
| -------------- | --------------------------------------------- |
| 应用           | Nuxt 4、Vue 3、TypeScript                     |
| 样式           | Tailwind CSS 4，通过 `@tailwindcss/vite` 接入 |
| 主题与字体     | npm 正式发布的 `@ayingott/theme`              |
| 明暗主题       | `@nuxtjs/color-mode`                          |
| 图标           | Lucide，通过 `@lucide/vue` 按需引入           |
| 检查与格式     | Oxlint、Oxfmt、vue-tsc                        |
| 运行时与包管理 | Node 24 LTS、pnpm                             |
| 构建与托管     | SSG、Cloudflare Pages、Wrangler               |

精确依赖以 [package.json](../package.json) 和 [pnpm-lock.yaml](../pnpm-lock.yaml) 为准，运行时版本见 [.node-version](../.node-version)。环境准备与升级检查见 [开发约定](development.md)。

## 渲染与部署边界

`pnpm build` 与 `pnpm generate` 都执行静态生成。[nuxt.config.ts](../nuxt.config.ts) 显式使用 Nitro 的 `static` 预设，使本地与 Cloudflare Git 构建都输出到 `.output/public`，避免托管环境自动选择其他输出目录。配置中的 `ssr: true` 用于生成 HTML，不代表部署请求时运行的 Nuxt 服务端。

Cloudflare 的构建配置与发布步骤见 [发布说明](release.md)。

## 组件与文件职责

根组件与页面负责组合内容，公共框架和主题偏好各自独立。

| 文件                                                           | 职责                                             |
| -------------------------------------------------------------- | ------------------------------------------------ |
| [app/app.vue](../app/app.vue)                                  | 组合站点框架与当前路由页面                       |
| [SiteFrame.vue](../app/components/site/SiteFrame.vue)          | Header、跳到正文入口与页面留白；默认插槽承载页面 |
| [ThemeSwitcher.vue](../app/components/theme/ThemeSwitcher.vue) | 主题偏好选择与持久化                             |
| [pages/index.vue](../app/pages/index.vue)                      | 工程验证用的临时介绍页                           |
| [error.vue](../app/error.vue)                                  | 404 与其他错误的展示、返回首页入口               |
| [assets/main.css](../app/assets/main.css)                      | Tailwind、主题字体、主题样式和全局基础规则       |

页面提供 `<main id="main-content">`，对应公共框架的“跳到正文”链接。当前页面和组件范围以 [产品要求](specs/requirements.md) 为准。

## 样式与主题

[CSS 入口](../app/assets/main.css) 按以下顺序导入：

```css
@import "tailwindcss";
@import "@ayingott/theme/fonts.css";
@import "@ayingott/theme";
@import "@ayingott/theme/brutal.css";
```

颜色直接使用主题语义变量，如 `--surface-canvas`、`--text-primary`、`--text-secondary`、`--text-muted` 和 `--focus-ring-color`。字体使用 `font-display`、`font-sans`、`font-mono` 等角色，字体文件交给 Vite 构建输出。不复制主题或字体文件，不引入 `--ayingott-*` 兼容变量。

视觉风格默认使用 `brutal`，由 [nuxt.config.ts](../nuxt.config.ts) 在 `<html>` 上设置 `brutal` 类。明暗模式默认跟随系统，系统偏好变化时同步更新；用户手动选择浅色或深色后保存偏好，重新选择“跟随系统”即可恢复自动切换。

主题模块通过 `useColorMode()` 管理跟随系统、浅色和深色偏好；依赖浏览器偏好的界面使用 `ColorScheme` 包裹，处理预渲染与客户端状态的差异。保持 `classSuffix: ""`，使深色模式在同一 `<html>` 上同时保留 `brutal` 和 `dark` 类，与主题包和 Tailwind 的 dark variant 一致。

图标使用 Lucide 的官方 Vue 包 `@lucide/vue`，在使用处具名导入所需图标组件，随应用构建输出 SVG。图标颜色继承主题语义颜色；图标按钮提供可访问名称，装饰性 SVG 使用 `aria-hidden="true"`。主题按钮的行为约定见 [设计方向](specs/design.md)。

## 公开资源

静态资源由 `public/` 输出到生成目录。简历文件的保留要求见 [重建要求](specs/requirements.md)，资源一致性校验见 [开发约定](development.md#检查)。
