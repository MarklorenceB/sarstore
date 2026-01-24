-- ============================================
-- SARI-STORE SEED DATA
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. INSERT CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, icon, description, sort_order) VALUES
  ('Cooking Essentials', 'cooking-essentials', '🍳', 'Rice, oil, salt, sugar, and other cooking basics', 1),
  ('Eggs & Dairy', 'eggs-dairy', '🥚', 'Fresh eggs, milk, cheese, butter, and dairy products', 2),
  ('Meat & Poultry', 'meat-poultry', '🥩', 'Fresh pork, chicken, beef, and other meats', 3),
  ('Canned & Packaged', 'canned-packaged', '🥫', 'Canned goods, instant noodles, and packaged foods', 4),
  ('Frozen Foods', 'frozen-foods', '🧊', 'Frozen meats, ice cream, and frozen ready-to-cook items', 5),
  ('Bakery & Snacks', 'bakery-snacks', '🍞', 'Bread, pastries, chips, and snack items', 6),
  ('Beverages', 'beverages', '🥤', 'Soft drinks, juice, coffee, and other drinks', 7),
  ('Condiments & Sauces', 'condiments-sauces', '🫙', 'Soy sauce, vinegar, ketchup, and seasonings', 8),
  ('Household Essentials', 'household', '🧹', 'Cleaning supplies, detergent, and household items', 9)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. INSERT PRODUCTS
-- ============================================

-- Get category IDs
DO $$
DECLARE
  cat_cooking UUID;
  cat_eggs UUID;
  cat_meat UUID;
  cat_canned UUID;
  cat_frozen UUID;
  cat_bakery UUID;
  cat_beverages UUID;
  cat_condiments UUID;
  cat_household UUID;
