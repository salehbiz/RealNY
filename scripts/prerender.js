import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const routes = [
  { path: '/', file: 'index.html' },
  { path: '/residences', file: 'residences/index.html' },
  { path: '/amenities', file: 'amenities/index.html' }
];

const distDir = path.resolve('dist');
const port = 5175; // Port where preview server is currently running

async function prerender() {
  console.log('Starting prerendering crawler...');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  for (const route of routes) {
    console.log(`Prerendering route: ${route.path}`);
    const page = await browser.newPage();
    
    // Inject __PRERENDER__ flag before any scripts load
    await page.evaluateOnNewDocument(() => {
      window.__PRERENDER__ = true;
    });

    const url = `http://127.0.0.1:${port}${route.path}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait slightly for any React initialization
    await new Promise(r => setTimeout(r, 2000));

    // Get rendered HTML content
    const html = await page.content();

    // Determine target path
    const destPath = path.join(distDir, route.file);
    const destFolder = path.dirname(destPath);
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    fs.writeFileSync(destPath, html, 'utf8');
    console.log(`Saved prerendered HTML to: ${destPath}`);
    await page.close();
  }

  await browser.close();
  console.log('Prerendering completed!');
}

prerender().catch(console.error);
