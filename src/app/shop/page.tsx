import React, { Suspense } from 'react';
import ShopContent from './ShopContent';
import { getProductsServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
  const products = await getProductsServer();

  return (
    <Suspense fallback={<div className="pt-40 text-center uppercase tracking-widest opacity-30">Loading Collection...</div>}>
      <ShopContent initialProducts={products || []} />
    </Suspense>
  );
}
