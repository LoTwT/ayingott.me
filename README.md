# ayingott.me

Lo 的个人主页与文章，使用 Nuxt、Nuxt Content、Tailwind CSS 和 `@ayingott/theme`，静态生成后部署到 Cloudflare Pages。

项目范围、设计、开发约定与发布说明统一从 [文档索引](docs/index.md) 进入。

## 快速开始

使用 Node 24 LTS，具体版本见 [.node-version](.node-version)；pnpm 版本见 [package.json](package.json) 的 `packageManager`。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## 检查与预览

```bash
pnpm check
pnpm build
pnpm preview
```

`build` 生成 `.output/public`，`preview` 使用 Wrangler 运行这份产物，修改源码后需要重新构建。检查与发布方法见 [开发约定](docs/development.md) 与 [发布说明](docs/release.md)。
