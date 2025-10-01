@@ .. @@
 function mergeBySlug(a: Product[], b: Product[]): Product[] {
   const map = new Map<string, Product>()
   for (const p of a) map.set(p.slug, p)
   for (const p of b) map.set(p.slug, p)
   return Array.from(map.values())
 }
 
+// Cart and Order Types
+export interface CartItem {
+  id: string
+  productId: string
+  title: string
+  price: number
+  image: string
+  size?: string
+  color?: string
+  quantity: number
+}
+
+export interface ShippingAddress {
+  firstName: string
+  lastName: string
+  email: string
+  phone: string
+  address1: string
+  address2?: string
+  city: string
+  state: string
+  zipCode: string
+  country: string
+}
+
+export interface Order {
+  id: string
+  userId?: string
+  items: CartItem[]
+  shippingAddress: ShippingAddress
+  billingAddress: ShippingAddress
+  subtotal: number
+  shipping: number
+  tax: number
+  total: number
+  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
+  createdAt: string
+  estimatedDelivery: string
+}
+
+// Cart Management
+const CART_KEY = 'cart_items'
+const ORDERS_KEY = 'orders'
+
+export async function getCartItems(userId?: string): Promise<CartItem[]> {
+  if (typeof window === 'undefined') return []
+  const key = userId ? `${CART_KEY}_${userId}` : CART_KEY
+  const raw = localStorage.getItem(key)
+  try {
+    return raw ? JSON.parse(raw) : []
+  } catch {
+    return []
+  }
+}
+
+export async function saveCartItems(items: CartItem[], userId?: string): Promise<void> {
+  if (typeof window === 'undefined') return
+  const key = userId ? `${CART_KEY}_${userId}` : CART_KEY
+  localStorage.setItem(key, JSON.stringify(items))
+}
+
+export async function addToCart(product: Product, options: { size?: string; color?: string; quantity?: number } = {}, userId?: string): Promise<void> {
+  const items = await getCartItems(userId)
+  const existingIndex = items.findIndex(item => 
+    item.productId === product.id && 
+    item.size === options.size && 
+    item.color === options.color
+  )
+
+  if (existingIndex >= 0) {
+    items[existingIndex].quantity += options.quantity || 1
+  } else {
+    const newItem: CartItem = {
+      id: generateId(),
+      productId: String(product.id),
+      title: product.title,
+      price: product.price,
+      image: product.image1_url || '',
+      size: options.size,
+      color: options.color,
+      quantity: options.quantity || 1
+    }
+    items.push(newItem)
+  }
+
+  await saveCartItems(items, userId)
+}
+
+export async function updateCartItemQuantity(itemId: string, quantity: number, userId?: string): Promise<void> {
+  const items = await getCartItems(userId)
+  const index = items.findIndex(item => item.id === itemId)
+  
+  if (index >= 0) {
+    if (quantity <= 0) {
+      items.splice(index, 1)
+    } else {
+      items[index].quantity = quantity
+    }
+    await saveCartItems(items, userId)
+  }
+}
+
+export async function removeFromCart(itemId: string, userId?: string): Promise<void> {
+  const items = await getCartItems(userId)
+  const filtered = items.filter(item => item.id !== itemId)
+  await saveCartItems(filtered, userId)
+}
+
+export async function clearCart(userId?: string): Promise<void> {
+  await saveCartItems([], userId)
+}
+
+// Order Management
+export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery'>): Promise<Order> {
+  const order: Order = {
+    ...orderData,
+    id: generateId(),
+    createdAt: new Date().toISOString(),
+    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days from now
+  }
+
+  const orders = await getOrders(orderData.userId)
+  orders.unshift(order)
+  await saveOrders(orders, orderData.userId)
+
+  return order
+}
+
+export async function getOrders(userId?: string): Promise<Order[]> {
+  if (typeof window === 'undefined') return []
+  const key = userId ? `${ORDERS_KEY}_${userId}` : ORDERS_KEY
+  const raw = localStorage.getItem(key)
+  try {
+    return raw ? JSON.parse(raw) : []
+  } catch {
+    return []
+  }
+}
+
+export async function saveOrders(orders: Order[], userId?: string): Promise<void> {
+  if (typeof window === 'undefined') return
+  const key = userId ? `${ORDERS_KEY}_${userId}` : ORDERS_KEY
+  localStorage.setItem(key, JSON.stringify(orders))
+}
+
+export async function getOrderById(orderId: string, userId?: string): Promise<Order | null> {
+  const orders = await getOrders(userId)
+  return orders.find(order => order.id === orderId) || null
+}
+
 /* Very small CSV parser: supports quoted fields and commas */