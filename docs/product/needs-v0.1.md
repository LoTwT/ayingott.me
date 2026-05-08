# ayingott.me 重设计 · 产品需求 v0.1

- 文档版本：v0.1（定稿）
- Owner：Product (@Product)
- 起草日期：2026-05-05
- 项目仓库：https://github.com/lotwt/ayingott.me
- 当前部署：Cloudflare（备选 Railway）/ 域名 ayingott.me
- 频道：#ayingott-me

---

## 1. 项目定位

### 1.1 核心定位

**长期演进的个人自留地**：博客 + 作品集 + 数字花园 + 兴趣表达，对外亦自然可读。

**不是**：求职简历站 / link-in-bio 聚合器 / 商业品牌网站。

### 1.2 心智模型

- **自己舒服优先**，对外人合理可读
- **需要什么就做什么**：V1 不强求功能完整，但视觉与架构留足后续扩展空间
- **长期演进**：无 deadline，按里程碑推进

---

## 2. 受众

| 优先级 | 受众                     | 设计含义                     |
| ------ | ------------------------ | ---------------------------- |
| 1      | 自己（lo-user）          | 自己看着舒服 = 一票否决线    |
| 2      | 同行 / 开源协作者 / 读者 | 中文技术圈友好；信息密度合理 |
| 3      | 一般访客                 | 可读但不刻意讨好             |

> 不专门为 recruiter / 海外 / 朋友圈设计；这些人能看懂即可。

---

## 3. V1 内容范围

### 3.1 Must-have（V1 上线必有）

| 板块               | 描述                                              | 备注                                                  |
| ------------------ | ------------------------------------------------- | ----------------------------------------------------- |
| **Bio / 自我介绍** | 极简 tagline + 兴趣段落（B+A 混合，非传记式 bio） | 见 AY-D-14                                            |
| **博客**           | 文章列表 + 详情页（容器就位即可，初期可空）       | `@nuxt/content` v3，Markdown / MDC                    |
| **联系方式**       | GitHub / X / 邮箱                                 | X handle 显式 + 邮箱别名（hi@ayingott.me）+ JS encode |

### 3.2 Nice-to-have（V1 可空 / V1.x 加）

| 板块                   | 描述                                                            | V1 状态                      |
| ---------------------- | --------------------------------------------------------------- | ---------------------------- |
| **现在在做什么 (now)** | 简短当前状态 / 进行中项目                                       | 容器可留位                   |
| **简历入口**           | 单按钮 + 可配置条件渲染（PDF 链接由 lo-user 上传 CDN 后填配置） | 组件就位，链接为空时按钮隐藏 |
| **兴趣展示**           | ZZZ / 二次元 / 阅读 / 折腾痕迹等                                | V1 可空                      |
| **RSS / Atom**         | 博客订阅                                                        | 博客有内容后启用             |

### 3.3 Won't-have（V1 明确不做）

- 求职 / Hire me / Resume PDF 默认嵌入页面
- link-in-bio 聚合（不堆砌平台图标）
- 评论 / guestbook / Newsletter 表单
- Live status / 听歌 / 编辑器活动
- 友链 / Webring（V1.x+ 视心情）
- 多语切换器（中文优先；EN 后续视访客增长再加）
- 命令面板 / 高级交互（V1 简洁优先）

---

## 4. 视觉调性

### 4.1 Product 范围约束

- 简洁 / 留白 / 不堆砌
- 给"工具感 / 可信感 / 有趣"，避免"模板感 / 二次元过头 / 花里胡哨 / 假大空"
- 信息密度服务自己优先，可中等密度

### 4.2 UX 拍板的关键词

- 点线面（几何）
- 简约大方但有趣
- 参考 slock.ai

### 4.3 不要

- 模板感 / 千篇一律 individual homepage
- 视觉过度（动效爆炸 / 满屏渐变 / 二次元贴图）
- 静态图站感（缺少互动 / 没生命）

---

## 5. 边界与约束

