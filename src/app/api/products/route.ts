import { NextResponse } from 'next/server';
import { getAuthenticatedUser, isUserAdmin, getServerSupabase } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase-server';

// GET /api/products
// Public: returns active products. Admin: returns all products if admin=true
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdminRequested = searchParams.get('admin') === 'true';

    let query = supabaseServer
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (isAdminRequested) {
      const user = await getAuthenticatedUser();
      if (!user || !isUserAdmin(user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      query = query.eq('status', 'Active');
    }

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(products || []);
  } catch (error: any) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/products
// Admin only: create a new product
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !isUserAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      category,
      brand,
      description,
      price,
      offerPrice,
      stock,
      ingredients,
      benefits,
      usage,
      skinType,
      weight,
      featured,
      status,
      images
    } = body;

    // Validation
    if (!name || !category || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Name, Category, Price, and Stock are required' }, { status: 400 });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice)) {
      return NextResponse.json({ error: 'Price must be numeric' }, { status: 400 });
    }

    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      return NextResponse.json({ error: 'Stock must be a non-negative number' }, { status: 400 });
    }

    let numOfferPrice = null;
    if (offerPrice !== undefined && offerPrice !== null && offerPrice !== '') {
      numOfferPrice = Number(offerPrice);
      if (isNaN(numOfferPrice)) {
        return NextResponse.json({ error: 'Offer price must be numeric' }, { status: 400 });
      }
    }

    // Auto-generate SKU
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const sku = `WRB-${randomSuffix}`;

    const newProduct = {
      name,
      sku,
      category,
      brand: brand || 'White Rose',
      description: description || null,
      price: numPrice,
      offerPrice: numOfferPrice,
      stock: numStock,
      ingredients: ingredients || null,
      benefits: benefits || null,
      usage: usage || null,
      skinType: skinType || null,
      weight: weight || null,
      featured: featured === true || featured === 'true' || featured === 'Yes',
      status: status === 'Draft' ? 'Draft' : 'Active',
      images: Array.isArray(images) ? images : [],
      image_url: Array.isArray(images) && images.length > 0 ? images[0] : null,
      rating: 5.0, // Default rating
      "createdAt": new Date().toISOString(),
      "updatedAt": new Date().toISOString()
    };

    const supabase = await getServerSupabase();
    const { data: insertedData, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(insertedData, { status: 201 });
  } catch (error: any) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
