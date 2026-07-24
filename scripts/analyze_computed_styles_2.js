import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const styles = JSON.parse(fs.readFileSync(path.join(__dirname, 'original_computed_styles.json'), 'utf-8'));

console.log("=================== FIRST 80 ITEMS COMPUTED STYLES ===================");

styles.slice(0, 80).forEach((item, idx) => {
  if (item.className || item.tag === 'IMG' || item.tag === 'HEADER' || item.tag === 'MAIN' || item.tag === 'SECTION') {
    console.log(`\nItem ${idx}: <${item.tag}> class="${item.className}" id="${item.id || ''}"`);
    console.log(`  Size: ${item.width} x ${item.height} | MaxWidth: ${item.maxWidth}`);
    console.log(`  Padding: ${item.padding} | Margin: ${item.margin}`);
    if (item.src) console.log(`  SRC: ${item.src}`);
    if (item.text) console.log(`  Text: "${item.text.replace(/\s+/g, ' ').slice(0, 70)}"`);
  }
});
