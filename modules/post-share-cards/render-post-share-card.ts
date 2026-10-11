import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { Resvg } from "@resvg/resvg-js"
import { imageSize } from "image-size"
import satori from "satori"
import subsetFont from "subset-font"

// 卡片尺寸与配色沿用首页分享卡片（app/assets/identity/social-card.svg）。
export const shareCardWidth = 1200
export const shareCardHeight = 630
const cardPadding = 80
const cardColors = {
  canvas: "#fcf6ea",
  primary: "#111111",
  muted: "#5a5141",
  imageBorder: "rgba(17, 17, 17, 0.16)",
}
const bylineFontSize = 30
const dateFontSize = 28
const imageBoxWidth = 420
const imageBoxHeight = shareCardHeight - cardPadding * 2
const columnGap = 64

export interface PostShareCardContent {
  title: string
  date: string
  byline: string
  imagePath?: string
}

function resolveThemeFont(filename: string) {
  return fileURLToPath(import.meta.resolve(`@ayingott/theme/fonts/${filename}`))
}

const themeFontFiles = {
  bricolage: resolveThemeFont(
    "bricolage-grotesque-latin-opsz-wght-normal.woff2",
  ),
  lxgwWenKaiMedium: resolveThemeFont("lxgw-wenkai-500-normal.woff2"),
  spaceMono: resolveThemeFont("space-mono-latin-400-normal.woff2"),
}

// satori 不支持 WOFF2，也不支持可变字体：按卡片用到的字子集化为 TrueType，并固定可变轴。
async function createCardFont(
  file: string,
  text: string,
  variationAxes?: Record<string, number>,
) {
  // 始终保留空格：没有任何字形的子集字符映射表为空，satori 会拒绝，例如全中文标题的 Bricolage 子集。
  return subsetFont(await readFile(file), ` ${text}`, {
    targetFormat: "truetype",
    variationAxes,
  })
}

async function readCardImage(imagePath: string) {
  const data = await readFile(imagePath)
  const { width, height, type } = imageSize(data)
  if (!width || !height || (type !== "png" && type !== "jpg")) {
    throw new Error(`分享卡片图片只支持 PNG 与 JPEG：${imagePath}`)
  }
  // 按比例缩放到图片区域内，不裁切。
  const scale = Math.min(imageBoxWidth / width, imageBoxHeight / height)
  const mimeType = type === "png" ? "image/png" : "image/jpeg"
  return {
    source: `data:${mimeType};base64,${data.toString("base64")}`,
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

export async function renderPostShareCard(content: PostShareCardContent) {
  const hasImage = content.imagePath !== undefined
  const titleFontSize = hasImage ? 56 : 68
  const titleLineClamp = hasImage ? 4 : 3
  // 标题超出行数时 satori 会追加省略号，子集中必须包含它。
  const titleGlyphs = `${content.title}…`
  const image = content.imagePath
    ? await readCardImage(content.imagePath)
    : undefined

  const fonts = [
    {
      name: "Bricolage Grotesque",
      weight: 400 as const,
      data: await createCardFont(themeFontFiles.bricolage, content.byline, {
        wght: 400,
        opsz: bylineFontSize,
      }),
    },
    {
      name: "Bricolage Grotesque Title",
      weight: 500 as const,
      data: await createCardFont(themeFontFiles.bricolage, titleGlyphs, {
        wght: 500,
        opsz: Math.min(titleFontSize, 96),
      }),
    },
    {
      name: "LXGW WenKai",
      weight: 500 as const,
      data: await createCardFont(
        themeFontFiles.lxgwWenKaiMedium,
        titleGlyphs + content.byline,
      ),
    },
    {
      name: "Space Mono",
      weight: 400 as const,
      data: await createCardFont(themeFontFiles.spaceMono, content.date),
    },
  ]

  const textColumn = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              fontFamily: "Bricolage Grotesque, LXGW WenKai",
              fontSize: bylineFontSize,
              color: cardColors.muted,
            },
            children: content.byline,
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flex: 1,
              alignItems: "center",
            },
            children: {
              type: "div",
              props: {
                style: {
                  width: "100%",
                  fontFamily: "Bricolage Grotesque Title, LXGW WenKai",
                  fontSize: titleFontSize,
                  fontWeight: 500,
                  lineHeight: 1.25,
                  color: cardColors.primary,
                  // satori 只为块级文本绘制省略号。
                  display: "block",
                  lineClamp: titleLineClamp,
                  textOverflow: "ellipsis",
                },
                children: content.title,
              },
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontFamily: "Space Mono",
              fontSize: dateFontSize,
              color: cardColors.muted,
            },
            children: content.date,
          },
        },
      ],
    },
  }

  const imageColumn = image && {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: imageBoxWidth,
      },
      children: {
        type: "img",
        props: {
          src: image.source,
          width: image.width,
          height: image.height,
          style: { border: `1px solid ${cardColors.imageBorder}` },
        },
      },
    },
  }

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          gap: columnGap,
          width: "100%",
          height: "100%",
          // satori 默认按 content-box 计算尺寸，内边距需算在卡片尺寸之内。
          boxSizing: "border-box",
          padding: cardPadding,
          backgroundColor: cardColors.canvas,
        },
        children: imageColumn ? [textColumn, imageColumn] : [textColumn],
      },
    },
    { width: shareCardWidth, height: shareCardHeight, fonts },
  )
  return new Resvg(svg, { fitTo: { mode: "width", value: shareCardWidth } })
    .render()
    .asPng()
}
