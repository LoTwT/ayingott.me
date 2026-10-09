# 404 预渲染与错误页样式线上验收

## 对象与发布

对象为 `main` 上的 `569093a`（#34）。Wrangler 列出的生产部署 `e8fbb504-ceef-46d9-8730-23bdaba5f9e3` 来自 `main` 的该提交，即 Git 集成发布；未查看该次 Cloudflare 构建日志。

在同一提交、Node 24、pnpm 10.33.0 下本地执行 `pnpm build` 并与线上响应比对：

- `404.html` 仅 `buildId` 不同；首页 HTML 除 `buildId` 与 `prerenderedAt` 外，差异只来自下文的 Cloudflare 邮箱混淆。
- `robots.txt`、`sitemap.xml` 与仓库文件字节一致。[站点维护验收](2026-10-09-site-maintenance.md) 中待确认的 Cloudflare 托管 robots.txt 合并问题，线上实际返回仓库文件，没有附加托管内容。

## HTTP 检查

按 [发布验收](../release.md#发布验收) 对 `https://ayingott.me` 执行：首页 `200`，未知嵌套路由 `404`，`/resume.pdf` 与 `public/resume.pdf` 字节一致，`/sitemap.xml` 返回 `200`。

## 浏览器检查

使用临时 Playwright 1.64（Chromium headless shell）脚本检查线上地址，视口为 1440 × 1000 与 390 × 844（触屏），系统配色为浅色：

- 禁用 JavaScript 时，未知路由返回 `404`，页面直接显示状态码“404”、标题“这里还没有页面”与指向 `/` 的“回到首页”，页面标题为“这里还没有页面 · Lo”。
- 错误页样式与 [设计方向](../specs/design.md#错误页) 一致：状态码为 14px 的 Space Mono、`--text-muted` 色，与标题间距 8px；标题为 Bricolage Grotesque，桌面 36px、移动端 30px；返回链接默认 `--text-muted`、无下划线，高 44px，左缘与标题对齐，箭头 16px。两种视口均无横向溢出。
- 桌面端悬停时链接变为 `--text-secondary`，箭头向左移动 2px，过渡为 260ms `cubic-bezier(0.22, 1, 0.36, 1)`；键盘聚焦显示主题焦点提示，箭头同样移动。触屏视口不应用过渡与位移。
- 首页与错误页的首个 Tab 均为“跳到正文”，回车后焦点落在 `#main-content`，`outline-style` 为 `none`，不再显示此前的浏览器默认焦点框。
- 两种视口点击“回到首页”均回到 `/`。错误页控制台只有文档本身的 404 资源报错，不再出现 `[NUXT_E1005]`；首页无控制台报错，两页均无其他失败请求。

## 观察到的线上行为

Cloudflare 的邮箱地址混淆改写了首页邮箱链接：HTML 中的 `href` 为 `/cdn-cgi/l/email-protection#…`，并注入 `email-decode.min.js`。浏览器加载后链接恢复为 `mailto:hi@ayingott.me`，可访问名称不受影响。这一改写来自 Cloudflare 区域设置，不在仓库中，本次未修改；禁用 JavaScript 时该链接指向 Cloudflare 的“Email Protection”提示页，状态码为 `404`，不会打开邮件客户端。

本次只用 Chromium 检查浅色主题；深色错误页、WebKit、Firefox 与 Lighthouse 由 [跨浏览器与 Lighthouse 线上检查](2026-10-09-browser-coverage.md) 补充，真实触屏设备未检查。检查脚本仅临时使用，未加入项目。
