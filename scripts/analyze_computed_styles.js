import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const styles = JSON.parse(fs.readFileSync(path.join(__dirname, 'original_computed_styles.json'), 'utf-8'));

console.log("=================== ORIGINAL SITE COMPUTED STYLES ANALYSIS ===================");

styles.forEach((item, idx) => {
  if (
    item.className.includes('component') ||
    item.tag === 'IMG' ||
    item.className.includes('header') ||
    item.className.includes('gallery') ||
    item.tag === 'H1' ||
    item.tag === 'H2'
  ) {
    console.log(`\nItem ${idx}: <${item.tag}> class="${item.className}"`);
    console.log(`  Width: ${item.width} | Height: ${item.height} | MaxWidth: ${item.maxWidth} | MaxHeight: ${item.maxHeight}`);
    console.log(`  Padding: ${item.padding} | Margin: ${item.margin}`);
    if (item.fontSize) console.log(`  FontSize: ${item.fontSize} | FontFamily: ${item.fontFamily}`);
    if (item.src) console.log(`  SRC: ${item.src}`);
    if (item.text) console.log(`  Text: "${item.text.slice(0, 80)}"`);
  }
});