BEGIN
  SELECT id INTO cat_cooking FROM categories WHERE slug = 'cooking-essentials';
  SELECT id INTO cat_eggs FROM categories WHERE slug = 'eggs-dairy';
  SELECT id INTO cat_meat FROM categories WHERE slug = 'meat-poultry';
  SELECT id INTO cat_canned FROM categories WHERE slug = 'canned-packaged';
  SELECT id INTO cat_frozen FROM categories WHERE slug = 'frozen-foods';
  SELECT id INTO cat_bakery FROM categories WHERE slug = 'bakery-snacks';
  SELECT id INTO cat_beverages FROM categories WHERE slug = 'beverages';
  SELECT id INTO cat_condiments FROM categories WHERE slug = 'condiments-sauces';
  SELECT id INTO cat_household FROM categories WHERE slug = 'household';

  -- COOKING ESSENTIALS
  INSERT INTO products (name, slug, price, old_price, unit, image_emoji, category_id, stock_quantity, is_available, is_featured, badge, rating, review_count) VALUES
    ('Cooking Oil 1L', 'cooking-oil-1l', 89, 105, 'bottle', '🫒', cat_cooking, 50, true, true, 'sale', 4.7, 256),
    ('Jasmine Rice 5kg', 'jasmine-rice-5kg', 285, 320, 'sack', '🍚', cat_cooking, 30, true, true, 'popular', 4.9, 312),
    ('Jasmine Rice 25kg', 'jasmine-rice-25kg', 1350, 1450, 'sack', '🍚', cat_cooking, 15, true, false, NULL, 4.9, 189),
    ('Sugar 1kg', 'sugar-1kg', 65, 72, 'pack', '🧂', cat_cooking, 40, true, false, NULL, 4.5, 89),
    ('Brown Sugar 1kg', 'brown-sugar-1kg', 75, 85, 'pack', '🧂', cat_cooking, 25, true, false, NULL, 4.4, 56),
    ('Salt 250g', 'salt-250g', 15, NULL, 'pack', '🧂', cat_cooking, 100, true, false, NULL, 4.3, 45),
    ('Iodized Salt 1kg', 'iodized-salt-1kg', 35, 40, 'pack', '🧂', cat_cooking, 60, true, false, NULL, 4.4, 67),
    ('All-Purpose Flour 1kg', 'flour-1kg', 55, 62, 'pack', '🌾', cat_cooking, 35, true, false, NULL, 4.6, 78),
    ('Cornstarch 250g', 'cornstarch-250g', 25, 30, 'pack', '🌾', cat_cooking, 45, true, false, NULL, 4.5, 34),
    ('Cooking Oil 2L', 'cooking-oil-2l', 165, 185, 'bottle', '🫒', cat_cooking, 30, true, false, NULL, 4.7, 145),
    ('Garlic 100g', 'garlic-100g', 25, 30, 'pack', '🧄', cat_cooking, 80, true, false, NULL, 4.5, 123),
    ('Onion 250g', 'onion-250g', 35, 40, 'pack', '🧅', cat_cooking, 70, true, false, NULL, 4.6, 98),
    ('Ginger 100g', 'ginger-100g', 20, 25, 'pack', '🫚', cat_cooking, 60, true, false, NULL, 4.4, 67);

  -- EGGS & DAIRY
  INSERT INTO products (name, slug, price, old_price, unit, image_emoji, category_id, stock_quantity, is_available, is_featured, badge, rating, review_count) VALUES
    ('Fresh Eggs (30pcs)', 'fresh-eggs-30', 195, 220, 'tray', '🥚', cat_eggs, 25, true, true, 'best-seller', 4.8, 124),
    ('Fresh Eggs (12pcs)', 'fresh-eggs-12', 85, 95, 'dozen', '🥚', cat_eggs, 40, true, false, NULL, 4.7, 89),
    ('Fresh Milk 1L', 'fresh-milk-1l', 85, 95, 'carton', '🥛', cat_eggs, 20, true, true, NULL, 4.6, 78),
    ('Fresh Milk 250ml', 'fresh-milk-250ml', 28, 32, 'pack', '🥛', cat_eggs, 50, true, false, NULL, 4.5, 56),
    ('Butter 225g', 'butter-225g', 95, 110, 'pack', '🧈', cat_eggs, 15, true, false, 'new', 4.7, 56),
    ('Margarine 250g', 'margarine-250g', 55, 65, 'tub', '🧈', cat_eggs, 25, true, false, NULL, 4.4, 45),
    ('Cheese Slices (10pcs)', 'cheese-slices', 85, 98, 'pack', '🧀', cat_eggs, 18, true, false, NULL, 4.5, 67),
    ('Quickmelt Cheese 200g', 'quickmelt-cheese', 95, 110, 'pack', '🧀', cat_eggs, 20, true, false, NULL, 4.6, 78),
    ('Yogurt 125ml', 'yogurt-125ml', 35, 42, 'cup', '🥛', cat_eggs, 30, true, false, NULL, 4.6, 89),
    ('Evaporated Milk 370ml', 'evaporated-milk', 45, 52, 'can', '🥛', cat_eggs, 40, true, false, NULL, 4.5, 67),
    ('Condensed Milk 300ml', 'condensed-milk', 55, 62, 'can', '🥛', cat_eggs, 35, true, false, NULL, 4.7, 98);

  -- MEAT & POULTRY
  INSERT INTO products (name, slug, price, old_price, unit, image_emoji, category_id, stock_quantity, is_available, is_featured, badge, rating, review_count) VALUES
    ('Pork Belly 1kg', 'pork-belly-1kg', 380, 420, 'kg', '🥩', cat_meat, 15, true, true, 'fresh', 4.9, 89),
    ('Pork Liempo 500g', 'pork-liempo-500g', 195, 215, 'pack', '🥩', cat_meat, 20, true, false, NULL, 4.8, 67),
    ('Whole Chicken', 'whole-chicken', 220, 260, 'kg', '🍗', cat_meat, 12, true, true, 'hot', 4.8, 156),
    ('Chicken Breast 500g', 'chicken-breast-500g', 165, 185, 'pack', '🍗', cat_meat, 18, true, false, NULL, 4.7, 78),
    ('Ground Beef 500g', 'ground-beef-500g', 195, 220, 'pack', '🥩', cat_meat, 10, true, false, NULL, 4.7, 67),
    ('Beef Cubes 500g', 'beef-cubes-500g', 245, 275, 'pack', '🥩', cat_meat, 8, true, false, NULL, 4.6, 45),
    ('Pork Chop 500g', 'pork-chop-500g', 165, 185, 'pack', '🥩', cat_meat, 8, true, false, NULL, 4.6, 45),
    ('Chicken Wings 500g', 'chicken-wings-500g', 145, 165, 'pack', '🍗', cat_meat, 14, true, false, NULL, 4.5, 78),
    ('Chicken Drumstick 500g', 'chicken-drumstick-500g', 135, 155, 'pack', '🍗', cat_meat, 16, true, false, NULL, 4.6, 89),
    ('Pork Kasim 1kg', 'pork-kasim-1kg', 320, 360, 'kg', '🥩', cat_meat, 10, true, false, NULL, 4.7, 56),
    ('Tocino 250g', 'tocino-250g', 95, 110, 'pack', '🥩', cat_meat, 25, true, false, 'popular', 4.8, 134),
    ('Longganisa 250g', 'longganisa-250g', 85, 98, 'pack', '🌭', cat_meat, 30, true, false, NULL, 4.7, 112);

  -- CANNED & PACKAGED
  INSERT INTO products (name, slug, price, old_price, unit, image_emoji, category_id, stock_quantity, is_available, is_featured, badge, rating, review_count) VALUES
    ('Corned Beef 260g', 'corned-beef-260g', 65, 75, 'can', '🥫', cat_canned, 40, true, true, NULL, 4.5, 98),
    ('Corned Beef 150g', 'corned-beef-150g', 42, 48, 'can', '🥫', cat_canned, 50, true, false, NULL, 4.4, 67),
    ('Sardines 155g', 'sardines-155g', 25, 30, 'can', '🐟', cat_canned, 60, true, false, NULL, 4.4, 134),
    ('Sardines in Tomato Sauce', 'sardines-tomato', 28, 32, 'can', '🐟', cat_canned, 55, true, false, NULL, 4.5, 98),
    ('Instant Noodles', 'instant-noodles', 12, 15, 'pack', '🍜', cat_canned, 100, true, false, NULL, 4.5, 256),
    ('Cup Noodles', 'cup-noodles', 35, 40, 'cup', '🍜', cat_canned, 45, true, false, NULL, 4.6, 134),
    ('Tuna Flakes 180g', 'tuna-flakes-180g', 45, 52, 'can', '🐟', cat_canned, 35, true, false, NULL, 4.6, 87),
    ('Tuna Chunks 180g', 'tuna-chunks-180g', 55, 62, 'can', '🐟', cat_canned, 30, true, false, NULL, 4.7, 78),
    ('Spam 340g', 'spam-340g', 185, 210, 'can', '🥫', cat_canned, 20, true, false, 'popular', 4.7, 123),
    ('Maling 397g', 'maling-397g', 125, 145, 'can', '🥫', cat_canned, 25, true, false, NULL, 4.5, 89),
    ('Liver Spread 85g', 'liver-spread-85g', 32, 38, 'can', '🥫', cat_canned, 40, true, false, NULL, 4.4, 67),
    ('Tomato Sauce 250g', 'tomato-sauce-250g', 25, 30, 'pack', '🍅', cat_canned, 45, true, false, NULL, 4.5, 78),
    ('Spaghetti Pasta 500g', 'spaghetti-pasta-500g', 45, 52, 'pack', '🍝', cat_canned, 35, true, false, NULL, 4.6, 89);

  -- FROZEN FOODS
  INSERT INTO products (name, slug, price, old_price, unit, image_emoji, category_id, stock_quantity, is_available, is_featured, badge, rating, review_count) VALUES
    ('Hotdog 500g', 'hotdog-500g', 125, 145, 'pack', '🌭', cat_frozen, 25, true, true, NULL, 4.4, 89),
    ('Hotdog Jumbo 500g', 'hotdog-jumbo-500g', 155, 175, 'pack', '🌭', cat_frozen, 20, true, false, NULL, 4.5, 67),
    ('Chicken Nuggets 250g', 'chicken-nuggets-250g', 95, 110, 'pack', '🍗', cat_frozen, 18, true, false, NULL, 4.5, 67),
    ('Chicken Nuggets 500g', 'chicken-nuggets-500g', 175, 195, 'pack', '🍗', cat_frozen, 15, true, false, NULL, 4.6, 78),
    ('Fish Fillet 500g', 'fish-fillet-500g', 165, 185, 'pack', '🐟', cat_frozen, 12, true, false, NULL, 4.6, 45),
    ('Bangus Boneless 400g', 'bangus-boneless-400g', 145, 165, 'pack', '🐟', cat_frozen, 15, true, false, 'fresh', 4.7, 89),
    ('Pork Siomai 250g', 'pork-siomai-250g', 85, 98, 'pack', '🥟', cat_frozen, 20, true, false, NULL, 4.5, 56),
    ('Beef Siomai 250g', 'beef-siomai-250g', 95, 110, 'pack', '🥟', cat_frozen, 18, true, false, NULL, 4.6, 67),
    ('Ice Cream 1L', 'ice-cream-1l', 145, 165, 'tub', '🍦', cat_frozen, 15, true, false, NULL, 4.7, 123),
    ('Ice Cream Sandwich', 'ice-cream-sandwich', 25, 30, 'pc', '🍦', cat_frozen, 30, true, false, NULL, 4.5, 89);

  -- BAKERY & SNACKS
  INSERT INTO products (name, slug, price, old_price, unit, image_emoji, category_id, stock_quantity, is_available, is_featured, badge, rating, review_count) VALUES
    ('Pandesal (10pcs)', 'pandesal-10pcs', 50, 60, 'pack', '🥖', cat_bakery, 30, true, true, 'fresh', 4.7, 234),
    ('Pandesal (20pcs)', 'pandesal-20pcs', 95, 110, 'pack', '🥖', cat_bakery, 20, true, false, NULL, 4.7, 156),
    ('Sliced Bread', 'sliced-bread', 55, 62, 'loaf', '🍞', cat_bakery, 25, true, false, NULL, 4.5, 156),
    ('Whole Wheat Bread', 'whole-wheat-bread', 75, 85, 'loaf', '🍞', cat_bakery, 15, true, false, NULL, 4.6, 89),
    ('Potato Chips 150g', 'potato-chips-150g', 65, 75, 'pack', '🥔', cat_bakery, 40, true, false, NULL, 4.4, 189),
    ('Potato Chips 60g', 'potato-chips-60g', 28, 32, 'pack', '🥔', cat_bakery, 60, true, false, NULL, 4.4, 134),
    ('Cookies 200g', 'cookies-200g', 45, 52, 'pack', '🍪', cat_bakery, 35, true, false, NULL, 4.6, 98),
    ('Oreo 133g', 'oreo-133g', 55, 62, 'pack', '🍪', cat_bakery, 30, true, false, NULL, 4.7, 145),
    ('Crackers 200g', 'crackers-200g', 35, 42, 'pack', '🍘', cat_bakery, 40, true, false, NULL, 4.5, 78),
    ('Chocolate Bar 50g', 'chocolate-bar-50g', 45, 52, 'pc', '🍫', cat_bakery, 50, true, false, NULL, 4.8, 167),
    ('Ensaymada (5pcs)', 'ensaymada-5pcs', 75, 85, 'pack', '🥐', cat_bakery, 15, true, false, 'new', 4.6, 67);

  -- BEVERAGES
  INSERT INTO products (name, slug, price, old_price, unit, image_emoji, category_id, stock_quantity, is_available, is_featured, badge, rating, review_count) VALUES
    ('Coke 1.5L', 'coke-1.5l', 65, 75, 'bottle', '🥤', cat_beverages, 50, true, true, NULL, 4.6, 189),
    ('Coke 330ml', 'coke-330ml', 25, 30, 'can', '🥤', cat_beverages, 80, true, false, NULL, 4.6, 145),
    ('Sprite 1.5L', 'sprite-1.5l', 65, 75, 'bottle', '🥤', cat_beverages, 45, true, false, NULL, 4.5, 134),
    ('Royal 1.5L', 'royal-1.5l', 65, 75, 'bottle', '🥤', cat_beverages, 40, true, false, NULL, 4.5, 123),
    ('Coffee 3-in-1 (10pcs)', 'coffee-3in1-10pcs', 80, 95, 'pack', '☕', cat_beverages, 45, true, false, NULL, 4.6, 234),
    ('Coffee 3-in-1 (30pcs)', 'coffee-3in1-30pcs', 225, 260, 'pack', '☕', cat_beverages, 25, true, false, NULL, 4.7, 156),
    ('Orange Juice 1L', 'orange-juice-1l', 85, 98, 'carton', '🍊', cat_beverages, 20, true, false, NULL, 4.5, 67),
    ('Apple Juice 1L', 'apple-juice-1l', 85, 98, 'carton', '🍎', cat_beverages, 18, true, false, NULL, 4.5, 56),
    ('Bottled Water 500ml (6-pack)', 'water-500ml-6pack', 45, NULL, 'pack', '💧', cat_beverages, 60, true, false, NULL, 4.3, 45),
    ('Bottled Water 1L (6-pack)', 'water-1l-6pack', 75, 85, 'pack', '💧', cat_beverages, 40, true, false, NULL, 4.4, 67),
    ('Iced Tea 1L', 'iced-tea-1l', 45, 52, 'bottle', '🧊', cat_beverages, 35, true, false, NULL, 4.5, 89),
    ('Powdered Juice 25g (10pcs)', 'powdered-juice-10pcs', 65, 75, 'pack', '🧃', cat_beverages, 40, true, false, NULL, 4.4, 78);

  -- CONDIMENTS & SAUCES
  INSERT INTO products (name, slug, price, old_price, unit, image_emoji, category_id, stock_quantity, is_available, is_featured, badge, rating, review_count) VALUES
    ('Soy Sauce 1L', 'soy-sauce-1l', 55, 65, 'bottle', '🫙', cat_condiments, 35, true, true, NULL, 4.9, 145),
    ('Soy Sauce 500ml', 'soy-sauce-500ml', 32, 38, 'bottle', '🫙', cat_condiments, 45, true, false, NULL, 4.8, 123),
    ('Vinegar 1L', 'vinegar-1l', 35, 42, 'bottle', '🍶', cat_condiments, 40, true, false, NULL, 4.8, 98),
    ('Vinegar 500ml', 'vinegar-500ml', 22, 26, 'bottle', '🍶', cat_condiments, 50, true, false, NULL, 4.7, 89),
    ('Fish Sauce 750ml', 'fish-sauce-750ml', 45, 52, 'bottle', '🥫', cat_condiments, 30, true, false, NULL, 4.7, 87),
    ('Fish Sauce 350ml', 'fish-sauce-350ml', 28, 32, 'bottle', '🥫', cat_condiments, 40, true, false, NULL, 4.6, 67),
    ('Ketchup 320g', 'ketchup-320g', 45, 52, 'bottle', '🍅', cat_condiments, 25, true, false, NULL, 4.5, 76),
    ('Ketchup 550g', 'ketchup-550g', 75, 85, 'bottle', '🍅', cat_condiments, 20, true, false, NULL, 4.6, 89),
    ('Mayonnaise 220ml', 'mayonnaise-220ml', 55, 65, 'jar', '🥫', cat_condiments, 20, true, false, NULL, 4.6, 89),
    ('Mayonnaise 470ml', 'mayonnaise-470ml', 115, 130, 'jar', '🥫', cat_condiments, 15, true, false, NULL, 4.7, 78),
    ('Oyster Sauce 300ml', 'oyster-sauce-300ml', 55, 62, 'bottle', '🫙', cat_condiments, 25, true, false, NULL, 4.6, 67),
    ('Hot Sauce 90ml', 'hot-sauce-90ml', 35, 42, 'bottle', '🌶️', cat_condiments, 30, true, false, NULL, 4.5, 56),
    ('Banana Ketchup 320g', 'banana-ketchup-320g', 42, 48, 'bottle', '🍌', cat_condiments, 25, true, false, NULL, 4.5, 78);

  -- HOUSEHOLD ESSENTIALS
  INSERT INTO products (name, slug, price, old_price, unit, image_emoji, category_id, stock_quantity, is_available, is_featured, badge, rating, review_count) VALUES
    ('Dish Soap 500ml', 'dish-soap-500ml', 45, 52, 'bottle', '🧴', cat_household, 40, true, false, NULL, 4.5, 67),
    ('Dish Soap 250ml', 'dish-soap-250ml', 28, 32, 'bottle', '🧴', cat_household, 50, true, false, NULL, 4.4, 56),
    ('Laundry Detergent 1kg', 'laundry-detergent-1kg', 85, 98, 'pack', '🧺', cat_household, 30, true, true, NULL, 4.6, 123),
    ('Laundry Detergent 500g', 'laundry-detergent-500g', 48, 55, 'pack', '🧺', cat_household, 40, true, false, NULL, 4.5, 98),
    ('Fabric Conditioner 900ml', 'fabric-conditioner-900ml', 95, 110, 'bottle', '🧴', cat_household, 25, true, false, NULL, 4.6, 87),
    ('Fabric Conditioner 450ml', 'fabric-conditioner-450ml', 55, 62, 'bottle', '🧴', cat_household, 35, true, false, NULL, 4.5, 67),
    ('Toilet Paper (4 rolls)', 'toilet-paper-4rolls', 65, 75, 'pack', '🧻', cat_household, 50, true, false, NULL, 4.4, 89),
    ('Toilet Paper (12 rolls)', 'toilet-paper-12rolls', 175, 195, 'pack', '🧻', cat_household, 20, true, false, NULL, 4.5, 67),
    ('Garbage Bags (10pcs)', 'garbage-bags-10pcs', 35, 42, 'pack', '🗑️', cat_household, 45, true, false, NULL, 4.3, 56),
    ('Garbage Bags (20pcs)', 'garbage-bags-20pcs', 65, 75, 'pack', '🗑️', cat_household, 30, true, false, NULL, 4.4, 45),
    ('All-Purpose Cleaner 500ml', 'all-purpose-cleaner-500ml', 65, 75, 'bottle', '🧹', cat_household, 25, true, false, NULL, 4.5, 67),
    ('Bleach 1L', 'bleach-1l', 55, 62, 'bottle', '🧴', cat_household, 30, true, false, NULL, 4.4, 56),
    ('Alcohol 500ml', 'alcohol-500ml', 85, 95, 'bottle', '🧴', cat_household, 40, true, false, NULL, 4.7, 123),
    ('Hand Soap 250ml', 'hand-soap-250ml', 55, 62, 'bottle', '🧼', cat_household, 35, true, false, NULL, 4.6, 89);

END $$;

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products;
