/**
 * Download product images from Pexels API
 *
 * Usage:
 *   1. Get a free API key at https://www.pexels.com/api/new/ (takes 30 seconds)
 *   2. Run: PEXELS_API_KEY=your_key_here node scripts/download-product-images.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

const API_KEY = process.env.PEXELS_API_KEY;

if (!API_KEY) {
  console.error('\n❌ Missing PEXELS_API_KEY environment variable!');
  console.error('\nTo get a free API key:');
  console.error('  1. Go to https://www.pexels.com/api/new/');
  console.error('  2. Sign up and get your key');
  console.error('  3. Run: PEXELS_API_KEY=your_key node scripts/download-product-images.mjs\n');
  process.exit(1);
}

// Map of filename -> search query for Pexels
const IMAGES_TO_DOWNLOAD = {
  // COOKING ESSENTIALS
  'cooking-oil.jpg': 'cooking oil bottle',
  'rice.jpg': 'jasmine rice grains bowl',
  'sugar.jpg': 'white sugar bowl',
  'brown-sugar.jpg': 'brown sugar',
  'salt.jpg': 'salt shaker table',
  'flour.jpg': 'wheat flour bag',
  'cornstarch.jpg': 'cornstarch powder',
  'garlic.jpg': 'fresh garlic cloves',
  'onion.jpg': 'fresh onion vegetable',
  'ginger.jpg': 'fresh ginger root',

  // EGGS & DAIRY
  'eggs.jpg': 'fresh eggs carton',
  'milk.jpg': 'fresh milk bottle glass',
  'butter.jpg': 'butter block',
  'margarine.jpg': 'margarine spread',
  'cheese.jpg': 'cheese slices',
  'yogurt.jpg': 'yogurt cup fruit',
  'evaporated-milk.jpg': 'evaporated milk can',
  'condensed-milk.jpg': 'condensed milk can',

  // MEAT & POULTRY
  'pork-belly.jpg': 'raw pork belly meat',
  'chicken.jpg': 'whole raw chicken',
  'chicken-breast.jpg': 'raw chicken breast',
  'ground-beef.jpg': 'ground beef meat',
  'beef.jpg': 'beef cubes stew meat',
  'pork-chop.jpg': 'raw pork chop',
  'chicken-wings.jpg': 'raw chicken wings',
  'chicken-drumstick.jpg': 'chicken drumstick raw',
  'pork.jpg': 'raw pork meat',
  'tocino.jpg': 'marinated pork tocino filipino',
  'longganisa.jpg': 'sausage links raw',

  // CANNED & PACKAGED
  'corned-beef.jpg': 'corned beef can',
  'sardines.jpg': 'canned sardines fish',
  'noodles.jpg': 'instant noodles packet',
  'tuna.jpg': 'canned tuna fish',
  'spam.jpg': 'canned meat luncheon',
  'maling.jpg': 'canned pork meat',
  'liver-spread.jpg': 'liver pate spread',
  'tomato-sauce.jpg': 'tomato sauce can',
  'pasta.jpg': 'spaghetti pasta dry',

  // FROZEN FOODS
  'hotdog.jpg': 'hotdog sausages pack',
  'nuggets.jpg': 'chicken nuggets frozen',
  'fish-fillet.jpg': 'fish fillet raw',
  'bangus.jpg': 'milkfish bangus raw',
  'siomai.jpg': 'dumplings siomai dim sum',
  'ice-cream.jpg': 'ice cream tub',
  'ice-cream-sandwich.jpg': 'ice cream sandwich dessert',

  // BAKERY & SNACKS
  'pandesal.jpg': 'bread rolls fresh baked',
  'bread.jpg': 'sliced bread loaf',
  'chips.jpg': 'potato chips snack',
  'cookies.jpg': 'cookies biscuits plate',
  'oreo.jpg': 'chocolate sandwich cookies',
  'crackers.jpg': 'crackers biscuits snack',
  'chocolate.jpg': 'chocolate bar candy',
  'ensaymada.jpg': 'sweet bread pastry cheese',

  // BEVERAGES
  'coke.jpg': 'coca cola bottle soda',
  'sprite.jpg': 'sprite lemon lime soda bottle',
  'royal.jpg': 'orange soda bottle',
  'coffee.jpg': 'instant coffee packet',
  'orange-juice.jpg': 'orange juice carton',
  'apple-juice.jpg': 'apple juice bottle',
  'water.jpg': 'water bottles pack',
  'iced-tea.jpg': 'iced tea bottle',
  'powdered-juice.jpg': 'powdered juice drink mix',

  // CONDIMENTS & SAUCES
  'soy-sauce.jpg': 'soy sauce bottle',
  'vinegar.jpg': 'vinegar bottle',
  'fish-sauce.jpg': 'fish sauce bottle asian',
  'ketchup.jpg': 'ketchup bottle',
  'mayonnaise.jpg': 'mayonnaise jar',
  'oyster-sauce.jpg': 'oyster sauce bottle',
  'hot-sauce.jpg': 'hot sauce chili bottle',
  'banana-ketchup.jpg': 'banana ketchup sauce red',

  // HOUSEHOLD ESSENTIALS
  'dish-soap.jpg': 'dish soap liquid bottle',
  'detergent.jpg': 'laundry detergent powder',
  'fabric-conditioner.jpg': 'fabric softener bottle',
  'toilet-paper.jpg': 'toilet paper rolls',
  'garbage-bags.jpg': 'garbage bags trash bags roll',
  'cleaner.jpg': 'all purpose cleaner spray',
  'bleach.jpg': 'bleach bottle cleaning',
  'alcohol.jpg': 'rubbing alcohol bottle',
  'hand-soap.jpg': 'hand soap dispenser',
};

function searchPexels(query) {
  return new Promise((resolve, reject) => {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
    const options = {
      headers: { Authorization: API_KEY },
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.photos && json.photos.length > 0) {
            // Get medium-sized image (good for product cards)
            resolve(json.photos[0].src.medium);
          } else {
            reject(new Error(`No results for: ${query}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const entries = Object.entries(IMAGES_TO_DOWNLOAD);
  const total = entries.length;
  let downloaded = 0;
  let failed = 0;

  console.log(`\n🖼️  Downloading ${total} product images from Pexels...\n`);

  for (const [filename, query] of entries) {
    const filepath = path.join(OUTPUT_DIR, filename);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`  ⏭️  ${filename} (already exists)`);
      downloaded++;
      continue;
    }

    try {
      process.stdout.write(`  ⬇️  ${filename} ... `);
      const imageUrl = await searchPexels(query);
      await downloadFile(imageUrl, filepath);
      downloaded++;
      console.log('✅');

      // Rate limit: Pexels allows 200 req/hour, so ~300ms between requests is safe
      await sleep(350);
    } catch (err) {
      failed++;
      console.log(`❌ ${err.message}`);
    }
  }

  console.log(`\n📊 Results: ${downloaded} downloaded, ${failed} failed out of ${total} total`);
  console.log(`📁 Images saved to: ${OUTPUT_DIR}\n`);
}

main().catch(console.error);
