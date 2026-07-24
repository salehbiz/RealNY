import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assets = [
  "/img/logo-text.svg",
  "/img/logo-mark.svg?version=2",
  "/img/logo-white.svg",
  "/img/logo-black.svg?version=1",
  "/img/eho.svg",
  "/img/continuum-logo.webp",
  "/img/corcoran-logo.webp",
  "/img/aksoy-holdıng-logo.svg?version=1"
];

const targetDir = path.join(__dirname, '../public/img');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function download(assetPath) {
  const url = `https://themorgannyc.com${assetPath}`;
  const filename = path.basename(assetPath.split('?')[0]);
  const filePath = path.join(targetDir, filename);

  return new Promise((resolve) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed ${filename}: status ${response.statusCode}`);
        file.close();
        fs.unlinkSync(filePath);
        return resolve();
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded logo asset: ${filename}`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.error(`Error ${filename}: ${err.message}`);
      resolve();
    });
  });
}

async function run() {
  console.log("Downloading authentic logo assets...");
  for (const a of assets) {
    await download(a);
  }
  console.log("All logo assets downloaded successfully.");
}

run();
