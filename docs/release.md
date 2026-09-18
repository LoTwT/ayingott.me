# Cloudflare 发布

项目使用 SSG，产物为 `.output/public`，不部署 Nuxt 服务端。线上沿用 Cloudflare Pages 项目 `ayingott-me`，连接 `LoTwT/ayingott.me`；生产分支 `main`，域名为 `ayingott.me` 和 `www.ayingott.me`。

## 构建配置

构建命令已于 2026-09-16 随验收流程简化更新，并通过 Cloudflare API 回读确认。首轮配置迁移见 [工程验收记录](verification/2026-09-14-foundation.md)；首次 Git 构建暴露的问题与修复验证见 [Git 预览记录](verification/2026-09-16-git-preview.md)。

| 设置                      | 值                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------- |
| 构建根目录                | 仓库根目录                                                                              |
| 构建命令                  | `pnpm install --frozen-lockfile && pnpm check && pnpm build`                            |
| 输出目录                  | `.output/public`                                                                        |
| 构建环境                  | v3                                                                                      |
| Node 版本                 | 由 [.node-version](../.node-version) 固定                                               |
| pnpm 版本                 | 由 [package.json](../package.json) 的 `packageManager` 固定                             |
| `SKIP_DEPENDENCY_INSTALL` | 在 [wrangler.jsonc](../wrangler.jsonc) 的 `vars` 中设为 `"1"`，安装由上面的构建命令执行 |
| 生产分支                  | `main`                                                                                  |
| 预览分支                  | 保留现有全部分支预览设置                                                                |

构建环境需同时覆盖 Production 与 Preview。Pages 使用仓库中的版本文件选择 Node 与 pnpm；使用 Wrangler 配置后，构建所需的非敏感变量在其 `vars` 中维护，不能仅依赖控制台中的同名普通变量。[wrangler.jsonc](../wrangler.jsonc) 还固定 Pages 项目名、输出目录和兼容日期；该兼容日期控制 Pages Functions 运行时，不决定构建用的 Node 版本。

升级 Node 或 pnpm 后，更新对应版本文件并检查 Git 构建日志中实际使用的版本，不依赖控制台默认值。安装必须使用锁文件；不要把 `.output` 或本地 `node_modules` 提交到 Git。

## 发布前检查

先完成 [开发检查](development.md#检查)、[Wrangler 本地预览](development.md#本地预览) 和下面的发布验收。共用开发方法由开发文档维护；本页说明 Cloudflare 配置、上传与发布后的验证。

## 分支预览

先完成上面的检查，使用明确的非生产分支名。以下是首轮工程分支的直接上传命令；上传未提交的工作区时保留 `--commit-dirty=true`，避免把产物误记为已提交代码：

```bash
pnpm exec wrangler pages deploy .output/public --project-name ayingott-me --branch codex/nuxt-foundation --commit-dirty=true
```

命令返回实际预览地址后，对该地址完成下面的发布验收。

直接上传验证 Cloudflare 的真实托管行为，不会验证 Cloudflare 从 Git 拉取源码后的构建过程。Git 自动构建需在代码发布到远端分支后另外查看构建日志，不能把直接上传成功当作 Git 构建通过。

## 发布验收

以下检查适用于 Wrangler 本地预览与实际部署地址。先确认本次构建或上传成功；使用 Git 集成时查看该次 Cloudflare 构建日志。

确认构建保留了原 PDF，命令成功时无输出：

```bash
cmp public/resume.pdf .output/public/resume.pdf
```

将 `site_url` 设置为待验收地址，下面以本地预览为例：

```bash
site_url='http://localhost:8788'
curl -sS -o /dev/null -w '%{http_code}\n' "$site_url/"
curl -sS -o /dev/null -w '%{http_code}\n' "$site_url/__preview-check__/missing/"
curl -fsS "$site_url/resume.pdf" | cmp public/resume.pdf -
```

前两个请求应依次返回 `200`、`404`；PDF 比较应退出成功且无输出。PDF 的保留要求见 [重建要求](specs/requirements.md)。

再完成 [浏览器检查](development.md#本地预览)，确认实际页面内容、交互和资源加载正常。基础检查与构建通过后，仍需完成这一步。

## Git 构建与生产发布

代码推送到远端分支后，检查 Cloudflare Git 自动构建日志，并对该次预览地址运行 HTTP 与浏览器验证。生产发布使用 `main` 的 Git 集成。

实际部署地址、已通过的检查及未验证事项统一记录在 [验收记录](index.md#验收记录)，不将预览上传成功等同于生产发布或 Git 构建通过。

## 官方资料

- [Nuxt 静态部署](https://nuxt.com/docs/4.x/getting-started/deployment)
- [Cloudflare Pages 构建环境](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Pages Wrangler 配置](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
