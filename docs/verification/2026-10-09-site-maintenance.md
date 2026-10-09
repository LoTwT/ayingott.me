# 生产状态核对与站点维护验收

## 生产现状

2026-10-09 对 `https://ayingott.me` 做 HTTP 核对，对象为 `main` 上的 `86dceb4`（#31）通过 Git 集成发布的版本：

- 首页返回 `200`，HTML 包含 #31 的磁吸图标结构 `magnetic-visual`，确认线上已是 #30、#31 之后的首页。
- 未知路由返回 `404`；`/resume.pdf` 与 `public/resume.pdf` 字节一致。
- 旧站地址 `/about`、`/works`、`/blog` 均返回 `404`，按 [重建要求](../specs/requirements.md#生产状态与站点维护) 保持该行为。
- 线上 `robots.txt` 为 Cloudflare 托管的内容信号声明，仓库中没有对应文件；`/sitemap.xml` 返回 `404`。

本机到该域名的 TLS 连接偶发 `SSL_ERROR_SYSCALL`，重试后结果如上。未对线上做浏览器检查，未查看 #30、#31 的 Cloudflare 构建日志。

## 本次改动

范围见 [重建要求](../specs/requirements.md#生产状态与站点维护)：新增 `robots.txt`、`sitemap.xml` 与 `Person` 结构化数据，页脚年份改为构建时确定。站点域名、姓名、GitHub 用户名与邮箱集中到 `app/utils/profile.ts`，页面标题、描述、分享信息、首屏标题、页脚与错误页标题均从中读取；分享图 `og-image.png` 及其 SVG 源文件中的文字为静态素材，不随之变化。

## 本地验证

以下结果均来自同一份最终工作区的构建与预览，基于 `86dceb4`，Node 24、pnpm 10.33.0：

- `pnpm check` 与 `pnpm build` 通过；构建产物与 Wrangler 预览返回的 `resume.pdf` 均与 `public/resume.pdf` 字节一致。
- Wrangler 本地预览：首页 `200`；未知嵌套路由与旧站地址 `/about`、`/works`、`/blog`、`/blog/hello-phase-a` 均为 `404`；`robots.txt`、`sitemap.xml` 返回 `200`。
- 首页 HTML 的标题、描述、`og:site_name`、分享图说明、首屏标题与 GitHub 可访问名称与改动前文案一致；输出预期的 `Person` JSON-LD；页脚为 `© 2026 Lo`，与 payload 中的 `copyrightYear` 一致，预渲染与水合使用同一值。

未做浏览器检查，404 页的“回到首页”入口沿用此前验收结论；未发布预览或生产。Cloudflare 托管 robots.txt 与仓库文件的合并行为需在发布后按 [发布验收](../release.md#发布验收) 确认。
