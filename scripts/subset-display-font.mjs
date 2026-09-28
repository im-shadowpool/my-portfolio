// Rebuilds the subset of Shippori Mincho in app/fonts/: basic Latin plus every
// other character used anywhere in the site's source and data. Run it after
// adding new Japanese text:  node scripts/subset-display-font.mjs
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "data", "lib", "context"];
const WEIGHTS = [400, 500, 600];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(tsx?|json)$/.test(name)) files.push(path);
  }
};
ROOTS.forEach(walk);

// Everything outside plain ASCII, minus emoji (those come from the system font).
const extra = new Set();
for (const file of files) {
  for (const ch of readFileSync(file, "utf8")) {
    const c = ch.codePointAt(0);
    const emoji = c >= 0x1f000 || (c >= 0x2600 && c <= 0x27bf) || c === 0xfe0f || c === 0x200d;
    if (c > 126 && !emoji) extra.add(ch);
  }
}
let ascii = "";
for (let c = 32; c < 127; c++) ascii += String.fromCharCode(c);
const text = encodeURIComponent(ascii + [...extra].sort().join(""));

for (const weight of WEIGHTS) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@${weight}&display=swap&text=${text}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
    })
  ).text();
  const urls = [...css.matchAll(/url\((.+?)\)/g)].map((m) => m[1]);
  if (urls.length !== 1) throw new Error(`Expected one font file for weight ${weight}, got ${urls.length}`);
  const font = Buffer.from(await (await fetch(urls[0])).arrayBuffer());
  writeFileSync(`app/fonts/shippori-mincho-${weight}.woff2`, font);
  console.log(`weight ${weight}: ${font.length} bytes`);
}
console.log(`${extra.size} non-ASCII characters included: ${[...extra].sort().join("")}`);
