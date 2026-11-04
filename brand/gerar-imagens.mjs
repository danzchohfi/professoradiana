// Gera public/og.png, public/og-en.png, public/favicon.png e
// public/apple-touch-icon.png a partir de brand/imagens.html.
// Uso (precisa do Playwright com Chromium): node brand/gerar-imagens.mjs
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

// require (e não import) para achar um Playwright instalado globalmente.
const { chromium } = createRequire(import.meta.url)("playwright");
const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, "..", "public");
const page0 = `file://${path.join(here, "imagens.html")}`;

const browser = await chromium.launch();
for (const [lang, file] of [["pt", "og.png"], ["en", "og-en.png"]]) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });
  await page.goto(`${page0}?lang=${lang}`);
  await page.waitForSelector("body[data-ready]");
  await page.locator("#og").screenshot({ path: path.join(pub, file) });
  if (lang === "pt") {
    for (const [size, name] of [[180, "apple-touch-icon.png"], [64, "favicon.png"]]) {
      const p2 = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: size / 512 });
      await p2.goto(`${page0}?lang=pt`);
      await p2.waitForSelector("body[data-ready]");
      await p2.locator("#icon").screenshot({ path: path.join(pub, name) });
      await p2.close();
    }
  }
  await page.close();
}
await browser.close();
console.log("imagens geradas em public/");
