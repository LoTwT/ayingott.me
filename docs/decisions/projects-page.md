# 作品页交接

2026-11-16 完成本地实现与独立评审。当前要求以[作品页规格](../specs/projects.md)、[设计方向](../specs/design.md)和[架构说明](../architecture.md#作品内容与构建)为准，本文只记录取舍、验收与维护入口；原型和临时验收文件不是维护依赖。

## 已闭合的决定

- 使用站点共享48rem外框，撤销作品独有1040px宽版。共享Header为导航和主题保留独立布局空间，大字号时允许增高；作品图文按实际容器宽度切换排列。
- 首版仅Nicole，使用标注为示意的Markdown封面；公开素材核对与能力来源见[实施记录](../specs/projects.md#实施记录)。用途按自然词组维护一份文本，SSR/客户端共用，超长词组才内部折行。
- 内容波浪线按稳定键分配三色，交互只控制显隐；绘制和擦回均保持本色，减少动态效果时直接到达对应状态。导航使用原独立笔划。首页图标及404箭头/文字中性，仅圆环和文字下波浪线显色。
- 第1修复轮闭合导航遮挡与词组拆行；共享宽度校正也修复了大字号首页星星溢出。第2修复轮闭合退场变灰；其后中性色收敛经独立增量复核通过，没有未闭合Required或Follow-up。

## 验收记录与范围

源码最终验收基线为25文件内容快照 `f2f6b1d74f675b64276321248549f71c10616874a5d53a359c8a823aadf4bef0`，实际构建ID `cf3635d6-7ed1-46b2-82a5-5f9a267fe10b`。文档收尾没有修改该源码基线。

- 在Node24.19.0、pnpm10.33.0执行 `pnpm check`、`pnpm build`，均exit0，生成15个路由；实际构建检查过页面、canonical/分享元信息、1200×630分享图、sitemap、资源与简历字节。简历HEAD/源码/输出SHA256均为 `3c00677d9cc8fd395e429fa3eab3b38a53f55e11b938751f4091fc09d651969e`。
- 已完成共享外框/导航/页脚对齐、窄屏与放大字号、自然词组/超长内容、可选字段/图片/定制预览/空状态、SSR水合、主题/页面过渡/背景/蛋蛋及reduced-motion的目标检查。后续仅针对样式delta检查；未变范围明确复用已有结果，没有反复重跑全矩阵。
- 最终样式检查覆盖明暗idle/hover、真实Tab聚焦与失焦、退场首中末保色，以及362px默认/32px根字号下的热区和布局。独立评审确认最终4文件delta，其余21文件不变，开始/结束快照一致；独立抽查了明暗、真实Tab和退场首中末。check/build、尺寸和完整动效结果由评审复用实施者证据，并非独立重复执行。
- 浏览器范围为本机Chromium响应式视口及CSS根字号；未覆盖真机、系统缩放、Safari/Firefox或线上部署。未安装运行Nicole。本次文档收尾只检查格式、相对链接和源码摘要，复用已审源码的构建/浏览器结果。

## 后续维护入口

- 修改正式清单与顺序：编辑 [projects.ts](../../app/data/projects.ts)；可选字段省略即不展示，不向列表组件写入项目特例。
- 修改预览：配置 `preview` 的image或component分支，支持带alt的图片或带可访问说明的Vue组件；默认字标由 [ProjectPreview.vue](../../app/components/projects/ProjectPreview.vue)处理。[NicolePreview.vue](../../app/components/projects/NicolePreview.vue)可独立替换，统一纸框/比例由 [ProjectList.vue](../../app/components/projects/ProjectList.vue)维护。
- 页面介绍/SEO/分享图文本只改 [projects-page.ts](../../app/utils/projects-page.ts)，构建由 [projects-page.ts模块](../../modules/projects-page.ts)复用分享卡片管线。用途词组渲染见 [ProjectDescriptionText.vue](../../app/components/projects/ProjectDescriptionText.vue)，线条分色见 [content-link-color.ts](../../app/utils/content-link-color.ts)。
- 修改后按[开发约定](../development.md#检查)执行必要检查，并在实际构建预览检查受影响行为。既有结论不能替代以后产品改动的验证。

代码、最终规格与本交接统一保存在主目录的 `feat/works-page` 分支，作为普通仓库文件维护；删除本地设计工具及其临时资料不影响这些文件。用户已授权本地提交，此交付不包括远程推送、PR、合并或部署，后续Git操作仍按当次授权执行。临时原型、截图、录屏与大矩阵脚本不纳入产品提交。
