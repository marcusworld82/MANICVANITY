import Database from 'better-sqlite3';
import path from 'path';

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'manicvanity.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Database schema
export const initializeDatabase = () => {
  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      base_price REAL NOT NULL,
      material TEXT,
      care_instructions TEXT,
      is_active BOOLEAN DEFAULT 1,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category) REFERENCES categories(slug)
    )
  `);

  // Product images table
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      is_primary BOOLEAN DEFAULT 0,
      alt TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Variants table
  db.exec(`
    CREATE TABLE IF NOT EXISTS variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      size TEXT NOT NULL,
      color TEXT NOT NULL,
      stock_quantity INTEGER DEFAULT 0,
      sku TEXT UNIQUE NOT NULL,
      price_modifier REAL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      shipping_address TEXT,
      billing_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Order items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      quantity INTEGER NOT NULL,
      price_at_purchase REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (variant_id) REFERENCES variants(id)
    )
  `);

  // Cart items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      quantity INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE CASCADE
    )
  `);

  // Users table for authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully');
};

// Helper functions
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};