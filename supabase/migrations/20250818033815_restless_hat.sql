/*
  # MANIC VANITY Seed Data

  This file populates the database with sample categories, products, images, and variants.
  Run this after schema.sql in the Supabase SQL editor.
*/

-- Insert Categories
INSERT INTO categories (name, slug) VALUES
  ('Outerwear', 'outerwear'),
  ('Tops', 'tops'),
  ('Bottoms', 'bottoms'),
  ('Dresses', 'dresses'),
  ('Footwear', 'footwear'),
  ('Accessories', 'accessories');

-- Insert Products
INSERT INTO products (category_id, name, slug, description, price_cents, compare_at_cents) VALUES
  -- Outerwear
  ((SELECT id FROM categories WHERE slug = 'outerwear'), 'Obsidian Trench Coat', 'obsidian-trench', 'A commanding presence in midnight black. This architectural trench coat features sharp lines, oversized lapels, and a dramatic silhouette that embodies urban rebellion.', 45900, 59900),
  ((SELECT id FROM categories WHERE slug = 'outerwear'), 'Neon Rebellion Bomber', 'neon-rebellion-bomber', 'Electric energy meets street sophistication. This bomber jacket pulses with neon accents and features a sleek silhouette perfect for night adventures.', 32900, 42900),
  ((SELECT id FROM categories WHERE slug = 'outerwear'), 'Midnight Leather Jacket', 'midnight-leather', 'Crafted from premium leather with silver hardware. A timeless piece that channels rock and roll rebellion with modern edge.', 67900, 89900),
  ((SELECT id FROM categories WHERE slug = 'outerwear'), 'Electric Storm Parka', 'electric-storm-parka', 'Weather the storm in style. This technical parka combines function with fierce aesthetics, featuring reflective details and bold color blocking.', 38900, 49900),

  -- Tops
  ((SELECT id FROM categories WHERE slug = 'tops'), 'Nocturne Mesh Tee', 'nocturne-tee', 'Translucent rebellion. This mesh overlay tee creates layers of mystery with its sheer panels and bold graphic elements.', 8900, 12900),
  ((SELECT id FROM categories WHERE slug = 'tops'), 'Voltage Crop Top', 'voltage-crop', 'High-voltage fashion. This cropped silhouette features electric blue accents and a fitted cut that demands attention.', 6900, 9900),
  ((SELECT id FROM categories WHERE slug = 'tops'), 'Shadow Play Hoodie', 'shadow-play-hoodie', 'Comfort meets edge. This oversized hoodie features gradient shadows and metallic details for effortless cool.', 15900, 21900),
  ((SELECT id FROM categories WHERE slug = 'tops'), 'Neon Dreams Tank', 'neon-dreams-tank', 'Vibrant energy in wearable form. This tank top glows with neon graphics and features a relaxed fit perfect for layering.', 4900, 7900),
  ((SELECT id FROM categories WHERE slug = 'tops'), 'Cyber Mesh Long Sleeve', 'cyber-mesh-long', 'Future-forward design meets street style. This long sleeve features cyber-inspired graphics and mesh panel details.', 11900, 15900),
  ((SELECT id FROM categories WHERE slug = 'tops'), 'Electric Pulse Bodysuit', 'electric-pulse-bodysuit', 'Second-skin sophistication. This bodysuit features electric blue piping and a sleek silhouette that hugs every curve.', 13900, 18900),

  -- Bottoms
  ((SELECT id FROM categories WHERE slug = 'bottoms'), 'Void Black Cargo Pants', 'void-cargo-pants', 'Utilitarian meets high fashion. These cargo pants feature multiple pockets, adjustable straps, and a tapered silhouette.', 18900, 24900),
  ((SELECT id FROM categories WHERE slug = 'bottoms'), 'Neon Stripe Leggings', 'neon-stripe-leggings', 'Movement with attitude. These high-waisted leggings feature bold neon stripes and compression fit technology.', 9900, 13900),
  ((SELECT id FROM categories WHERE slug = 'bottoms'), 'Rebel Denim Shorts', 'rebel-denim-shorts', 'Distressed perfection. These high-waisted shorts feature strategic rips and metallic hardware for edgy appeal.', 12900, 16900),
  ((SELECT id FROM categories WHERE slug = 'bottoms'), 'Electric Blue Joggers', 'electric-joggers', 'Comfort with a spark. These joggers feature electric blue panels and a relaxed fit perfect for urban exploration.', 14900, 19900),

  -- Dresses
  ((SELECT id FROM categories WHERE slug = 'dresses'), 'Midnight Slip Dress', 'midnight-slip', 'Effortless elegance with an edge. This silk slip dress features delicate chain straps and a bias cut that skims the body.', 24900, 32900),
  ((SELECT id FROM categories WHERE slug = 'dresses'), 'Neon Mesh Mini', 'neon-mesh-mini', 'Party-ready rebellion. This mini dress layers neon mesh over a fitted slip for a look that commands the dance floor.', 19900, 26900),
  ((SELECT id FROM categories WHERE slug = 'dresses'), 'Electric Storm Maxi', 'electric-storm-maxi', 'Drama in motion. This flowing maxi features electric blue gradients and cutout details for maximum impact.', 29900, 39900),
  ((SELECT id FROM categories WHERE slug = 'dresses'), 'Shadow Bodycon Dress', 'shadow-bodycon', 'Curves with attitude. This bodycon dress features shadow panels and metallic accents for a sleek silhouette.', 16900, 22900),

  -- Footwear
  ((SELECT id FROM categories WHERE slug = 'footwear'), 'Void Platform Boots', 'void-platform-boots', 'Elevate your rebellion. These platform boots feature chunky soles, buckle details, and premium leather construction.', 34900, 44900),
  ((SELECT id FROM categories WHERE slug = 'footwear'), 'Neon Pulse Sneakers', 'neon-pulse-sneakers', 'Step into the future. These high-tech sneakers feature LED accents and responsive cushioning technology.', 28900, 36900),
  ((SELECT id FROM categories WHERE slug = 'footwear'), 'Electric Stilettos', 'electric-stilettos', 'Power in every step. These statement heels feature metallic finishes and architectural design elements.', 39900, 52900),
  ((SELECT id FROM categories WHERE slug = 'footwear'), 'Midnight Combat Boots', 'midnight-combat-boots', 'Ready for anything. These combat boots combine military inspiration with fashion-forward details.', 26900, 34900),

  -- Accessories
  ((SELECT id FROM categories WHERE slug = 'accessories'), 'Neon Chain Necklace', 'neon-chain-necklace', 'Statement jewelry for the fearless. This chunky chain features neon accents and adjustable length.', 7900, 10900),
  ((SELECT id FROM categories WHERE slug = 'accessories'), 'Electric Cuff Bracelet', 'electric-cuff-bracelet', 'Power on your wrist. This wide cuff features electric blue inlays and geometric patterns.', 5900, 8900),
  ((SELECT id FROM categories WHERE slug = 'accessories'), 'Void Leather Belt', 'void-leather-belt', 'The perfect finishing touch. This wide leather belt features silver hardware and adjustable sizing.', 9900, 13900),
  ((SELECT id FROM categories WHERE slug = 'accessories'), 'Cyber Sunglasses', 'cyber-sunglasses', 'See the future clearly. These angular sunglasses feature mirrored lenses and futuristic frame design.', 12900, 16900);

