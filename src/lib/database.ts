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

export async function importProductsFromCSV(csvText: string): Promise<{ imported: number; errors: number }> {
  const rows = parseCSV(csvText)
  const products: Product[] = []
  let errors = 0

  for (const r of rows) {
    try {
      const title = val(r.title)
      const slug = slugify(val(r.slug) || title)
      const price = toNumber(val(r.price))
      const image1_url = val(r.image1_url)

      if (!title || !slug || Number.isNaN(price) || !image1_url) throw new Error('Missing required fields')

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
        inventory_qty: toInt(val(r.inventory_qty), 0),
        status: (val(r.status) as any) || 'active',
        category: val(r.category),
        tags: val(r.tags),
        option1_name: val(r.option1_name),
        option1_value: val(r.option1_value),
        option2_name: val(r.option2_name),
        option2_value: val(r.option2_value),
        image1_url,
        image2_url: val(r.image2_url),
        image3_url: val(r.image3_url),
      }
      products.push(p)
    } catch {
      errors += 1
    }
  }

  const existing = await getAllProducts()
  const merged = mergeBySlug(existing, products)
  await setAllProducts(merged)

  return { imported: products.length, errors }
}

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