| 项           | 决策                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| **语言**     | 中文优先；V1 仅中文，EN 视后续访客需求再加                                                 |
| **时间线**   | 长期演进，无 deadline；小步快跑                                                            |
| **技术栈**   | 保留 Nuxt + Vue 生态；S1 迁移为 Tailwind CSS v4 + `@ayingott/theme@0.0.1`，UnoCSS 移除     |
| **部署**     | 当前 Cloudflare；必要时迁 Railway（TL 评估，目前不主动换）                                 |
| **数据存储** | V1 默认静态；V1.x 视具体功能（如评论）再定                                                 |
| **隐私**     | 脱敏一切真实信息（真实姓名 / 现居 / 邮箱 / 简历 PII / 其他社媒）；公开 = GitHub / X / 邮箱 |
| **可访问性** | WCAG AA 起步（详见 §10）                                                                   |
| **响应式**   | 桌面优先 + 移动可读；不强求 mobile-first                                                   |

---

## 6. 阶段化路线（lo-user 锁定 · 小步快跑）

### S1：技术栈升级（独立 PR · 不改视觉）

- Nuxt / Vue / Nitro / color-mode 保持最新兼容线
- UnoCSS → Tailwind CSS v4
- 接入 `@ayingott/theme`：
  ```css
  @import "tailwindcss";
  @import "@ayingott/theme/fonts.css";
  @import "@ayingott/theme";
  ```
- 保持静态生成与 Cloudflare 部署路径
- ESLint / TS config 跟进
- 验收：现有签名页面在新栈下视觉与功能完全一致

### S2：设计语言重构 + UI（独立 PR · 不加新功能）

- 落地点线面视觉系统（设计 tokens / 组件 spec / 关键页面线框）
- 重构 `index.vue` + 增加 layouts / page shells（about / blog 容器 / contact）
- 暗色模式适配新设计系统
- 验收：UX spec 与实现一致 + a11y 通过

### S3：新功能逐步加（按需多个小 PR）

- 博客容器接入实际内容（`@nuxt/content` v3）
- 简历按钮 + 条件渲染 + CDN PDF link 配置
- now 页 / 兴趣展示 / RSS 等 nice-to-have 按节奏加
- 每个功能单独 PR，独立可上线

> **原则**：S1 / S2 / S3 之间不强耦合，各自可单独发布；任一阶段可暂停而不阻塞其他。

---

## 7. 决策记录摘要

详见 [`docs/product/decisions/`](./decisions/)。

| ID          | 决策                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------- |
| **AY-D-01** | V1 定位 = 个人自留地（博客 + 作品集 + 数字花园 + 兴趣），非求职                              |
| **AY-D-02** | 受众优先级 = 自己 > 同行 > 一般访客                                                          |
| **AY-D-03** | V1 Must = bio + 博客容器 + 联系方式；其他 nice-to-have 按需加                                |
| **AY-D-04** | 中文优先；EN 后续看访客需求                                                                  |
| **AY-D-05** | 保留 Nuxt + Vue 生态；S1 迁移到 Tailwind CSS v4 + `@ayingott/theme`，UnoCSS 移除             |
| **AY-D-06** | Cloudflare 当前，Railway 备选；不主动换                                                      |
| **AY-D-07** | 隐私：公开 = GitHub / X / 邮箱；其他真实信息全部脱敏                                         |
| **AY-D-08** | 简历 = 按钮 + 条件渲染 + CDN PDF（link 由 lo-user 维护）                                     |
| **AY-D-09** | 阶段化 = S1 升级 → S2 设计 → S3 功能；小步快跑                                               |
| **AY-D-10** | 视觉 = 简洁 + 点线面 + slock.ai 参考；UX 拍最终方向                                          |
| **AY-D-11** | X handle 公开形式 = A 显式 @handle，呈现样式符合 UX 新设计语言                               |
| **AY-D-12** | 博客内容来源 + 管线 = `@nuxt/content` v3（本地 MD/MDC，frontmatter / RSS / TOC / SEO 内置）  |
| **AY-D-13** | 文章 license = CC-BY 4.0                                                                     |
| **AY-D-14** | Bio 写法 = B + A 混合（极简 tagline 主入口 + 兴趣段落，不写传统传记式 bio）                  |
| **AY-D-15** | 博客 taxonomy = V1 纯时间线，V1.x 视需要加 tags                                              |
| **AY-D-16** | 联系入口 = 别名（如 hi@ayingott.me）+ JS encode 反爬                                         |
| **AY-D-17** | 字体选型 → 交由 UX 在设计系统阶段定（候选基线：system-ui 中文 + Space Grotesk + Space Mono） |
| **AY-D-18** | 隐私静态文件脱敏流程 = lo-user 上传前发出来全员检查 + UX 出 checklist + QA 复核              |
| **AY-D-19** | a11y 验收 = WCAG AA 对比度 / 焦点可见 / 暗色不退化 / 触屏热区 ≥44×44                         |

