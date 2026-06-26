-- SQL Migration: Add missing columns to products table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/dchnqqqzstrglofnuvwb/sql/new)

-- 1. Add columns to products table if they do not exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS "offerPrice" DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS ingredients TEXT,
ADD COLUMN IF NOT EXISTS benefits TEXT,
ADD COLUMN IF NOT EXISTS "usage" TEXT,
ADD COLUMN IF NOT EXISTS "skinType" TEXT,
ADD COLUMN IF NOT EXISTS weight TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Draft')),
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Populate columns for existing products with fallback values
UPDATE products 
SET 
  sku = COALESCE(sku, 'WRB-' || UPPER(SUBSTRING(id::text, 1, 8))),
  brand = COALESCE(brand, 'White Rose'),
  status = COALESCE(status, 'Active'),
  featured = COALESCE(featured, FALSE),
  images = CASE 
    WHEN images IS NULL OR array_length(images, 1) IS NULL THEN 
      CASE WHEN image_url IS NOT NULL THEN ARRAY[image_url] ELSE '{}'::TEXT[] END
    ELSE images
  END,
  "createdAt" = COALESCE("createdAt", created_at, NOW()),
  "updatedAt" = COALESCE("updatedAt", NOW());

-- 3. Set NOT NULL or default constraints if needed
ALTER TABLE products ALTER COLUMN sku SET NOT NULL;
ALTER TABLE products ALTER COLUMN featured SET DEFAULT FALSE;
ALTER TABLE products ALTER COLUMN status SET DEFAULT 'Active';
ALTER TABLE products ALTER COLUMN images SET DEFAULT '{}';
