# 跨浏览器与 Lighthouse 线上检查

对象为 `https://ayingott.me` 上 `569093a`（#34）的生产部署，部署核对见 [错误页线上验收](2026-10-09-error-page.md)。此前的记录只覆盖 Chromium，本次补充 WebKit、Firefox 与 Lighthouse。

## 跨浏览器检查

使用临时 Playwright 1.64 脚本，引擎为 WebKit 27.2、Firefox 157.0、Chromium 156.0；每个引擎都检查 1440 × 1000 桌面视口与 390 × 844 触屏视口（Firefox 不支持移动端模拟，只设置视口与触摸），系统配色为浅色。三个引擎、两种视口的结果一致：

- 首页标题、页脚 `© 2026 Lo`、三个图标链接的可访问名称与地址正确，无横向溢出。
- 实际加载的字体为 Bricolage Grotesque 与 LXGW WenKai 400、500 子集，`document.fonts` 中三者均为已加载。
- 主题按钮按“跟随系统 → 浅色 → 深色”循环，选深色后刷新仍保持深色。
- 深色下访问未知路由返回 `404`，错误页保持深色，返回链接使用深色主题的 `--text-muted`；点击“回到首页”回到 `/`。
- Firefox 与 Chromium 桌面端首个 Tab 为“跳到正文”，回车后焦点落在 `#main-content`，无焦点轮廓。WebKit 按 Safari 默认设置，Tab 不聚焦链接；用 Option+Tab 时首个焦点为“跳到正文”，回车后的结果相同。

控制台与请求中观察到的内容均不来自仓库代码，或不影响页面：

- Firefox 与 WebKit 中，Cloudflare Web Analytics 的 `/cdn-cgi/rum` 上报请求被取消，WebKit 将其报为访问控制错误。该脚本由 Cloudflare 注入。
- WebKit 提示 `_payload.json` 预加载后数秒内未使用，来自 Nuxt 生成的预加载标签。
- WebKit 触屏视口出现过一次 `[NUXT_E5002]`（无法获取应用清单），同时 `builds/meta` 请求失败。原因是脚本在请求完成前就刷新或跳转了页面；单独连续加载三次时，该请求均返回 `200`，没有再出现该错误。

## Lighthouse

使用 Lighthouse 12.8.2 和 Playwright 自带的 Chromium 156 检查首页，网络经过本机代理，结果只作参考：

| 预设 | 性能 | 无障碍 | 最佳实践 | SEO | FCP   | LCP   | TBT  | CLS |
| ---- | ---- | ------ | -------- | --- | ----- | ----- | ---- | --- |
| 移动 | 100  | 100    | 100      | 100 | 1.2 s | 1.2 s | 0 ms | 0   |
| 桌面 | 97   | 100    | 100      | 100 | 0.9 s | 0.9 s | 0 ms | 0   |

两种预设未通过的单项诊断相同：

- Cloudflare 注入的 `beacon.min.js` 与 `email-decode.min.js` 缓存时间短；前者含旧版语法，后者阻塞渲染。两者都不在仓库中，来自 Cloudflare 的 Web Analytics 与邮箱混淆，后者见 [错误页线上验收](2026-10-09-error-page.md#观察到的线上行为)。
- 入口脚本约有 27 KiB 未使用，属于 Nuxt 运行时。
- `entry.css` 阻塞渲染；网络依赖树洞察未通过，未给出具体项目。
- `bf-cache` 失败原因为“Internal error”，Lighthouse 标为不可操作。

## 未覆盖

未在真实 iOS、Android 设备或正式版 Safari、Firefox 中检查，结果来自 Playwright 引擎与模拟视口。检查脚本与报告仅临时使用，未加入项目。
