-- SECURITY HARDENING: Row Level Security (RLS) Master Policy
-- Target: wikIA Core Technical Tables
-- Objective: Ensure zero-trust public access (Read-Only) and block all unauthorized writes.

-- 1. Enable RLS on all core tables
ALTER TABLE IF EXISTS public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.model_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.model_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dictionary ENABLE ROW LEVEL SECURITY;

-- 2. Clear existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read-only access" ON public.models;
DROP POLICY IF EXISTS "Public select" ON public.models;
DROP POLICY IF EXISTS "Public select" ON public.model_details;
DROP POLICY IF EXISTS "Public select" ON public.categories;
DROP POLICY IF EXISTS "Public select" ON public.model_categories;
DROP POLICY IF EXISTS "Public select" ON public.dictionary;

-- 3. Create strictly READ-ONLY policies for anonymous users (Public)

-- Models
CREATE POLICY "Public Read-Only Access" 
ON public.models FOR SELECT 
TO anon, authenticated
USING (true);

-- Model Details (Deep technical specs)
CREATE POLICY "Public Read-Only Access" 
ON public.model_details FOR SELECT 
TO anon, authenticated
USING (true);

-- Categories
CREATE POLICY "Public Read-Only Access" 
ON public.categories FOR SELECT 
TO anon, authenticated
USING (true);

-- Model-Category Relations
CREATE POLICY "Public Read-Only Access" 
ON public.model_categories FOR SELECT 
TO anon, authenticated
USING (true);

-- Technical Dictionary
CREATE POLICY "Public Read-Only Access" 
ON public.dictionary FOR SELECT 
TO anon, authenticated
USING (true);

-- 4. Explicitly block all other operations for 'anon' role
-- Note: By default, if no INSERT/UPDATE/DELETE policy exists, Supabase blocks them.
-- However, we can be explicit for auditing purposes if needed.

-- Verification Query:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
