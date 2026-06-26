import { NextResponse } from 'next/server';
import { getAuthenticatedUser, isUserAdmin, getServerSupabase } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase-server';

// GET /api/products/[id]
// Public for Active products. Admin only for Draft products.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data: product, error } = await supabaseServer
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // If product is Draft, verify admin authorization
    if (product.status === 'Draft') {
      const user = await getAuthenticatedUser();
      if (!user || !isUserAdmin(user.email)) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product GET by ID error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/products/[id]
// Admin only: update an existing product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updatedProduct = {
      name,
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
      "updatedAt": new Date().toISOString()
    };

    const supabase = await getServerSupabase();
    const { data: updatedData, error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(updatedData);
  } catch (error: any) {
    console.error('Product PUT error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/products/[id]
// Admin only: delete a product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    if (!user || !isUserAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await getServerSupabase();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Product Deleted Successfully' });
  } catch (error: any) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