-- Insert Product Images
INSERT INTO product_images (product_id, url, alt, position) VALUES
  -- Obsidian Trench Coat
  ((SELECT id FROM products WHERE slug = 'obsidian-trench'), 'https://picsum.photos/1200/1500?random=1&grayscale', 'Obsidian Trench Coat - Front View', 0),
  ((SELECT id FROM products WHERE slug = 'obsidian-trench'), 'https://picsum.photos/1200/1500?random=2', 'Obsidian Trench Coat - Side View', 1),
  ((SELECT id FROM products WHERE slug = 'obsidian-trench'), 'https://picsum.photos/1200/1500?random=3&grayscale', 'Obsidian Trench Coat - Back View', 2),
  ((SELECT id FROM products WHERE slug = 'obsidian-trench'), 'https://picsum.photos/1200/1500?random=4', 'Obsidian Trench Coat - Detail Shot', 3),

  -- Neon Rebellion Bomber
  ((SELECT id FROM products WHERE slug = 'neon-rebellion-bomber'), 'https://picsum.photos/1200/1500?random=5', 'Neon Rebellion Bomber - Front View', 0),
  ((SELECT id FROM products WHERE slug = 'neon-rebellion-bomber'), 'https://picsum.photos/1200/1500?random=6', 'Neon Rebellion Bomber - Back View', 1),
  ((SELECT id FROM products WHERE slug = 'neon-rebellion-bomber'), 'https://picsum.photos/1200/1500?random=7', 'Neon Rebellion Bomber - Detail Shot', 2),

  -- Midnight Leather Jacket
  ((SELECT id FROM products WHERE slug = 'midnight-leather'), 'https://picsum.photos/1200/1500?random=8&grayscale', 'Midnight Leather Jacket - Front View', 0),
  ((SELECT id FROM products WHERE slug = 'midnight-leather'), 'https://picsum.photos/1200/1500?random=9&grayscale', 'Midnight Leather Jacket - Side View', 1),
  ((SELECT id FROM products WHERE slug = 'midnight-leather'), 'https://picsum.photos/1200/1500?random=10', 'Midnight Leather Jacket - Detail Shot', 2),
  ((SELECT id FROM products WHERE slug = 'midnight-leather'), 'https://picsum.photos/1200/1500?random=11&grayscale', 'Midnight Leather Jacket - Back View', 3),

  -- Electric Storm Parka
  ((SELECT id FROM products WHERE slug = 'electric-storm-parka'), 'https://picsum.photos/1200/1500?random=12', 'Electric Storm Parka - Front View', 0),
  ((SELECT id FROM products WHERE slug = 'electric-storm-parka'), 'https://picsum.photos/1200/1500?random=13', 'Electric Storm Parka - Hood Up', 1),
  ((SELECT id FROM products WHERE slug = 'electric-storm-parka'), 'https://picsum.photos/1200/1500?random=14', 'Electric Storm Parka - Detail Shot', 2),

  -- Continue with more products...
  ((SELECT id FROM products WHERE slug = 'nocturne-tee'), 'https://picsum.photos/1200/1500?random=15&grayscale', 'Nocturne Mesh Tee - Front View', 0),
  ((SELECT id FROM products WHERE slug = 'nocturne-tee'), 'https://picsum.photos/1200/1500?random=16', 'Nocturne Mesh Tee - Back View', 1),
  ((SELECT id FROM products WHERE slug = 'nocturne-tee'), 'https://picsum.photos/1200/1500?random=17&grayscale', 'Nocturne Mesh Tee - Detail Shot', 2),

  ((SELECT id FROM products WHERE slug = 'voltage-crop'), 'https://picsum.photos/1200/1500?random=18', 'Voltage Crop Top - Front View', 0),
  ((SELECT id FROM products WHERE slug = 'voltage-crop'), 'https://picsum.photos/1200/1500?random=19', 'Voltage Crop Top - Side View', 1),
  ((SELECT id FROM products WHERE slug = 'voltage-crop'), 'https://picsum.photos/1200/1500?random=20', 'Voltage Crop Top - Detail Shot', 2),

  ((SELECT id FROM products WHERE slug = 'shadow-play-hoodie'), 'https://picsum.photos/1200/1500?random=21&grayscale', 'Shadow Play Hoodie - Front View', 0),
  ((SELECT id FROM products WHERE slug = 'shadow-play-hoodie'), 'https://picsum.photos/1200/1500?random=22&grayscale', 'Shadow Play Hoodie - Back View', 1),
  ((SELECT id FROM products WHERE slug = 'shadow-play-hoodie'), 'https://picsum.photos/1200/1500?random=23', 'Shadow Play Hoodie - Hood Detail', 2),

  ((SELECT id FROM products WHERE slug = 'void-platform-boots'), 'https://picsum.photos/1200/1500?random=24&grayscale', 'Void Platform Boots - Side View', 0),
  ((SELECT id FROM products WHERE slug = 'void-platform-boots'), 'https://picsum.photos/1200/1500?random=25&grayscale', 'Void Platform Boots - Front View', 1),
  ((SELECT id FROM products WHERE slug = 'void-platform-boots'), 'https://picsum.photos/1200/1500?random=26', 'Void Platform Boots - Detail Shot', 2),
  ((SELECT id FROM products WHERE slug = 'void-platform-boots'), 'https://picsum.photos/1200/1500?random=27&grayscale', 'Void Platform Boots - Sole Detail', 3);

