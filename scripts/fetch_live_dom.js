import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function fetchDOM() {
  console.log("Launching system Google Chrome to inspect https://themorgannyc.com/ ...");
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto("https://themorgannyc.com/", { waitUntil: "networkidle2" });

  // Give Vue app time to mount and render fully
  await new Promise(r => setTimeout(r, 3000));

  const html = await page.content();
  fs.writeFileSync("scripts/live_rendered.html", html);
  console.log("Saved live rendered HTML, length:", html.length);

  // Extract all section details, text content, CSS classes, images, structural components
  const pageStructure = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section, header, footer, div[class*="component"], div[class*="section"]'))
      .map(sec => ({
        tag: sec.tagName,
        className: sec.className,
        id: sec.id,
        text: sec.innerText.trim().slice(0, 300),
      }));

    const textBlocks = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, p, button, a, span'))
      .map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.innerText.trim(),
      }))
      .filter(item => item.text.length > 0);

    const images = Array.from(document.querySelectorAll('img, svg'))
      .map(img => ({
        tag: img.tagName,
        src: img.src || img.getAttribute('href') || '',
        alt: img.alt || '',
        className: img.className
      }));

    return { sections, textBlocks, images };
  });

  fs.writeFileSync("scripts/live_page_structure.json", JSON.stringify(pageStructure, null, 2));
  console.log("Saved page structure. Found text blocks:", pageStructure.textBlocks.length);

  await browser.close();
}

fetchDOM().catch(err => {
  console.error("Puppeteer-core error:", err);
});
