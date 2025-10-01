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

// Load products from localStorage
const loadProductsFromStorage = (): LocalProduct[] => {
  try {
    const stored = localStorage.getItem('manicvanity-products');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Load categories from localStorage
const loadCategoriesFromStorage = (): LocalCategory[] => {
  try {
    const stored = localStorage.getItem('manicvanity-categories');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Category operations
export const getCategories = (): LocalCategory[] => {
  return loadCategoriesFromStorage();
};

export const createCategory = (category: Omit<LocalCategory, 'id' | 'created_at'>) => {
  const id = generateId();
  const newCategory: LocalCategory = {
    ...category,
    id,
    created_at: new Date().toISOString()
  };
  
  const categories = loadCategoriesFromStorage();
  categories.push(newCategory);
  localStorage.setItem('manicvanity-categories', JSON.stringify(categories));
  
  return id;
};

// Product operations
export const getProducts = (params: { 
  category?: string; 
  limit?: number; 
  offset?: number 
} = {}): LocalProduct[] => {
  let products = loadProductsFromStorage().filter(p => p.is_active);
  
  if (params.category) {
    products = products.filter(p => p.category === params.category);
  }
  
  // Sort by created_at desc
  products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  if (params.limit) {
    const start = params.offset || 0;
    products = products.slice(start, start + params.limit);
  }

  return products;
};

export const getProductBySlug = (slug: string): LocalProduct | null => {
  const products = getProducts();
  return products.find(p => p.slug === slug) || null;
};

export const createProduct = (product: Omit<LocalProduct, 'id' | 'created_at'>) => {
  const id = generateId();
  const newProduct: LocalProduct = {
    ...product,
    id,
    created_at: new Date().toISOString()
  };
  
  const products = loadProductsFromStorage();
  products.push(newProduct);
  localStorage.setItem('manicvanity-products', JSON.stringify(products));
  
  return id;
};

// Variant operations
export const createVariant = (variant: Omit<LocalVariant, 'id'>) => {
  const id = generateId();
  // This would update the product's variants array in localStorage
  console.log('Creating variant:', { id, ...variant });
  return id;
};

// Product image operations
export const createProductImage = (image: Omit<LocalProductImage, 'id'>) => {
  const id = generateId();
  // This would update the product's images array in localStorage
  console.log('Creating image:', { id, ...image });
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
  
  // Create sample products for MANICVANITY
  const sampleProducts: LocalProduct[] = [
    {
      id: 'arrogance-tee',
      name: 'Arrogance Tee',
      category: 'Apparel',
      description: 'Bold statement piece that embodies confidence and attitude. Premium cotton construction with striking graphics.',
      base_price: 29.99,
      material: '100% Cotton',
      care_instructions: 'Machine wash cold, tumble dry low',
      is_active: true,
      slug: 'arrogance-tee',
      created_at: new Date().toISOString(),
      images: [
        {
          id: 'arr-img-1',
          product_id: 'arrogance-tee',
          image_url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
          position: 0,
          is_primary: true,
          alt: 'Arrogance Tee front view'
        },
        {
          id: 'arr-img-2',
          product_id: 'arrogance-tee',
          image_url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
          position: 1,
          is_primary: false,
          alt: 'Arrogance Tee back view'
        }
      ],
      variants: [
        { id: 'arr-xs', product_id: 'arrogance-tee', size: 'XS', color: 'Black', stock_quantity: 5, sku: 'ARR-XS-BLK', price_modifier: 0 },
        { id: 'arr-s', product_id: 'arrogance-tee', size: 'S', color: 'Black', stock_quantity: 8, sku: 'ARR-S-BLK', price_modifier: 0 },
        { id: 'arr-m', product_id: 'arrogance-tee', size: 'M', color: 'Black', stock_quantity: 12, sku: 'ARR-M-BLK', price_modifier: 0 },
        { id: 'arr-l', product_id: 'arrogance-tee', size: 'L', color: 'Black', stock_quantity: 10, sku: 'ARR-L-BLK', price_modifier: 0 },
        { id: 'arr-xl', product_id: 'arrogance-tee', size: 'XL', color: 'Black', stock_quantity: 6, sku: 'ARR-XL-BLK', price_modifier: 0 }
      ]
    },
    {
      id: 'gas-mask-original',
      name: 'Gas Mask Original',
      category: 'Apparel',
      description: 'Iconic design that started it all. Edgy graphics meet premium comfort in this signature piece.',
      base_price: 34.99,
      material: '100% Cotton',
      care_instructions: 'Machine wash cold, tumble dry low',
      is_active: true,
      slug: 'gas-mask-original',
      created_at: new Date().toISOString(),
      images: [
        {
          id: 'gas-img-1',
          product_id: 'gas-mask-original',
          image_url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800',
          position: 0,
          is_primary: true,
          alt: 'Gas Mask Original front'
        },
        {
          id: 'gas-img-2',
          product_id: 'gas-mask-original',
          image_url: 'https://images.pexels.com/photos/1006202/pexels-photo-1006202.jpeg?auto=compress&cs=tinysrgb&w=800',
          position: 1,
          is_primary: false,
          alt: 'Gas Mask Original detail'
        }
      ],
      variants: [
        { id: 'gas-xs-mar', product_id: 'gas-mask-original', size: 'XS', color: 'Maroon', stock_quantity: 3, sku: 'GAS-XS-MAR', price_modifier: 0 },
        { id: 'gas-s-mar', product_id: 'gas-mask-original', size: 'S', color: 'Maroon', stock_quantity: 5, sku: 'GAS-S-MAR', price_modifier: 0 },
        { id: 'gas-m-mar', product_id: 'gas-mask-original', size: 'M', color: 'Maroon', stock_quantity: 7, sku: 'GAS-M-MAR', price_modifier: 0 },
        { id: 'gas-l-blk', product_id: 'gas-mask-original', size: 'L', color: 'Black/Purple', stock_quantity: 4, sku: 'GAS-L-BLK', price_modifier: 2 }
      ]
    },
    {
      id: 'established-crewneck',
      name: 'Established Crewneck',
      category: 'Apparel',
      description: 'Classic comfort meets street style. Premium heavyweight cotton in multiple colorways.',
      base_price: 39.99,
      material: '100% Cotton',
      care_instructions: 'Machine wash cold, tumble dry low',
      is_active: true,
      slug: 'established-crewneck',
      created_at: new Date().toISOString(),
      images: [
        {
          id: 'est-img-1',
          product_id: 'established-crewneck',
          image_url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
          position: 0,
          is_primary: true,
          alt: 'Established Crewneck front'
        }
      ],
      variants: [
        { id: 'est-s-blk', product_id: 'established-crewneck', size: 'S', color: 'Black', stock_quantity: 8, sku: 'EST-S-BLK', price_modifier: 0 },
        { id: 'est-m-blk', product_id: 'established-crewneck', size: 'M', color: 'Black', stock_quantity: 12, sku: 'EST-M-BLK', price_modifier: 0 },
        { id: 'est-l-red', product_id: 'established-crewneck', size: 'L', color: 'Red', stock_quantity: 6, sku: 'EST-L-RED', price_modifier: 0 },
        { id: 'est-xl-grn', product_id: 'established-crewneck', size: 'XL', color: 'Green', stock_quantity: 4, sku: 'EST-XL-GRN', price_modifier: 0 }
      ]
    }
  ];

  // Store sample products in localStorage
  localStorage.setItem('manicvanity-products', JSON.stringify(sampleProducts));
  localStorage.setItem('manicvanity-categories', JSON.stringify([
    { id: 'apparel', name: 'Apparel', slug: 'apparel', description: 'Premium streetwear and fashion', image_url: '', created_at: new Date().toISOString() }
  ]));
  
  return {
    productsCreated: sampleProducts.length,
    variantsCreated: sampleProducts.reduce((total, p) => total + (p.variants?.length || 0), 0),
    imagesCreated: sampleProducts.reduce((total, p) => total + (p.images?.length || 0), 0)
  };
};

// Cart operations
export const getCartItems = (userId: string) => {
  try {
    const cartKey = `manicvanity-cart-${userId}`;
    const stored = localStorage.getItem(cartKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addToCart = (userId: string, productId: string, variantId: string | null, quantity: number) => {
  const id = generateId();
  const cartKey = `manicvanity-cart-${userId}`;
  const cartItems = getCartItems(userId);
  
  // Check if item already exists
  const existingIndex = cartItems.findIndex((item: any) => 
    item.product_id === productId && item.variant_id === variantId
  );
  
  if (existingIndex >= 0) {
    cartItems[existingIndex].quantity += quantity;
  } else {
    cartItems.push({
      id,
      user_id: userId,
      product_id: productId,
      variant_id: variantId,
      quantity,
      created_at: new Date().toISOString()
    });
  }
  
  localStorage.setItem(cartKey, JSON.stringify(cartItems));
  return id;
};

export const updateCartQuantity = (cartItemId: string, quantity: number) => {
  // This would update the specific cart item in localStorage
  console.log('Updating cart quantity:', cartItemId, quantity);
};

export const clearCart = (userId: string) => {
  const cartKey = `manicvanity-cart-${userId}`;
  localStorage.removeItem(cartKey);
};