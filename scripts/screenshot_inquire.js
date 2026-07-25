import puppeteer from 'puppeteer-core';
import path from 'path';

const outPath = '/Users/apple/.gemini/antigravity-ide/brain/96c13b7d-ce15-453f-ba83-710fc2f5805e/scratch/inquire_contrast_test.png';

async function run() {
  console.log("Launching browser to capture inquiry section...");
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto("http://127.0.0.1:5175/", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2000));

  const element = await page.$('#inquire');
  if (element) {
    await element.screenshot({ path: outPath });
    console.log(`Saved screenshot to ${outPath}`);
  } else {
    console.error("Could not find element #inquire on page");
  }

  await browser.close();
}

run().catch(console.error);
