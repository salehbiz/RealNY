import { execSync } from 'child_process';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const scratchDir = '/Users/apple/.gemini/antigravity-ide/brain/96c13b7d-ce15-453f-ba83-710fc2f5805e/scratch';
const videoPath = '/Users/apple/Desktop/1.mp4';

const origFramePng = path.join(scratchDir, 'orig_frame_1.png');
const bakedFramePng = path.join(scratchDir, 'baked_frame_1.png');

async function main() {
  console.log('Step 1: Extracting original frame 1 (scaled to 1920x1080)...');
  execSync(`ffmpeg -y -i "${videoPath}" -vf "select=eq(n\\,0),scale=1920:1080" -vsync vfr -vcodec png "${origFramePng}"`);

  console.log('Step 2: Extracting graded/baked frame 1 (scaled first, then graded)...');
  const gradeChain = "scale=1920:1080,format=rgb24,lutrgb=r='clip(clip(val*1.16,0,255)*0.84+20.4,0,255)':g='clip(clip(val*1.16,0,255)*0.84+20.4,0,255)':b='clip(clip(val*1.16,0,255)*0.84+20.4,0,255)',colorchannelmixer=0.90556:0.0858:0.00864:0:0.02556:0.9658:0.00864:0:0.02556:0.0858:0.88864:0";
  execSync(`ffmpeg -y -i "${videoPath}" -vf "select=eq(n\\,0),${gradeChain}" -vsync vfr -vcodec png "${bakedFramePng}"`);

  console.log('Step 3: Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  
  const page = await browser.newPage();
  
  const origDataUri = `data:image/png;base64,${fs.readFileSync(origFramePng).toString('base64')}`;
  const bakedDataUri = `data:image/png;base64,${fs.readFileSync(bakedFramePng).toString('base64')}`;
  
  console.log('Step 4: Running pixel analysis in browser...');
  const result = await page.evaluate(async (origSrc, bakedSrc) => {
    const loadImage = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });

    const imgOrig = await loadImage(origSrc);
    const imgBaked = await loadImage(bakedSrc);

    const width = 1920;
    const height = 1080;

    const canvas1 = document.createElement('canvas');
    canvas1.width = width;
    canvas1.height = height;
    const ctx1 = canvas1.getContext('2d');
    ctx1.filter = 'brightness(1.16) contrast(0.84) saturate(0.88)';
    ctx1.drawImage(imgOrig, 0, 0, width, height);
    const data1 = ctx1.getImageData(0, 0, width, height).data;

    const canvas2 = document.createElement('canvas');
    canvas2.width = width;
    canvas2.height = height;
    const ctx2 = canvas2.getContext('2d');
    ctx2.drawImage(imgBaked, 0, 0, width, height);
    const data2 = ctx2.getImageData(0, 0, width, height).data;

    let diffCount = 0;
    let maxDelta = 0;
    let totalDelta = 0;
    
    const step = 4;
    let pixelCount = 0;

    for (let i = 0; i < data1.length; i += step) {
      pixelCount++;
      for (let c = 0; c < 3; c++) {
        const val1 = data1[i + c];
        const val2 = data2[i + c];
        const delta = Math.abs(val1 - val2);
        
        totalDelta += delta;
        if (delta > maxDelta) {
          maxDelta = delta;
        }
        if (delta > 2) {
          diffCount++;
        }
      }
    }

    const avgDelta = totalDelta / (pixelCount * 3);
    const diffPct = (diffCount / (pixelCount * 3)) * 100;

    return {
      maxDelta,
      avgDelta,
      diffCount,
      diffPct,
      totalChannelsTested: pixelCount * 3
    };
  }, origDataUri, bakedDataUri);

  console.log('\n--- Pixel Diff Results ---');
  console.log(`Max per-channel delta: ${result.maxDelta}/255`);
  console.log(`Average per-channel delta: ${result.avgDelta.toFixed(4)}/255`);
  console.log(`Channels with delta > 2: ${result.diffCount} (${result.diffPct.toFixed(2)}%)`);
  
  if (result.maxDelta <= 2) {
    console.log('\nSUCCESS: Pixel difference satisfies delta <= 2/255!');
  } else {
    console.log(`\nWARNING: Max delta (${result.maxDelta}) exceeds threshold 2/255.`);
  }

  await browser.close();
}

main().catch(console.error);
