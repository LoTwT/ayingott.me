# 2026-09-16：Git 预览构建

这是该次验收的历史记录，操作步骤见 [发布说明](../release.md)。

## 首次 Git 构建

使用 `eruoos` 将 `codex/nuxt-foundation` 推送至 `LoTwT/ayingott.me`，远端回读确认为提交 `4a321a100aa83e74372e5e105d4db9c2f652cab1`。Cloudflare Pages 自动创建预览部署 `504b2ca9-5b28-49d1-a1c8-bb0e313cb1f4`，触发类型为 `github:push`，提交与分支均匹配。

- 云端使用 Node 24.19.0、pnpm 10.33.0，lint、格式检查、类型检查及静态生成均通过。
- 部署失败：静态生成输出到 `dist`，Pages 读取 `.output/public` 时找不到目录。
- 日志还显示自动安装与构建命令中的安装各执行一次；Wrangler 导出的构建变量为空，控制台中的 `SKIP_DEPENDENCY_INSTALL` 没有阻止自动安装。
- 生产分支 `main` 仍为 `bb8ba8dee27a62e7d4cbcd9faf15719c592b31e8`，生产部署仍为 `d43f84ff-cc67-4f2f-8fec-9950337c75cf`。

## 原因与本地修复

在已安装的 Nitro 2.13.4 中，`CF_PAGES=1` 会让未显式设置的预设从 `static` 变为 `cloudflare-pages-static`，后者默认输出到 `dist`。独立配置解析对照复现了这个差异；显式指定 `static` 后恢复为 `.output/public`。

本地在 [nuxt.config.ts](../../nuxt.config.ts) 固定 `nitro.preset: "static"`，并在 [wrangler.jsonc](../../wrangler.jsonc) 的 `vars` 中声明 `SKIP_DEPENDENCY_INSTALL: "1"`。同步检查了构建、预览与发布配置中对输出目录的引用，均使用 `.output/public`。

- `pnpm check` 通过。
- `CF_PAGES=1 CI=1 pnpm build` 通过，产物目录为 `.output/public`，包含首页与 `404.html`。
- 原始 PDF 与生成的 PDF 字节一致。
- Wrangler 的 `pages functions build-env` 在 `preview`、`production` 环境下都导出正确的输出目录与跳过安装变量。
- `git diff --check` 通过。此次通过配置对照、实际构建与部署日志验证，未新增长期验收脚本。

## 待完成

修复后的 Cloudflare Git 构建与实际预览 HTTP、浏览器检查仍待验证；不能将上述本地结果视为云端部署通过。
