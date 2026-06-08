import { execFileSync } from "node:child_process"
import process from "node:process"

const expected = "2026/05/25"
const zones = ["UTC", "Asia/Shanghai"]

for (const zone of zones) {
  const output = execFileSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--input-type=module",
      "-e",
      "const { formatBlogDate } = await import('./app/utils/blog.ts'); console.log(formatBlogDate('2026-05-25'))",
    ],
    {
      cwd: new URL("..", import.meta.url),
      env: { ...process.env, TZ: zone },
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
    },
  ).trim()

  if (output !== expected) {
    throw new Error(
      `formatBlogDate mismatch for TZ=${zone}: got ${output}, expected ${expected}`,
    )
  }

  console.log(`TZ=${zone} ${output}`)
}
