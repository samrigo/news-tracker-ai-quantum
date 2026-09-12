import { copyFileSync, cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * GitHub Pages is static. TanStack Start SPA output lands in dist/client
 * (sometimes dist). Flatten into dist/pages with 404.html + .nojekyll so
 * deep links and __grok assets survive Jekyll.
 */
const source = existsSync(join("dist", "client", "index.html"))
  ? join("dist", "client")
  : existsSync(join("dist", "index.html"))
    ? "dist"
    : null;

if (!source) {
  console.error("[pages] expected dist/client/index.html or dist/index.html after build");
  process.exit(1);
}

const out = join("dist", "pages");
mkdirSync(out, { recursive: true });
if (source !== out) {
  cpSync(source, out, { recursive: true, filter: (src) => !src.endsWith("/pages") });
}

const index = join(out, "index.html");
if (existsSync(index)) {
  copyFileSync(index, join(out, "404.html"));
}

writeFileSync(join(out, ".nojekyll"), "");

const cname = process.env.PAGES_CNAME?.trim();
if (cname) {
  writeFileSync(join(out, "CNAME"), `${cname}\n`);
}

console.log(`[pages] prepared ${out} for GitHub Pages${cname ? ` (${cname})` : ""}`);