-- Insert Variants
INSERT INTO variants (product_id, name, sku, price_cents, stock) VALUES
  -- Obsidian Trench Coat sizes
  ((SELECT id FROM products WHERE slug = 'obsidian-trench'), 'Size XS', 'OTC-XS-BLK', 45900, 5),
  ((SELECT id FROM products WHERE slug = 'obsidian-trench'), 'Size S', 'OTC-S-BLK', 45900, 8),
  ((SELECT id FROM products WHERE slug = 'obsidian-trench'), 'Size M', 'OTC-M-BLK', 45900, 12),
  ((SELECT id FROM products WHERE slug = 'obsidian-trench'), 'Size L', 'OTC-L-BLK', 45900, 10),
  ((SELECT id FROM products WHERE slug = 'obsidian-trench'), 'Size XL', 'OTC-XL-BLK', 45900, 6),

  -- Neon Rebellion Bomber sizes
  ((SELECT id FROM products WHERE slug = 'neon-rebellion-bomber'), 'Size S', 'NRB-S-NEO', 32900, 7),
  ((SELECT id FROM products WHERE slug = 'neon-rebellion-bomber'), 'Size M', 'NRB-M-NEO', 32900, 15),
  ((SELECT id FROM products WHERE slug = 'neon-rebellion-bomber'), 'Size L', 'NRB-L-NEO', 32900, 12),
  ((SELECT id FROM products WHERE slug = 'neon-rebellion-bomber'), 'Size XL', 'NRB-XL-NEO', 32900, 8),

  -- Void Platform Boots sizes
  ((SELECT id FROM products WHERE slug = 'void-platform-boots'), 'Size 6', 'VPB-6-BLK', 34900, 4),
  ((SELECT id FROM products WHERE slug = 'void-platform-boots'), 'Size 7', 'VPB-7-BLK', 34900, 6),
  ((SELECT id FROM products WHERE slug = 'void-platform-boots'), 'Size 8', 'VPB-8-BLK', 34900, 8),
  ((SELECT id FROM products WHERE slug = 'void-platform-boots'), 'Size 9', 'VPB-9-BLK', 34900, 7),
  ((SELECT id FROM products WHERE slug = 'void-platform-boots'), 'Size 10', 'VPB-10-BLK', 34900, 5),

  -- Nocturne Tee colors
  ((SELECT id FROM products WHERE slug = 'nocturne-tee'), 'Midnight Black', 'NT-M-BLK', 8900, 20),
  ((SELECT id FROM products WHERE slug = 'nocturne-tee'), 'Electric Blue', 'NT-M-ELE', 8900, 15),
  ((SELECT id FROM products WHERE slug = 'nocturne-tee'), 'Neon Purple', 'NT-M-NEO', 8900, 18);