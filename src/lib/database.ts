export type Product = {
  id: string | number
  title: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number | null
  currency?: string
  sku?: string
  barcode?: string
  inventory_qty?: number
  status?: 'active' | 'draft'
  category?: string
  tags?: string
  option1_name?: string
  option1_value?: string
  option2_name?: string
  option2_value?: string
  image1_url?: string
  image2_url?: string
  image3_url?: string
}

const STORAGE_KEY = 'products_dev'

export async function initializeDatabase(): Promise<void> {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
}

export async function getAllProducts(): Promise<Product[]> {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(STORAGE_KEY)
  try {
    return raw ? (JSON.parse(raw) as Product[]) : []
  } catch {
    return []
  }
}

export async function setAllProducts(items: Product[]): Promise<void> {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// Mock database object for browser compatibility
export const db = {
  prepare: (sql: string) => {
    console.warn('Database operations not available in browser environment:', sql)
    return {
      run: (...args: any[]) => console.warn('db.prepare().run() called with:', args),
      get: (...args: any[]) => {
        console.warn('db.prepare().get() called with:', args)
        return null
      },
      all: (...args: any[]) => {
        console.warn('db.prepare().all() called with:', args)
        return []
      }
    }
  }
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Export slugify as createSlug for compatibility
export const createSlug = slugify

/**
 * importProductsFromCSV
 * Parses a CSV string with headers and writes normalized products into storage.
 * Required headers: title, slug, price, image1_url
 * Optional headers match Product fields.
 */
export async function importProductsFromCSV(csvText: string): Promise<{ imported: number; errors: number; samples: Product[] }> {
  const rows = parseCSV(csvText)
  const products: Product[] = []
  let errors = 0

  for (const r of rows) {
    try {
      const title = val(r.product_name || r.title)
      const slug = slugify(val(r.slug) || title)
      const price = toNumber(val(r.base_price || r.price))
      const image1_url = val(r.image_url || r.image1_url) || `https://picsum.photos/800/1000?random=${Math.floor(Math.random() * 1000)}`

      if (!title || !slug || Number.isNaN(price)) throw new Error('Missing required fields')

      const p: Product = {
        id: val(r.id) || slug,
        title,
        slug,
        description: val(r.description),
        price: round2(price),
        compare_at_price: toNumberOrNull(val(r.compare_at_price)),
        currency: val(r.currency) || 'USD',
        sku: val(r.sku),
        barcode: val(r.barcode),
        inventory_qty: toInt(val(r.stock_quantity || r.inventory_qty), 10),
        status: (val(r.status) as any) || 'active',
        category: val(r.category),
        tags: val(r.tags),
        option1_name: val(r.size) ? 'Size' : val(r.option1_name),
        option1_value: val(r.size) || val(r.option1_value),
        option2_name: val(r.color) ? 'Color' : val(r.option2_name),
        option2_value: val(r.color) || val(r.option2_value),
        image1_url,
        image2_url: val(r.image2_url) || `https://picsum.photos/800/1000?random=${Math.floor(Math.random() * 1000) + 1000}`,
        image3_url: val(r.image3_url) || `https://picsum.photos/800/1000?random=${Math.floor(Math.random() * 1000) + 2000}`,
      }
      products.push(p)
    } catch {
      errors += 1
    }
  }

  const existing = await getAllProducts()
  const merged = mergeBySlug(existing, products)
  await setAllProducts(merged)

  return { imported: products.length, errors, samples: merged.slice(0, 3) }
}

/* Helpers */
function val(x: unknown): string {
  return typeof x === 'string' ? x.trim() : x == null ? '' : String(x).trim()
}
function toNumber(x: string): number { return Number.parseFloat(x) }
function toNumberOrNull(x: string): number | null {
  const n = Number.parseFloat(x)
  return Number.isNaN(n) ? null : n
}
function toInt(x: string, d = 0): number {
  const n = Number.parseInt(x, 10)
  return Number.isNaN(n) ? d : n
}
function round2(n: number): number { return Math.round(n * 100) / 100 }
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
function mergeBySlug(a: Product[], b: Product[]): Product[] {
  const map = new Map<string, Product>()
  for (const p of a) map.set(p.slug, p)
  for (const p of b) map.set(p.slug, p)
  return Array.from(map.values())
}

/* Very small CSV parser: supports quoted fields and commas */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length)
  if (lines.length === 0) return []
  const headers = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase())
  const out: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i])
    const row: Record<string, string> = {}
    for (let j = 0; j < headers.length; j++) row[headers[j]] = cols[j] ?? ''
    out.push(row)
  }
  return out
}
function splitCSVLine(line: string): string[] {
  const res: string[] = []
  let cur = ''
  let q = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"' ) {
      if (q && line[i+1] === '"') { cur += '"'; i++ } else { q = !q }
    } else if (ch === ',' && !q) {
      res.push(cur); cur = ''
    } else {
      cur += ch
    }
  }
  res.push(cur)
  return res
}

// Mock database object for browser compatibility
export const db = {
  prepare: (sql: string) => {
    console.warn('Database operations not available in browser environment:', sql)
    return {
      run: (...args: any[]) => console.warn('db.prepare().run() called with:', args),
      get: (...args: any[]) => {
        console.warn('db.prepare().get() called with:', args)
        return null
      },
      all: (...args: any[]) => {
        console.warn('db.prepare().all() called with:', args)
        return []
      }
    }
  }
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Export slugify as createSlug for compatibility
export const createSlug = slugify