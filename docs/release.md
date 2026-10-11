# Cloudflare 发布

站点静态生成，产物为 `.output/public`，不部署 Nuxt 服务端。Cloudflare Pages 项目 `ayingott-me` 连接 `LoTwT/ayingott.me`，生产分支为 `main`，域名为 `ayingott.me` 和 `www.ayingott.me`。

## 构建配置

| 设置                      | 值                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| 构建根目录                | 仓库根目录                                                                                       |
| 构建命令                  | `pnpm install --frozen-lockfile && pnpm check && pnpm build`                                     |
| 输出目录                  | `.output/public`                                                                                 |
| 构建环境                  | v3                                                                                               |
| Node 与 pnpm 版本         | 由 [.node-version](../.node-version) 与 [package.json](../package.json) 的 `packageManager` 固定 |
| `SKIP_DEPENDENCY_INSTALL` | 在 [wrangler.jsonc](../wrangler.jsonc) 的 `vars` 中设为 `"1"`，安装由构建命令执行                |
| 预览分支                  | 所有分支都会构建预览                                                                             |

- 构建所需的非敏感变量写在 `wrangler.jsonc` 的 `vars` 中，不依赖控制台里的同名变量。
- 不要设置 `NITRO_PRESET`：Content 遇到含 `cloudflare` 的值会切换到 D1，构建会被 [nuxt.config.ts](../nuxt.config.ts) 中的断言终止。
- 升级 Node 或 pnpm 时只改版本文件。

## 发布

1. 在分支上完成 [开发检查](development.md#检查)。
2. 推送分支后，Cloudflare 会自动构建预览，并在 GitHub 上显示构建结果与预览地址。打开预览确认页面正常。
3. 合入 `main` 即发布到生产。

## 官方资料

- [Nuxt 静态部署](https://nuxt.com/docs/4.x/getting-started/deployment)
- [Cloudflare Pages 构建环境](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Pages Wrangler 配置](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
