const svgNamespace = "http://www.w3.org/2000/svg"
const burstColors = [
  "var(--brutal-yellow)",
  "var(--brutal-pink)",
  "var(--brutal-blue)",
  "var(--brutal-green)",
  "var(--brutal-orange)",
  "var(--brutal-purple)",
]
const burstLineCount = 7
const burstDuration = 520

// Short strokes spring out around a control when it is clicked. The burst lives on <body>
// so it is not clipped by the control and outlives a click that opens a new tab.
export function burstAround(control: Element) {
  if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches)
    return

  const bounds = control.getBoundingClientRect()
  const burst = document.createElementNS(svgNamespace, "svg")
  burst.setAttribute("class", "doodle-burst")
  burst.setAttribute("viewBox", "0 0 56 56")
  burst.setAttribute("aria-hidden", "true")
  burst.style.left = `${bounds.left + bounds.width / 2}px`
  burst.style.top = `${bounds.top + bounds.height / 2}px`

  for (let index = 0; index < burstLineCount; index++) {
    const angle =
      (index / burstLineCount) * Math.PI * 2 + (index % 3) * 0.13 - 0.13
    const line = document.createElementNS(svgNamespace, "line")
    line.setAttribute("x1", String(28 + Math.cos(angle) * 14))
    line.setAttribute("y1", String(28 + Math.sin(angle) * 14))
    line.setAttribute("x2", String(28 + Math.cos(angle) * 27))
    line.setAttribute("y2", String(28 + Math.sin(angle) * 27))
    line.style.stroke = burstColors[index % burstColors.length]!
    burst.append(line)
  }

  document.body.append(burst)
  window.setTimeout(() => burst.remove(), burstDuration)
}
