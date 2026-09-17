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

| 文件                                                                | 职责                                                     |
| ------------------------------------------------------------------- | -------------------------------------------------------- |
| [app/app.vue](../app/app.vue)                                       | 组合站点框架与当前路由页面                               |
| [SiteFrame.vue](../app/components/site/SiteFrame.vue)               | Header、跳到正文入口、内容栏与页脚组合；默认插槽承载页面 |
| [SiteFooter.vue](../app/components/site/SiteFooter.vue)             | 页脚文案与呈现                                           |
| [ThemeSwitcher.vue](../app/components/theme/ThemeSwitcher.vue)      | 主题偏好选择与持久化                                     |
| [pages/index.vue](../app/pages/index.vue)                           | 组合首页内容，提供正文焦点入口                           |
| [HomeIntroduction.vue](../app/components/home/HomeIntroduction.vue) | 组合首屏介绍与图标入口，维护视口高度布局                 |
| [HomeLinks.vue](../app/components/home/HomeLinks.vue)               | GitHub、邮箱与简历图标入口及交互                         |
| [error.vue](../app/error.vue)                                       | 404 与其他错误的展示、返回首页入口                       |
| [assets/main.css](../app/assets/main.css)                           | Tailwind、主题字体、主题样式和全局基础规则               |

页面提供 `<main id="main-content">`，对应公共框架的“跳到正文”链接。`SiteFrame` 的 Header 使用页面全宽，默认插槽由独立的居中内容栏承载，页脚在同一内容栏中接在页面之后；具体宽度和留白见 [设计方向](specs/design.md)。当前页面和组件范围以 [产品要求](specs/requirements.md) 为准。

首页介绍组件维护首屏的最小视口高度，为 Header 和 Footer 预留空间，联系方式与简历入口由介绍组件组合。页脚使用文档流布局，短页面由公共框架推至视口底部；内容超出视口时使用文档原生滚动。布局与滚动约定见 [设计方向](specs/design.md)。

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

主题模块通过 `useColorMode()` 管理跟随系统、浅色和深色偏好。主题按钮的三个图标均预渲染到 HTML，由 `<html>` 上的 `data-theme-preference` 选择显示。配置中的 `bodyOpen` 内联脚本在 color-mode 的 head 脚本之后、页面内容之前运行，复用 `window.__NUXT_COLOR_MODE__.preference` 初始化该属性，不重复读取存储；组件在 `colorMode.unknown` 结束后同步后续偏好变化，避免接管前用服务端默认值覆盖已保存的偏好。按钮在客户端确定状态后启用，无需替换图标占位。保持 `classSuffix: ""`，使深色模式在同一 `<html>` 上同时保留 `brutal` 和 `dark` 类，与主题包和 Tailwind 的 dark variant 一致。

图标使用 Lucide 的官方 Vue 包 `@lucide/vue`，在使用处具名导入所需图标组件，随应用构建输出 SVG。图标颜色继承主题语义颜色；图标按钮提供可访问名称，装饰性 SVG 使用 `aria-hidden="true"`。主题按钮的行为约定见 [设计方向](specs/design.md)。

GitHub 品牌标识使用 [Primer Octicons 的 mark-github](https://github.com/primer/octicons/blob/main/icons/mark-github-16.svg)，源文件与 MIT 许可保留在 [github.svg](../app/assets/icons/github.svg)。当前安装的 Lucide 包不提供该品牌图标，因此单独引入这个 SVG 资源，用 CSS 遮罩继承文字颜色，无需新增图标库依赖。通过 Vite 的 `?inline` 将图标编入页面中的 data URL，避免刷新时等待独立遮罩文件而出现闪烁；传入 CSS `url()` 时为资源地址保留引号。

## 公开资源

静态资源由 `public/` 输出到生成目录。简历文件的保留要求见 [重建要求](specs/requirements.md)，资源一致性校验见 [开发约定](development.md#检查)。

## 站点标识与分享信息

[nuxt.config.ts](../nuxt.config.ts) 注册全站图标和默认标题；首页的标题、描述、canonical、Open Graph 与 Twitter Card 元信息集中在 [pages/index.vue](../app/pages/index.vue)，随页面预渲染到 HTML。首页元信息使用正式域名 `https://ayingott.me/`，分享图片使用该域名下的绝对地址。页面级文案仅维护一份，普通描述与分享描述共用同一变量；错误页继续独立设置标题和 `noindex, nofollow`。接口约定见 [Nuxt SEO](https://nuxt.com/docs/4.x/getting-started/seo-meta) 与 [Open Graph](https://ogp.me/)。

素材的视觉约定见 [设计方向](specs/design.md#站点标识与分享初版)。文件职责如下：

| 文件                                                      | 用途                                          |
| --------------------------------------------------------- | --------------------------------------------- |
| [favicon.svg](../public/favicon.svg)                      | 浏览器图标的矢量源文件，含深浅配色            |
| [favicon.png](../public/favicon.png)                      | 96 × 96px 的浅色图标，供 PNG 图标使用场景读取 |
| [apple-touch-icon.png](../public/apple-touch-icon.png)    | 180 × 180px 的手机收藏图标                    |
| [social-card.svg](../app/assets/identity/social-card.svg) | 分享卡片的矢量源文件                          |
| [og-image.png](../public/og-image.png)                    | 1200 × 630px 的分享图片                       |

Favicon 使用已选字体的轮廓，分享卡片使用 `@ayingott/theme` 0.3.0 中的 Bricolage Grotesque 与 LXGW WenKai 字形轮廓；配色取自该版本的 `brutal` 主题。SVG 和 PNG 均可独立显示，无需额外字体请求。SVG 是素材维护来源，修改后按表中尺寸重新导出 PNG；主题字体或配色更新时需同步检查这组静态素材。导出工具临时使用，不新增应用依赖或构建脚本。
