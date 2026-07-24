import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync("scripts/live_rendered.html", "utf-8");
const $ = cheerio.load(html);

console.log("=== PAGE TITLE ===");
console.log($("title").text());

console.log("\n=== MAIN SECTIONS & COMPONENTS ===");
$("#app > *").each((i, el) => {
  console.log(`Child ${i}: <${el.tagName}> class="${$(el).attr("class")}" id="${$(el).attr("id")}"`);
});

console.log("\n=== MAIN CONTENT SECTIONS ===");
$("#main-content > *").each((i, el) => {
  console.log(`\nSection ${i}: <${el.tagName}> class="${$(el).attr("class")}" id="${$(el).attr("id")}"`);
  console.log("TEXT SAMPLE:", $(el).text().replace(/\s+/g, " ").trim().slice(0, 350));
});

console.log("\n=== ALL HEADINGS & TEXTS ===");
$("h1, h2, h3, .h1, .h2, .h3, button, a").each((i, el) => {
  const text = $(el).text().replace(/\s+/g, " ").trim();
  if (text) {
    console.log(`<${el.tagName} class="${$(el).attr("class")}">: ${text}`);
  }
});
