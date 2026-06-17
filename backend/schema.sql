-- Supabase PostgreSQL Schema for Virtual Try-On SaaS
-- Execute this script in your Supabase SQL Editor

-- 1. Create Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    brand_name VARCHAR(255) NOT NULL,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Catalog Items Table
CREATE TABLE IF NOT EXISTS public.catalog_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Generations Table
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    catalog_item_id UUID REFERENCES public.catalog_items(id) ON DELETE CASCADE,
    user_image_url TEXT NOT NULL,
    result_image_url TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) Policies

-- Brands Policy: Only the brand owner can see/edit their brand profile
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand owners can manage their own profile" 
ON public.brands FOR ALL USING (auth.uid() = user_id);

-- Catalog Policy: Anyone can view active catalog items, but only owners can edit
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active catalog items" 
ON public.catalog_items FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Brand owners can manage their catalog" 
ON public.catalog_items FOR ALL USING (
    brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid())
);

-- Generations Policy: Users can only see and create their own generation requests
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own generations" 
ON public.generations FOR ALL USING (auth.uid() = user_id);

-- Note: Ensure Supabase Storage buckets "user-uploads" and "catalog-images" are created manually via the dashboard.
