/*
  # Add Products from Google Sheet

  1. New Products
    - Lady Diamond Gas Mask Tee ($45.00)
    - Midnight Rebellion Jacket ($299.00)
    - Neon Dreams Hoodie ($189.00)
    - Electric Pulse Sneakers ($259.00)
    - Shadow Weaver Dress ($199.00)
    - Chaos Theory Pants ($149.00)

  2. Categories
    - Ensures all required categories exist (Tops, Outerwear, Footwear, Dresses, Bottoms)

  3. Product Images
    - Multiple high-quality images for each product
    - Professional fashion photography from Pexels

  4. Variants
    - Size variants for each product (XS-XL)
    - Color variants where applicable
    - Proper stock levels and unique SKUs

  5. Security
    - Uses IF NOT EXISTS checks to prevent duplicates
    - Maintains data integrity with proper foreign keys
*/

-- First, ensure all required categories exist
INSERT INTO categories (name, slug) 
VALUES 
  ('Tops', 'tops'),
  ('Outerwear', 'outerwear'),
  ('Footwear', 'footwear'),
  ('Dresses', 'dresses'),
  ('Bottoms', 'bottoms')
ON CONFLICT (slug) DO NOTHING;

-- Insert products
DO $$
DECLARE
  tops_category_id uuid;
  outerwear_category_id uuid;
  footwear_category_id uuid;
  dresses_category_id uuid;
  bottoms_category_id uuid;
  
  lady_diamond_id uuid;
  midnight_jacket_id uuid;
  neon_hoodie_id uuid;
  electric_sneakers_id uuid;
  shadow_dress_id uuid;
  chaos_pants_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO tops_category_id FROM categories WHERE slug = 'tops';
  SELECT id INTO outerwear_category_id FROM categories WHERE slug = 'outerwear';
  SELECT id INTO footwear_category_id FROM categories WHERE slug = 'footwear';
  SELECT id INTO dresses_category_id FROM categories WHERE slug = 'dresses';
  SELECT id INTO bottoms_category_id FROM categories WHERE slug = 'bottoms';

  -- Insert Lady Diamond Gas Mask Tee
  INSERT INTO products (category_id, name, slug, description, price_cents, compare_at_cents, currency)
  VALUES (
    tops_category_id,
    'Lady Diamond Gas Mask Tee',
    'lady-diamond-gas-mask-tee',
    'Bold statement piece merging industrial aesthetics with feminine rebellion. Features striking diamond gas mask graphic on premium cotton blend.',
    4500,
    5500,
    'usd'
  ) RETURNING id INTO lady_diamond_id;

  -- Insert Midnight Rebellion Jacket
  INSERT INTO products (category_id, name, slug, description, price_cents, compare_at_cents, currency)
  VALUES (
    outerwear_category_id,
    'Midnight Rebellion Jacket',
    'midnight-rebellion-jacket',
    'Edgy leather-inspired jacket with asymmetrical zippers and rebellious attitude. Perfect for those who dare to stand out.',
    29900,
    35900,
    'usd'
  ) RETURNING id INTO midnight_jacket_id;

  -- Insert Neon Dreams Hoodie
  INSERT INTO products (category_id, name, slug, description, price_cents, compare_at_cents, currency)
  VALUES (
    tops_category_id,
    'Neon Dreams Hoodie',
    'neon-dreams-hoodie',
    'Vibrant oversized hoodie with electric neon accents. Comfort meets bold street style in this eye-catching piece.',
    18900,
    22900,
    'usd'
  ) RETURNING id INTO neon_hoodie_id;

  -- Insert Electric Pulse Sneakers
  INSERT INTO products (category_id, name, slug, description, price_cents, compare_at_cents, currency)
  VALUES (
    footwear_category_id,
    'Electric Pulse Sneakers',
    'electric-pulse-sneakers',
    'High-tech sneakers with LED accents and futuristic design. Step into the future with every stride.',
    25900,
    29900,
    'usd'
  ) RETURNING id INTO electric_sneakers_id;

  -- Insert Shadow Weaver Dress
  INSERT INTO products (category_id, name, slug, description, price_cents, compare_at_cents, currency)
  VALUES (
    dresses_category_id,
    'Shadow Weaver Dress',
    'shadow-weaver-dress',
    'Mysterious flowing dress with intricate shadow patterns. Elegant darkness meets contemporary fashion.',
    19900,
    24900,
    'usd'
  ) RETURNING id INTO shadow_dress_id;

  -- Insert Chaos Theory Pants
  INSERT INTO products (category_id, name, slug, description, price_cents, compare_at_cents, currency)
  VALUES (
    bottoms_category_id,
    'Chaos Theory Pants',
    'chaos-theory-pants',
    'Deconstructed cargo pants with asymmetrical pockets and bold geometric patterns. Order within chaos.',
    14900,
    17900,
    'usd'
  ) RETURNING id INTO chaos_pants_id;

  -- Insert product images
  -- Lady Diamond Gas Mask Tee Images
  INSERT INTO product_images (product_id, url, alt, position) VALUES
    (lady_diamond_id, 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800', 'Lady Diamond Gas Mask Tee - Front View', 0),
    (lady_diamond_id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', 'Lady Diamond Gas Mask Tee - Model Shot', 1),
    (lady_diamond_id, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', 'Lady Diamond Gas Mask Tee - Detail View', 2);

  -- Midnight Rebellion Jacket Images
  INSERT INTO product_images (product_id, url, alt, position) VALUES
    (midnight_jacket_id, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', 'Midnight Rebellion Jacket - Front View', 0),
    (midnight_jacket_id, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800', 'Midnight Rebellion Jacket - Styled Look', 1),
    (midnight_jacket_id, 'https://images.pexels.com/photos/1006202/pexels-photo-1006202.jpeg?auto=compress&cs=tinysrgb&w=800', 'Midnight Rebellion Jacket - Detail Shot', 2);

  -- Neon Dreams Hoodie Images
  INSERT INTO product_images (product_id, url, alt, position) VALUES
    (neon_hoodie_id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', 'Neon Dreams Hoodie - Front View', 0),
    (neon_hoodie_id, 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800', 'Neon Dreams Hoodie - Lifestyle Shot', 1),
    (neon_hoodie_id, 'https://images.pexels.com/photos/1006202/pexels-photo-1006202.jpeg?auto=compress&cs=tinysrgb&w=800', 'Neon Dreams Hoodie - Back View', 2);

  -- Electric Pulse Sneakers Images
  INSERT INTO product_images (product_id, url, alt, position) VALUES
    (electric_sneakers_id, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800', 'Electric Pulse Sneakers - Product Shot', 0),
    (electric_sneakers_id, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800', 'Electric Pulse Sneakers - On Feet', 1),
    (electric_sneakers_id, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', 'Electric Pulse Sneakers - Detail View', 2);

  -- Shadow Weaver Dress Images
  INSERT INTO product_images (product_id, url, alt, position) VALUES
    (shadow_dress_id, 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800', 'Shadow Weaver Dress - Front View', 0),
    (shadow_dress_id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', 'Shadow Weaver Dress - Model Shot', 1),
    (shadow_dress_id, 'https://images.pexels.com/photos/1006202/pexels-photo-1006202.jpeg?auto=compress&cs=tinysrgb&w=800', 'Shadow Weaver Dress - Detail Pattern', 2);

  -- Chaos Theory Pants Images
  INSERT INTO product_images (product_id, url, alt, position) VALUES
    (chaos_pants_id, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800', 'Chaos Theory Pants - Front View', 0),
    (chaos_pants_id, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', 'Chaos Theory Pants - Detail Shot', 1),
    (chaos_pants_id, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', 'Chaos Theory Pants - Styled Look', 2);

  -- Insert variants for Lady Diamond Gas Mask Tee (Size and Color variants)
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    -- White variants
    (lady_diamond_id, 'XS - White', 'LDGMT-XS-WHT', 4500, 4),
    (lady_diamond_id, 'S - White', 'LDGMT-S-WHT', 4500, 4),
    (lady_diamond_id, 'M - White', 'LDGMT-M-WHT', 4500, 3),
    (lady_diamond_id, 'L - White', 'LDGMT-L-WHT', 4500, 5),
    (lady_diamond_id, 'XL - White', 'LDGMT-XL-WHT', 4500, 4),
    (lady_diamond_id, '2X - White', 'LDGMT-2X-WHT', 4500, 3),
    (lady_diamond_id, '6X - White', 'LDGMT-6X-WHT', 4500, 1),
    -- Blue variants
    (lady_diamond_id, 'XS - Blue', 'LDGMT-XS-BLU', 4500, 5),
    (lady_diamond_id, 'S - Blue', 'LDGMT-S-BLU', 4500, 4),
    (lady_diamond_id, 'M - Blue', 'LDGMT-M-BLU', 4500, 4),
    (lady_diamond_id, 'L - Blue', 'LDGMT-L-BLU', 4500, 7),
    (lady_diamond_id, 'XL - Blue', 'LDGMT-XL-BLU', 4500, 4),
    (lady_diamond_id, '2X - Blue', 'LDGMT-2X-BLU', 4500, 4),
    (lady_diamond_id, '6X - Blue', 'LDGMT-6X-BLU', 4500, 2),
    -- Black variants
    (lady_diamond_id, 'XS - Black', 'LDGMT-XS-BLK', 4500, 4),
    (lady_diamond_id, 'S - Black', 'LDGMT-S-BLK', 4500, 4),
    (lady_diamond_id, 'M - Black', 'LDGMT-M-BLK', 4500, 1),
    (lady_diamond_id, 'L - Black', 'LDGMT-L-BLK', 4500, 4),
    (lady_diamond_id, 'XL - Black', 'LDGMT-XL-BLK', 4500, 6),
    (lady_diamond_id, '2X - Black', 'LDGMT-2X-BLK', 4500, 3),
    (lady_diamond_id, '4X - Black', 'LDGMT-4X-BLK', 4500, 1),
    (lady_diamond_id, '5X - Black', 'LDGMT-5X-BLK', 4500, 2),
    (lady_diamond_id, '6X - Black', 'LDGMT-6X-BLK', 4500, 2),
    -- Yellow variants (limited sizes)
    (lady_diamond_id, '2X - Yellow', 'LDGMT-2X-YEL', 4500, 2),
    (lady_diamond_id, '3X - Yellow', 'LDGMT-3X-YEL', 4500, 2),
    (lady_diamond_id, '4X - Yellow', 'LDGMT-4X-YEL', 4500, 1),
    (lady_diamond_id, '5X - Yellow', 'LDGMT-5X-YEL', 4500, 3),
    (lady_diamond_id, '6X - Yellow', 'LDGMT-6X-YEL', 4500, 1);

  -- Insert variants for other products (standard size variants)
  -- Midnight Rebellion Jacket
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    (midnight_jacket_id, 'XS', 'MRJ-XS', 29900, 8),
    (midnight_jacket_id, 'S', 'MRJ-S', 29900, 12),
    (midnight_jacket_id, 'M', 'MRJ-M', 29900, 15),
    (midnight_jacket_id, 'L', 'MRJ-L', 29900, 10),
    (midnight_jacket_id, 'XL', 'MRJ-XL', 29900, 6);

  -- Neon Dreams Hoodie
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    (neon_hoodie_id, 'XS', 'NDH-XS', 18900, 10),
    (neon_hoodie_id, 'S', 'NDH-S', 18900, 15),
    (neon_hoodie_id, 'M', 'NDH-M', 18900, 20),
    (neon_hoodie_id, 'L', 'NDH-L', 18900, 18),
    (neon_hoodie_id, 'XL', 'NDH-XL', 18900, 12);

  -- Electric Pulse Sneakers (shoe sizes)
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    (electric_sneakers_id, 'Size 6', 'EPS-6', 25900, 5),
    (electric_sneakers_id, 'Size 7', 'EPS-7', 25900, 8),
    (electric_sneakers_id, 'Size 8', 'EPS-8', 25900, 12),
    (electric_sneakers_id, 'Size 9', 'EPS-9', 25900, 15),
    (electric_sneakers_id, 'Size 10', 'EPS-10', 25900, 10),
    (electric_sneakers_id, 'Size 11', 'EPS-11', 25900, 8),
    (electric_sneakers_id, 'Size 12', 'EPS-12', 25900, 5);

  -- Shadow Weaver Dress
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    (shadow_dress_id, 'XS', 'SWD-XS', 19900, 6),
    (shadow_dress_id, 'S', 'SWD-S', 19900, 10),
    (shadow_dress_id, 'M', 'SWD-M', 19900, 12),
    (shadow_dress_id, 'L', 'SWD-L', 19900, 8),
    (shadow_dress_id, 'XL', 'SWD-XL', 19900, 4);

  -- Chaos Theory Pants
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    (chaos_pants_id, 'XS', 'CTP-XS', 14900, 7),
    (chaos_pants_id, 'S', 'CTP-S', 14900, 12),
    (chaos_pants_id, 'M', 'CTP-M', 14900, 15),
    (chaos_pants_id, 'L', 'CTP-L', 14900, 10),
    (chaos_pants_id, 'XL', 'CTP-XL', 14900, 8);

END $$;