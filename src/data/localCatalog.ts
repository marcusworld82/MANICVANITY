import { db, generateId, createSlug } from '../lib/database';

export interface LocalProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price: number;
  material: string;
  care_instructions: string;
  is_active: boolean;
  slug: string;
  created_at: string;
  images?: LocalProductImage[];
  variants?: LocalVariant[];
}

export interface LocalProductImage {
  id: string;
  product_id: string;
  image_url: string;
  position: number;
  is_primary: boolean;
  alt: string;
}

export interface LocalVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock_quantity: number;
  sku: string;
  price_modifier: number;
}

export interface LocalCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
}

// Category operations
export const getCategories = (): LocalCategory[] => {
  const stmt = db.prepare('SELECT * FROM categories ORDER BY name');
  return stmt.all() as LocalCategory[];
};

export const createCategory = (category: Omit<LocalCategory, 'id' | 'created_at'>) => {
  const stmt = db.prepare(`
    INSERT INTO categories (id, name, slug, description, image_url)
    VALUES (?, ?, ?, ?, ?)
  `);
  const id = generateId();
  stmt.run(id, category.name, category.slug, category.description, category.image_url);
  return id;
};

// Product operations
export const getProducts = (params: { 
  category?: string; 
  limit?: number; 
  offset?: number 
} = {}): LocalProduct[] => {
  let query = `
    SELECT p.*, 
           GROUP_CONCAT(DISTINCT pi.id || '|' || pi.image_url || '|' || pi.position || '|' || pi.is_primary || '|' || COALESCE(pi.alt, '')) as images,
           GROUP_CONCAT(DISTINCT v.id || '|' || v.size || '|' || v.color || '|' || v.stock_quantity || '|' || v.sku || '|' || v.price_modifier) as variants
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN variants v ON p.id = v.product_id
    WHERE p.is_active = 1
  `;
  
  const queryParams: any[] = [];
  
  if (params.category) {
    query += ' AND p.category = ?';
    queryParams.push(params.category);
  }
  
  query += ' GROUP BY p.id ORDER BY p.created_at DESC';
  
  if (params.limit) {
    query += ' LIMIT ?';
    queryParams.push(params.limit);
    
    if (params.offset) {
      query += ' OFFSET ?';
      queryParams.push(params.offset);
    }
  }

  const stmt = db.prepare(query);
  const products = stmt.all(...queryParams) as any[];

  return products.map(product => ({
    ...product,
    images: product.images ? product.images.split(',').map((img: string) => {
      const [id, image_url, position, is_primary, alt] = img.split('|');
      return {
        id,
        product_id: product.id,
        image_url,
        position: parseInt(position),
        is_primary: is_primary === '1',
        alt: alt || null
      };
    }).sort((a: any, b: any) => a.position - b.position) : [],
    variants: product.variants ? product.variants.split(',').map((variant: string) => {
      const [id, size, color, stock_quantity, sku, price_modifier] = variant.split('|');
      return {
        id,
        product_id: product.id,
        size,
        color,
        stock_quantity: parseInt(stock_quantity),
        sku,
        price_modifier: parseFloat(price_modifier)
      };
    }) : []
  }));
};

export const getProductBySlug = (slug: string): LocalProduct | null => {
  const products = getProducts();
  return products.find(p => p.slug === slug) || null;
};

export const createProduct = (product: Omit<LocalProduct, 'id' | 'created_at'>) => {
  const stmt = db.prepare(`
    INSERT INTO products (id, name, category, description, base_price, material, care_instructions, is_active, slug)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const id = generateId();
  stmt.run(
    id, 
    product.name, 
    product.category, 
    product.description, 
    product.base_price, 
    product.material, 
    product.care_instructions, 
    product.is_active ? 1 : 0, 
    product.slug
  );
  return id;
};

// Variant operations
export const createVariant = (variant: Omit<LocalVariant, 'id'>) => {
  const stmt = db.prepare(`
    INSERT INTO variants (id, product_id, size, color, stock_quantity, sku, price_modifier)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const id = generateId();
  stmt.run(
    id,
    variant.product_id,
    variant.size,
    variant.color,
    variant.stock_quantity,
    variant.sku,
    variant.price_modifier
  );
  return id;
};

// Product image operations
export const createProductImage = (image: Omit<LocalProductImage, 'id'>) => {
  const stmt = db.prepare(`
    INSERT INTO product_images (id, product_id, image_url, position, is_primary, alt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const id = generateId();
  stmt.run(
    id,
    image.product_id,
    image.image_url,
    image.position,
    image.is_primary ? 1 : 0,
    image.alt
  );
  return id;
};

// Format price helper
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Parse CSV and import products
export const importProductsFromCSV = () => {
  console.log('Starting product import...');
  
  // Import functionality moved to src/lib/database.ts
  // This function is kept for compatibility but does not perform actual imports
  console.log('Import functionality has been moved to the main database module');
  return {
    productsCreated: 0,
    variantsCreated: 0,
    imagesCreated: 0
  };
};

// Cart operations
export const getCartItems = (userId: string) => {
  const stmt = db.prepare(`
    SELECT ci.*, p.name as product_name, p.base_price, v.size, v.color, v.price_modifier
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN variants v ON ci.variant_id = v.id
    WHERE ci.user_id = ?
    ORDER BY ci.created_at DESC
  `);
  return stmt.all(userId);
};

export const addToCart = (userId: string, productId: string, variantId: string | null, quantity: number) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO cart_items (id, user_id, product_id, variant_id, quantity)
    VALUES (?, ?, ?, ?, ?)
  `);
  const id = generateId();
  stmt.run(id, userId, productId, variantId, quantity);
  return id;
};

export const updateCartQuantity = (cartItemId: string, quantity: number) => {
  if (quantity <= 0) {
    const stmt = db.prepare('DELETE FROM cart_items WHERE id = ?');
    stmt.run(cartItemId);
  } else {
    const stmt = db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?');
    stmt.run(quantity, cartItemId);
  }
};

export const clearCart = (userId: string) => {
  const stmt = db.prepare('DELETE FROM cart_items WHERE user_id = ?');
  stmt.run(userId);
};