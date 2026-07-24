import https from 'https';
import fs from 'fs';

https.get("https://themorgannyc.com/css/fullsite.css", (res) => {
  let css = "";
  res.on("data", chunk => css += chunk);
  res.on("end", () => {
    fs.writeFileSync("scripts/fullsite.css", css);
    console.log("Saved fullsite.css, length:", css.length);

    // Extract font-family rules
    const fontFamilies = css.match(/font-family:[^;}]+/g) || [];
    console.log("Font families used:", [...new Set(fontFamilies)]);

    // Extract color rules
    const colors = css.match(/(color|background-color):[^;}]+/g) || [];
    const cleanColors = [...new Set(colors)].filter(c => !c.includes('transparent') && !c.includes('inherit'));
    console.log("Colors sample:", cleanColors.slice(0, 30));
  });
});
