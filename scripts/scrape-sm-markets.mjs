/**
 * Scrape product images from smmarkets.ph
 *
 * Usage: node scripts/scrape-sm-markets.mjs
 *
 * Requires: playwright (npx playwright install chromium)
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Map: local filename -> search query on SM Markets
const PRODUCT_SEARCHES = {
  // COOKING ESSENTIALS
  'cooking-oil.jpg': 'cooking oil',
  'rice.jpg': 'jasmine rice',
  'sugar.jpg': 'white sugar',
  'brown-sugar.jpg': 'brown sugar',
  'salt.jpg': 'iodized salt',
  'flour.jpg': 'all purpose flour',
  'cornstarch.jpg': 'cornstarch',
  'garlic.jpg': 'garlic',
  'onion.jpg': 'onion',
  'ginger.jpg': 'ginger',

  // EGGS & DAIRY
  'eggs.jpg': 'fresh eggs',
  'milk.jpg': 'fresh milk',
  'butter.jpg': 'butter',
  'margarine.jpg': 'margarine',
  'cheese.jpg': 'cheese slices',
  'yogurt.jpg': 'yogurt',
  'evaporated-milk.jpg': 'evaporated milk',
  'condensed-milk.jpg': 'condensed milk',

  // MEAT & POULTRY
  'pork-belly.jpg': 'pork belly',
  'chicken.jpg': 'whole chicken',
  'chicken-breast.jpg': 'chicken breast',
  'ground-beef.jpg': 'ground beef',
  'beef.jpg': 'beef cubes',
  'pork-chop.jpg': 'pork chop',
  'chicken-wings.jpg': 'chicken wings',
  'chicken-drumstick.jpg': 'chicken drumstick',
  'pork.jpg': 'pork kasim',
  'tocino.jpg': 'tocino',
  'longganisa.jpg': 'longganisa',

  // CANNED & PACKAGED
  'corned-beef.jpg': 'corned beef',
  'sardines.jpg': 'sardines',
  'noodles.jpg': 'instant noodles lucky me',
  'tuna.jpg': 'tuna flakes',
  'spam.jpg': 'spam luncheon meat',
  'maling.jpg': 'maling luncheon meat',
  'liver-spread.jpg': 'liver spread',
  'tomato-sauce.jpg': 'tomato sauce',
  'pasta.jpg': 'spaghetti pasta',

  // FROZEN FOODS
  'hotdog.jpg': 'hotdog',
  'nuggets.jpg': 'chicken nuggets',
  'fish-fillet.jpg': 'fish fillet',
  'bangus.jpg': 'bangus milkfish',
  'siomai.jpg': 'siomai',
  'ice-cream.jpg': 'ice cream',
  'ice-cream-sandwich.jpg': 'ice cream sandwich',

  // BAKERY & SNACKS
  'pandesal.jpg': 'pandesal',
  'bread.jpg': 'sliced bread',
  'chips.jpg': 'potato chips',
  'cookies.jpg': 'cookies',
  'oreo.jpg': 'oreo',
  'crackers.jpg': 'crackers skyflakes',
  'chocolate.jpg': 'chocolate bar',
  'ensaymada.jpg': 'ensaymada',

  // BEVERAGES
  'coke.jpg': 'coca cola',
  'sprite.jpg': 'sprite',
  'royal.jpg': 'royal orange',
  'coffee.jpg': 'nescafe 3in1',
  'orange-juice.jpg': 'orange juice',
  'apple-juice.jpg': 'apple juice',
  'water.jpg': 'bottled water',
  'iced-tea.jpg': 'iced tea',
  'powdered-juice.jpg': 'tang juice powder',

  // CONDIMENTS & SAUCES
  'soy-sauce.jpg': 'soy sauce',
  'vinegar.jpg': 'vinegar',
  'fish-sauce.jpg': 'fish sauce patis',
  'ketchup.jpg': 'ketchup',
  'mayonnaise.jpg': 'mayonnaise',
  'oyster-sauce.jpg': 'oyster sauce',
  'hot-sauce.jpg': 'hot sauce',
  'banana-ketchup.jpg': 'banana ketchup',

  // HOUSEHOLD ESSENTIALS
  'dish-soap.jpg': 'dishwashing liquid',
  'detergent.jpg': 'laundry detergent powder',
  'fabric-conditioner.jpg': 'fabric conditioner downy',
  'toilet-paper.jpg': 'tissue paper',
  'garbage-bags.jpg': 'garbage bag',
  'cleaner.jpg': 'all purpose cleaner',
  'bleach.jpg': 'bleach',
  'alcohol.jpg': 'rubbing alcohol',
  'hand-soap.jpg': 'hand soap',

  // ADDITIONAL PRODUCTS
  'bacon.jpg': 'bacon',
  'baked-beans.jpg': 'baked beans',
  'bathroom-cleaner.jpg': 'bathroom cleaner',
  'bbq-chips.jpg': 'bbq chips',
  'beef-loaf.jpg': 'beef loaf',
  'brown-rice.jpg': 'brown rice',
  'century-eggs.jpg': 'century egg',
  'cheese-chips.jpg': 'cheese chips',
  'chicken-popcorn.jpg': 'chicken popcorn',
  'chicken-spread.jpg': 'chicken spread',
  'chicken-tenders.jpg': 'chicken tenders',
  'coconut-cream.jpg': 'coconut cream',
  'coconut-milk.jpg': 'coconut milk',
  'coconut-oil.jpg': 'coconut oil',
  'corn-chips.jpg': 'corn chips',
  'cream-o.jpg': 'cream o cookies',
  'detergent-bar.jpg': 'detergent bar',
  'disinfectant-spray.jpg': 'disinfectant spray lysol',
  'fish-balls.jpg': 'fish ball',
  'floor-cleaner.jpg': 'floor cleaner',
  'gatorade.jpg': 'gatorade',
  'glass-cleaner.jpg': 'glass cleaner',
  'ham.jpg': 'ham',
  'honey.jpg': 'honey',
  'kikiam.jpg': 'kikiam',
  'liquid-detergent.jpg': 'liquid detergent',
  'meat-loaf.jpg': 'meat loaf',
  'mountain-dew.jpg': 'mountain dew',
  'nutella.jpg': 'nutella',
  'olive-oil.jpg': 'olive oil',
  'paper-towel.jpg': 'paper towel',
  'peanut-butter.jpg': 'peanut butter',
  'pepsi.jpg': 'pepsi',
  'piattos.jpg': 'piattos',
  'pineapple-juice.jpg': 'pineapple juice',
  'pocari-sweat.jpg': 'pocari sweat',
  'popcorn.jpg': 'popcorn',
  'pork-and-beans.jpg': 'pork and beans',
  'pretzels.jpg': 'pretzels',
  'quail-eggs.jpg': 'quail eggs',
  'salted-eggs.jpg': 'salted egg',
  'sesame-oil.jpg': 'sesame oil',
  'soy-milk.jpg': 'soy milk',
  'sponge.jpg': 'sponge cleaning',
  'squid-balls.jpg': 'squid ball',
  'steel-wool.jpg': 'steel wool',
  'strawberry-jam.jpg': 'strawberry jam',
  'wafer-sticks.jpg': 'wafer sticks',
  'wet-wipes.jpg': 'wet wipes',
  'yakult.jpg': 'yakult',

  // Cup noodles and pancit canton (replace webp with jpg from SM)
  'cup-noodles.jpg': 'cup noodles nissin',
  'pancit-canton.jpg': 'pancit canton lucky me',
  'pancit-chilimansi.jpg': 'pancit canton chilimansi',
};

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        try { fs.unlinkSync(filepath); } catch {}
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(filepath); } catch {}
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      try { fs.unlinkSync(filepath); } catch {}
      reject(err);
    });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function searchAndGetImage(page, query) {
  const searchUrl = `https://smmarkets.ph/search.html?query=${encodeURIComponent(query)}`;
  await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait a bit for lazy images to load
  await sleep(2000);

  // Scroll down slightly to trigger lazy loading
  await page.evaluate(() => window.scrollBy(0, 300));
  await sleep(1000);

  // Get the first real product image URL
  const imageUrl = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    for (const img of imgs) {
      const src = img.src || '';
      if (src.startsWith('https://smmarkets.ph/media/catalog/product/')) {
        return src;
      }
    }
    return null;
  });

  return imageUrl;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('\n🛒 Scraping product images from SM Markets...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  const entries = Object.entries(PRODUCT_SEARCHES);
  let downloaded = 0, skipped = 0, failed = 0;

  for (const [filename, query] of entries) {
    const filepath = path.join(OUTPUT_DIR, filename);

    // Skip if already has a good-sized image (> 5KB means not a placeholder)
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 5000) {
        // We still want to replace with SM Markets images
        // but keep existing as backup
      }
    }

    try {
      process.stdout.write(`  🔍 ${filename} (${query}) ... `);
      const imageUrl = await searchAndGetImage(page, query);

      if (imageUrl) {
        // Use higher res version
        const hiResUrl = imageUrl.replace('height=300&width=300', 'height=600&width=600');
        await downloadFile(hiResUrl, filepath);
        downloaded++;
        const size = fs.statSync(filepath).size;
        console.log(`✅ (${Math.round(size/1024)}KB)`);
      } else {
        console.log('⚠️  No results, keeping existing');
        skipped++;
      }

      // Be polite to the server
      await sleep(800);
    } catch (err) {
      failed++;
      console.log(`❌ ${err.message}`);
    }
  }

  await browser.close();

  console.log(`\n📊 Results: ${downloaded} downloaded, ${skipped} no results, ${failed} failed`);
  console.log(`📁 Images saved to: ${OUTPUT_DIR}\n`);
}

main().catch(console.error);
