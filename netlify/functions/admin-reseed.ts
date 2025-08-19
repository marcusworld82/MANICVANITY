import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check admin secret
  const adminSecret = event.headers['x-admin-secret'];
  if (adminSecret !== process.env.NETLIFY_ADMIN_SECRET) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    // Check current product count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productCount && productCount >= 24) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Products already seeded',
          count: productCount 
        }),
      };
    }

    // Get categories
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug');

    if (!categories || categories.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No categories found. Run schema and seed first.' }),
      };
    }

    // Generate additional products
    const additionalProducts = [];
    const startIndex = productCount || 0;

    for (let i = startIndex; i < 48; i++) {
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      
      additionalProducts.push({
        category_id: category.id,
        name: `Generated Product ${i + 1}`,
        slug: `generated-product-${i + 1}`,
        description: `A stunning piece from our generated collection. This item embodies the MANIC VANITY aesthetic with its bold design and premium materials.`,
        price_cents: Math.floor(Math.random() * 40000) + 5000, // $50-$450
        compare_at_cents: Math.floor(Math.random() * 10000) + 45000, // Sometimes higher
        currency: 'usd',
      });
    }

    // Insert products
    const { data: newProducts, error: productsError } = await supabase
      .from('products')
      .insert(additionalProducts)
      .select('id, slug');

    if (productsError) {
      throw new Error(`Failed to insert products: ${productsError.message}`);
    }

    // Add images for new products
    const productImages = [];
    for (const product of newProducts || []) {
      const imageCount = Math.floor(Math.random() * 4) + 2; // 2-5 images
      for (let j = 0; j < imageCount; j++) {
        const randomId = Math.floor(Math.random() * 1000) + 1;
        productImages.push({
          product_id: product.id,
          url: `https://picsum.photos/1200/1500?random=${randomId + j}`,
          alt: `${product.slug} image ${j + 1}`,
          position: j,
        });
      }
    }

    if (productImages.length > 0) {
      await supabase.from('product_images').insert(productImages);
    }

    // Restock low variants
    await supabase
      .from('variants')
      .update({ stock: Math.floor(Math.random() * 50) + 10 })
      .lt('stock', 5);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Reseed completed',
        productsAdded: newProducts?.length || 0,
        imagesAdded: productImages.length
      }),
    };

  } catch (error) {
    console.error('Reseed error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Reseed failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};