---

## 8. 待 UX 接力的输入

- IA / 站点地图 / 页面 sections
- 设计 tokens（色彩 / 字体 / 间距 / 圆角 / 阴影 / 暗色映射）
- 组件 spec + 状态枚举
- slock.ai 拆解（哪些借鉴 / 哪些不要）
- 给 lo-user 的 Claude Design / v0 / Figma AI prompt 包

## 9. 待 TL 评估的项（S1 / S2 触发时）

- Nuxt 最新兼容线 + breaking change 影响面
- Tailwind CSS v4 / `@ayingott/theme` / color-mode / @nuxtjs ecosystem 兼容性
- Cloudflare Pages / Workers Static Assets vs Railway 部署对比（仅在 runtime 需求出现时迁移）
- 数据存储方案（V1.x 启用评论 / 表单时回头评估）

## 10. QA 验收口径锚点

- **S1 视觉零回归**：截图对比 + 手测，新栈下 `index.vue` 与升级前像素一致
- **S2 UX spec 一致性 + a11y（明确口径）**：
  - 颜色对比度 WCAG AA：正文 ≥ 4.5:1，大字号 ≥ 3:1
  - 焦点状态可见（键盘 navigation 全程有 focus ring）
  - 暗色模式 contrast 不退化（暗色下同样满足 AA）
  - 触屏热区 ≥ 44×44 px
- **S3 各功能独立可关 / 可发布**：feature flags 或 conditional render，关闭某项不影响其他

---

## 11. Open Questions

### 11.1 产品 / UX 类

- **OQ-01** X handle 公开形式 → ✅ AY-D-11 锁定（A 显式）
- **OQ-02** 博客内容来源 → ✅ AY-D-12 锁定（`@nuxt/content` v3）
- **OQ-03** 文章 license → ✅ AY-D-13 锁定（CC-BY 4.0）
- **OQ-04** 字体选型 → ✅ AY-D-17 锁定（UX 设计系统阶段定）
- **OQ-09** Bio 写法 → ✅ AY-D-14 锁定（B + A 混合）
- **OQ-10** 博客 taxonomy → ✅ AY-D-15 锁定（V1 时间线）

### 11.2 技术 + 产品交叉类（待触发时拍）

- **OQ-05** **Nuxt 渲染模式**：✅ S1 锁定纯 SSG / static output（`pnpm generate` → `.output/public`）+ Cloudflare。SSR / hybrid 仅在未来评论、表单、私有 API 或其他 runtime 需求出现时重新评估。
- **OQ-06** **博客内容管线**：与 OQ-02 紧耦合，已锁 `@nuxt/content` v3 → S2 设计前定具体目录结构

### 11.3 S3 实施前必须拍

- **OQ-07** **隐私脱敏全面检查** → ✅ AY-D-18 锁流程（静态文件 lo-user 上传前发全员检查 + UX checklist + QA 复核）
- **OQ-08** **联系入口安全** → ✅ AY-D-16 锁（别名 + JS encode）

---

## 附录 A · 现状速读（2026-05-05）

| 维度   | 现状                                                                    |
| ------ | ----------------------------------------------------------------------- |
| 仓库   | https://github.com/lotwt/ayingott.me                                    |
| 框架   | Nuxt 4 + Vue + Tailwind CSS v4 + `@ayingott/theme` + @nuxtjs/color-mode |
| 页面   | `app/pages/index.vue`（签名 SVG "Hi, I'm 龙" + theme toggle）           |
| 组件   | `app/components/signature.vue` + `theme/`                               |
| Server | `server/` 空目录                                                        |
| 部署   | https://ayingott-me.vercel.app（生产 Cloudflare 待确认）                |
| README | 已替换为项目说明 + S1 栈说明                                            |

附录 B / C 由 UX + TL 在 S1 / S2 启动后补充。
