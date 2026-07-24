import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotDir = path.join(__dirname, 'original_screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function run() {
  console.log("Launching Chrome to inspect original site https://themorgannyc.com/ ...");
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1837, height: 1046 });

  await page.goto("https://themorgannyc.com/", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 4000));

  // Take screenshot of hero
  await page.screenshot({ path: path.join(screenshotDir, '01_original_hero.png') });

  // Scroll down section by section and take screenshots
  for (let i = 1; i <= 8; i++) {
    await page.evaluate(() => window.scrollBy(0, 900));
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, `0${i + 1}_original_scroll_${i}.png`) });
  }

  // Extract computed styles of all images, sections, containers, titles
  const styles = await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('section, header, footer, div[class*="component"], img, h1, h2, h3, p');
    elements.forEach(el => {
      const cs = window.getComputedStyle(el);
      results.push({
        tag: el.tagName,
        className: el.className,
        width: cs.width,
        height: cs.height,
        padding: cs.padding,
        margin: cs.margin,
        maxWidth: cs.maxWidth,
        maxHeight: cs.maxHeight,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        text: el.innerText ? el.innerText.trim().slice(0, 100) : '',
        src: el.src || ''
      });
    });
    return results;
  });

  fs.writeFileSync(path.join(__dirname, 'original_computed_styles.json'), JSON.stringify(styles, null, 2));
  console.log("Captured original screenshots & computed styles!");

  await browser.close();
}

run().catch(console.error);
