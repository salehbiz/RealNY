import fs from 'fs';

const css = fs.readFileSync("scripts/fullsite.css", "utf-8");

console.log("=== FULL-BLEED MEDIA CSS ===");
const fullBleed = css.match(/\.full-bleed-media-component[^{]*\{[^}]+\}/g) || [];
fullBleed.forEach(rule => console.log(rule));

console.log("\n=== SLIDING GALLERY CSS ===");
const gallery = css.match(/\.sliding-gallery-component[^{]*\{[^}]+\}/g) || [];
gallery.slice(0, 10).forEach(rule => console.log(rule));

console.log("\n=== MEDIA SIDE COPY CSS ===");
const sideCopy = css.match(/\.media-side-copy-component[^{]*\{[^}]+\}/g) || [];
sideCopy.slice(0, 10).forEach(rule => console.log(rule));

console.log("\n=== HERO VIDEO / MEDIA HEIGHTS ===");
const heights = css.match(/height:[^;}]+/g) || [];
console.log("Heights sample:", [...new Set(heights)].slice(0, 30));
