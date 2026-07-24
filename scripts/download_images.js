import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  "amenities-courtyard-day.jpg",
  "amenities-courtyard-night.jpg",
  "amenities-coworking.jpg",
  "amenities-dinner-party-overhead.jpg",
  "amenities-dog.jpg",
  "amenities-laptop.jpg",
  "amenities-lobby.jpg",
  "amenities-lounge.jpg",
  "amenities-party-room.jpg",
  "amenities-sauna.jpg",
  "amenities-yoga-room.jpg",
  "amenities-yoga.jpg",
  "building-entrance.jpg",
  "building-green-tree.jpg",
  "building-hero.jpg",
  "building-lobby.jpg",
  "building-rooftop-angle.jpg",
  "building-tree-and-bear.jpg",
  "building-upper-exterior.jpg",
  "gallery-header.jpg",
  "neighborhood-bear-sculpture.jpg",
  "neighborhood-bryant-park-blossoms.jpg",
  "neighborhood-bryant-park-couple.jpg",
  "neighborhood-bryant-park-lawn-evening.jpg",
  "neighborhood-bryant-park-lawn.jpg",
  "neighborhood-bryant-park-ny-library-side.jpg",
  "neighborhood-bryant-park-ny-library.jpg",
  "neighborhood-bryant-park-statue.jpg",
  "neighborhood-building-sculpture.jpg",
  "neighborhood-eataly.jpg",
  "neighborhood-empire-state-building.jpg",
  "neighborhood-fountain.jpg",
  "neighborhood-madison-square-cityscape.jpg",
  "neighborhood-madison-square-live-entertainment.jpg",
  "neighborhood-madison-square-skateboard.jpg",
  "neighborhood-madison-square-tree.jpg",
  "neighborhood-madison-square-walking-dog.jpg",
  "neighborhood-museum-ceiling.jpg",
  "neighborhood-nomad-dining.jpg",
  "neighborhood-nomad-flowers.jpg",
  "neighborhood-nomad-sidewalk.jpg",
  "neighborhood-nomad-social.jpg",
  "neighborhood-nomad-the-ned.jpg",
  "neighborhood-park-and-madison-facade.jpg",
  "neighborhood-park-and-madison-food.jpg",
  "neighborhood-park-and-madison-grand-central.jpg",
  "neighborhood-park-and-madison-morgan-museum.jpg",
  "neighborhood-park-and-madison-sculpture.jpg",
  "neighborhood-tree-obscuring-city.jpg",
  "neighborhood-white-flower-branches.jpg",
  "residences-duplex-and-penthouse-exterior.jpg",
  "residences-exterior-detail.jpg",
  "residences-kitchen.jpg",
  "residences-living-room-cropped.jpg",
  "residences-living-room.jpg",
  "residences-powder-room.jpg",
  "residences-primary-bathroom.jpg",
  "residences-upper-levels-exterior.jpg",
  "team-aksoy-holding.jpg",
  "team-continuum-company.jpg",
  "team-header.jpg"
];

const targetDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function download(filename) {
  const url = `https://themorgannyc.com/uploads/content/images/${filename}`;
  const filePath = path.join(targetDir, filename);

  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      console.log(`Already exists: ${filename}`);
      return resolve();
    }
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
          console.log(`Downloaded: ${filename}`);
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
  console.log(`Starting download of ${images.length} images...`);
  for (const img of images) {
    await download(img);
  }
  console.log('Done downloading images.');
}

run();
