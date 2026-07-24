import fs from 'fs';

const css = fs.readFileSync("scripts/fullsite.css", "utf-8");

console.log("=== MEDIA COMPONENT RULES ===");
const mediaRules = css.match(/\.(media-type-component|sliding-gallery-component|media-side-copy-component)[^{]*\{[^}]+\}/g) || [];
mediaRules.forEach(rule => console.log(rule));

console.log("\n=== ASPECT RATIO RULES ===");
const aspectRatios = css.match(/aspect-ratio:[^;}]+/g) || [];
console.log([...new Set(aspectRatios)]);
