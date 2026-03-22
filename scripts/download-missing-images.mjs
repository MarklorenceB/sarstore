/**
 * Download missing product images from Pexels API
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const API_KEY = process.env.PEXELS_API_KEY;

if (!API_KEY) {
  console.error('Missing PEXELS_API_KEY');
  process.exit(1);
}

// Only NEW images that don't already exist
const IMAGES_TO_DOWNLOAD = {
  'bacon.jpg': 'bacon strips raw',
  'baked-beans.jpg': 'baked beans can',
  'bathroom-cleaner.jpg': 'bathroom cleaner spray bottle',
  'bbq-chips.jpg': 'bbq potato chips bag',
  'beef-loaf.jpg': 'canned meat loaf',
  'brown-rice.jpg': 'brown rice grains',
  'century-eggs.jpg': 'century egg preserved',
  'cheese-chips.jpg': 'cheese flavored chips snack',
  'chicken-popcorn.jpg': 'chicken popcorn bites fried',
  'chicken-spread.jpg': 'chicken spread sandwich',
  'chicken-tenders.jpg': 'chicken tenders breaded',
  'coconut-cream.jpg': 'coconut cream can',
  'coconut-milk.jpg': 'coconut milk can',
  'coconut-oil.jpg': 'coconut oil jar',
  'corn-chips.jpg': 'corn chips tortilla',
  'cream-o.jpg': 'cream filled cookies sandwich',
  'detergent-bar.jpg': 'laundry bar soap',
  'disinfectant-spray.jpg': 'disinfectant spray aerosol',
  'fish-balls.jpg': 'fish balls street food',
  'floor-cleaner.jpg': 'floor cleaner mopping liquid',
  'gatorade.jpg': 'sports drink bottle gatorade',
  'glass-cleaner.jpg': 'glass window cleaner spray',
  'ham.jpg': 'sliced ham deli meat',
  'honey.jpg': 'honey jar golden',
  'kikiam.jpg': 'kikiam fried spring roll filipino',
  'liquid-detergent.jpg': 'liquid laundry detergent bottle',
  'meat-loaf.jpg': 'meatloaf canned',
  'mountain-dew.jpg': 'mountain dew soda bottle green',
  'nutella.jpg': 'chocolate hazelnut spread jar',
  'olive-oil.jpg': 'olive oil bottle',
  'paper-towel.jpg': 'paper towel roll kitchen',
  'peanut-butter.jpg': 'peanut butter jar',
  'pepsi.jpg': 'pepsi cola bottle soda',
  'piattos.jpg': 'potato chips crispy round',
  'pineapple-juice.jpg': 'pineapple juice carton',
  'pocari-sweat.jpg': 'sports drink bottle blue',
  'popcorn.jpg': 'popcorn kernels bowl',
  'pork-and-beans.jpg': 'pork and beans canned',
  'pretzels.jpg': 'pretzels snack salty',
  'quail-eggs.jpg': 'quail eggs small spotted',
  'salted-eggs.jpg': 'salted duck eggs red',
  'sesame-oil.jpg': 'sesame oil bottle asian',
  'soy-milk.jpg': 'soy milk carton',
  'sponge.jpg': 'kitchen sponge cleaning',
  'squid-balls.jpg': 'squid balls fried street food',
  'steel-wool.jpg': 'steel wool cleaning pad',
  'strawberry-jam.jpg': 'strawberry jam jar',
  'wafer-sticks.jpg': 'wafer sticks chocolate snack',
  'wet-wipes.jpg': 'wet wipes pack baby',
  'yakult.jpg': 'yakult probiotic drink bottles',
};

function searchPexels(query) {
  return new Promise((resolve, reject) => {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
    https.get(url, { headers: { Authorization: API_KEY } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.photos && json.photos.length > 0) {
            resolve(json.photos[0].src.medium);
          } else {
            reject(new Error(`No results for: ${query}`));
          }
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const entries = Object.entries(IMAGES_TO_DOWNLOAD);
  let downloaded = 0, skipped = 0, failed = 0;

  console.log(`\n🖼️  Downloading ${entries.length} missing product images...\n`);

  for (const [filename, query] of entries) {
    const filepath = path.join(OUTPUT_DIR, filename);
    if (fs.existsSync(filepath)) { skipped++; continue; }

    try {
      process.stdout.write(`  ⬇️  ${filename} ... `);
      const imageUrl = await searchPexels(query);
      await downloadFile(imageUrl, filepath);
      downloaded++;
      console.log('✅');
      await sleep(350);
    } catch (err) {
      failed++;
      console.log(`❌ ${err.message}`);
    }
  }

  console.log(`\n📊 Results: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
  console.log(`📁 Images saved to: ${OUTPUT_DIR}\n`);
}

main().catch(console.error);
