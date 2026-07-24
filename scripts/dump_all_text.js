import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync("scripts/live_rendered.html", "utf-8");
const $ = cheerio.load(html);

console.log("=================== FULL LIVE HOMEPAGE STRUCTURE DUMP ===================");

// Find all main components inside content-page-component
$(".content-page-component > *").each((idx, section) => {
  console.log(`\n--- SECTION ${idx + 1}: ${$(section).attr("class")} ---`);
  
  $(section).find("h1, h2, h3, h4, p, a, button, img").each((_, el) => {
    const tagName = el.tagName.toUpperCase();
    const className = $(el).attr("class") || "";
    const text = $(el).text().replace(/\s+/g, " ").trim();
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    
    if (tagName === "IMG") {
      console.log(`  [IMG] src="${src}" alt="${$(el).attr("alt")}"`);
    } else if (text && text.length < 500) {
      console.log(`  [${tagName}] (${className}): "${text}"`);
    }
  });
});

console.log("\n=================== NAVBAR DETAILS ===================");
$(".navbar-component").find("a, button, span").each((_, el) => {
  const text = $(el).text().replace(/\s+/g, " ").trim();
  if (text) console.log(`  [${el.tagName}] (${$(el).attr("class")}): "${text}"`);
});

console.log("\n=================== FOOTER DETAILS ===================");
$(".footer-component").find("a, p, span, h1, h2").each((_, el) => {
  const text = $(el).text().replace(/\s+/g, " ").trim();
  if (text) console.log(`  [${el.tagName}] (${$(el).attr("class")}): "${text}"`);
});
