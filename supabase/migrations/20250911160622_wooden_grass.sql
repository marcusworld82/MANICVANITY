/*
  # Add Lady Diamond Gas Mask Tee Product

  1. New Product
    - Lady Diamond Gas Mask Tee with description and pricing
    - Multiple product images for different angles/views
    - Categorized under "Tops"

  2. Variants
    - Size and color combinations (XS-6X in White, Blue, Black, Yellow)
    - Stock levels from CSV data
    - Individual SKUs for inventory tracking

  3. Images
    - High-quality product images from fashion photography sources
    - Multiple angles and color variations
*/

-- Insert the Lady Diamond Gas Mask Tee product
INSERT INTO products (
  category_id,
  name,
  slug,
  description,
  price_cents,
  compare_at_cents,
  currency
) VALUES (
  (SELECT id FROM categories WHERE slug = 'tops' LIMIT 1),
  'Lady Diamond Gas Mask Tee',
  'lady-diamond-gas-mask-tee',
  'A bold statement piece that merges industrial aesthetics with feminine rebellion. This premium cotton tee features an intricate diamond-encrusted gas mask graphic that challenges conventional beauty standards. The oversized fit and dropped shoulders create a contemporary silhouette perfect for the fearless fashionista. Made from 100% organic cotton with water-based inks for lasting comfort and durability.',
  4500, -- $45.00
  5500, -- $55.00 compare at price
  'usd'
);

-- Get the product ID for the Lady Diamond Gas Mask Tee
DO $$
DECLARE
  product_uuid uuid;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE slug = 'lady-diamond-gas-mask-tee';
  
  -- Insert product images
  INSERT INTO product_images (product_id, url, alt, position) VALUES
    (product_uuid, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Lady Diamond Gas Mask Tee - Front View', 0),
    (product_uuid, 'https://images.pexels.com/photos/1006202/pexels-photo-1006202.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Lady Diamond Gas Mask Tee - Back View', 1),
    (product_uuid, 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Lady Diamond Gas Mask Tee - Detail Shot', 2),
    (product_uuid, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Lady Diamond Gas Mask Tee - Lifestyle', 3),
    (product_uuid, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Lady Diamond Gas Mask Tee - Model Shot', 4);

  -- Insert variants with stock levels from CSV
  -- White variants
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    (product_uuid, 'XS - White', 'LDGMT-XS-WHT', 4500, 4),
    (product_uuid, 'S - White', 'LDGMT-S-WHT', 4500, 4),
    (product_uuid, 'M - White', 'LDGMT-M-WHT', 4500, 3),
    (product_uuid, 'L - White', 'LDGMT-L-WHT', 4500, 5),
    (product_uuid, 'XL - White', 'LDGMT-XL-WHT', 4500, 4),
    (product_uuid, '2X - White', 'LDGMT-2X-WHT', 4500, 3),
    (product_uuid, '3X - White', 'LDGMT-3X-WHT', 4500, 0),
    (product_uuid, '4X - White', 'LDGMT-4X-WHT', 4500, 0),
    (product_uuid, '5X - White', 'LDGMT-5X-WHT', 4500, 0),
    (product_uuid, '6X - White', 'LDGMT-6X-WHT', 4500, 1);

  -- Blue variants
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    (product_uuid, 'XS - Blue', 'LDGMT-XS-BLU', 4500, 5),
    (product_uuid, 'S - Blue', 'LDGMT-S-BLU', 4500, 4),
    (product_uuid, 'M - Blue', 'LDGMT-M-BLU', 4500, 4),
    (product_uuid, 'L - Blue', 'LDGMT-L-BLU', 4500, 7),
    (product_uuid, 'XL - Blue', 'LDGMT-XL-BLU', 4500, 4),
    (product_uuid, '2X - Blue', 'LDGMT-2X-BLU', 4500, 4),
    (product_uuid, '3X - Blue', 'LDGMT-3X-BLU', 4500, 0),
    (product_uuid, '4X - Blue', 'LDGMT-4X-BLU', 4500, 0),
    (product_uuid, '5X - Blue', 'LDGMT-5X-BLU', 4500, 0),
    (product_uuid, '6X - Blue', 'LDGMT-6X-BLU', 4500, 2);

  -- Black variants
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    (product_uuid, 'XS - Black', 'LDGMT-XS-BLK', 4500, 4),
    (product_uuid, 'S - Black', 'LDGMT-S-BLK', 4500, 4),
    (product_uuid, 'M - Black', 'LDGMT-M-BLK', 4500, 1),
    (product_uuid, 'L - Black', 'LDGMT-L-BLK', 4500, 4),
    (product_uuid, 'XL - Black', 'LDGMT-XL-BLK', 4500, 6),
    (product_uuid, '2X - Black', 'LDGMT-2X-BLK', 4500, 3),
    (product_uuid, '3X - Black', 'LDGMT-3X-BLK', 4500, 0),
    (product_uuid, '4X - Black', 'LDGMT-4X-BLK', 4500, 1),
    (product_uuid, '5X - Black', 'LDGMT-5X-BLK', 4500, 2),
    (product_uuid, '6X - Black', 'LDGMT-6X-BLK', 4500, 2);

  -- Yellow variants
  INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
    (product_uuid, 'XS - Yellow', 'LDGMT-XS-YEL', 4500, 0),
    (product_uuid, 'S - Yellow', 'LDGMT-S-YEL', 4500, 0),
    (product_uuid, 'M - Yellow', 'LDGMT-M-YEL', 4500, 0),
    (product_uuid, 'L - Yellow', 'LDGMT-L-YEL', 4500, 0),
    (product_uuid, 'XL - Yellow', 'LDGMT-XL-YEL', 4500, 0),
    (product_uuid, '2X - Yellow', 'LDGMT-2X-YEL', 4500, 2),
    (product_uuid, '3X - Yellow', 'LDGMT-3X-YEL', 4500, 2),
    (product_uuid, '4X - Yellow', 'LDGMT-4X-YEL', 4500, 1),
    (product_uuid, '5X - Yellow', 'LDGMT-5X-YEL', 4500, 3),
    (product_uuid, '6X - Yellow', 'LDGMT-6X-YEL', 4500, 1);
END $$;