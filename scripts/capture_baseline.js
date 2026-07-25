import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = '/Users/apple/.gemini/antigravity-ide/brain/96c13b7d-ce15-453f-ba83-710fc2f5805e/scratch/baseline_images';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture(viewport, prefix) {
  console.log(`Starting capture for ${prefix} (${viewport.width}x${viewport.height})...`);
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport(viewport);

  // Go to local preview server
  await page.goto("http://127.0.0.1:5175/", { waitUntil: "networkidle2" });
  
  // Wait for the app and canvas to load
  await new Promise(r => setTimeout(r, 6000)); // wait for frames to load

  const frames = [1, 60, 120, 180];
  const scrollHeight = viewport.height * 2.5; // 350vh means 2.5 * viewport.height scrollable range

  for (const frame of frames) {
    const progress = (frame - 1) / 179;
    const scrollY = Math.round(progress * scrollHeight);
    
    console.log(`Setting scroll to ${scrollY} for frame ${frame}`);
    await page.evaluate((y) => {
      window.scrollTo(0, y);
    }, scrollY);
    
    // Wait for draw LERP to settle
    await new Promise(r => setTimeout(r, 800));

    const outPath = path.join(outDir, `${prefix}_frame_${frame}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot to ${outPath}`);
  }

  await browser.close();
}

async function run() {
  // Desktop
  await capture({ width: 1920, height: 1080 }, 'desktop');
  // Mobile
  await capture({ width: 375, height: 667, isMobile: true, hasTouch: true }, 'mobile');
  console.log("All baseline screenshots captured!");
}

run().catch(console.error);
