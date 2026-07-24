import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync("scripts/live_rendered.html", "utf-8");
const $ = cheerio.load(html);

console.log("=== LOGO SVGs ===");
$("svg").each((i, el) => {
  console.log(`SVG ${i} class="${$(el).attr("class")}": ${$.html(el).slice(0, 300)}...\n`);
});

console.log("=== ALL IMAGES & VIDEOS ===");
$("img, video, source").each((i, el) => {
  console.log(`${el.tagName}: src="${$(el).attr("src") || $(el).attr("data-src")}" alt="${$(el).attr("alt")}" class="${$(el).attr("class")}"`);
});

console.log("=== EXACT HEADINGS ===");
$("h1, h2, h3").each((i, el) => {
  console.log(`${el.tagName} class="${$(el).attr("class")}"> ${$(el).html()}`);
});
