-- ====================================================================
-- Supabase Row Level Security (RLS) & Storage Policies Configuration
-- This file translates the Firebase security rules (from firestore.rules
-- and storage.rules) into equivalent PostgreSQL RLS Policies.
-- Run this script in the Supabase SQL Editor.
-- ====================================================================

-- ── 1. HELPER FUNCTIONS ──────────────────────────────────────────────

-- Helper function to check if the authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE uid = auth.uid()::text AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if the authenticated user is a rider
CREATE OR REPLACE FUNCTION public.is_rider()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE uid = auth.uid()::text AND role = 'rider'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ── 2. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES ────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;


-- ── 3. USERS TABLE POLICIES ──────────────────────────────────────────

-- Users can view their own profile; Admins can view all profiles
CREATE POLICY "View user profile" ON public.users
    FOR SELECT TO authenticated
    USING (uid = auth.uid()::text OR public.is_admin());

-- Users can update their own profile; Admins can update any profile
CREATE POLICY "Update user profile" ON public.users
    FOR UPDATE TO authenticated
    USING (uid = auth.uid()::text OR public.is_admin())
    WITH CHECK (uid = auth.uid()::text OR public.is_admin());

-- Anyone can insert a profile during signup (required for auth flow)
CREATE POLICY "Insert user profile" ON public.users
    FOR INSERT TO authenticated
    WITH CHECK (true);


-- ── 4. CATEGORIES TABLE POLICIES ─────────────────────────────────────

-- Anyone (including anonymous users) can view categories
CREATE POLICY "Public view categories" ON public.categories
    FOR SELECT TO public
    USING (true);

-- Only Admins can modify categories
CREATE POLICY "Admin modify categories" ON public.categories
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());


-- ── 5. PRODUCTS TABLE POLICIES ───────────────────────────────────────

-- Anyone (including anonymous users) can view products
CREATE POLICY "Public view products" ON public.products
    FOR SELECT TO public
    USING (true);

-- Only Admins can modify products
CREATE POLICY "Admin modify products" ON public.products
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());


-- ── 6. ADDRESSES TABLE POLICIES ──────────────────────────────────────

-- Users can view their own addresses; Admins can view all
CREATE POLICY "View addresses" ON public.addresses
    FOR SELECT TO authenticated
    USING (user_id = auth.uid()::text OR public.is_admin());

-- Users can modify their own addresses; Admins can modify all
CREATE POLICY "Modify addresses" ON public.addresses
    FOR ALL TO authenticated
    USING (user_id = auth.uid()::text OR public.is_admin())
    WITH CHECK (user_id = auth.uid()::text OR public.is_admin());


-- ── 7. ORDERS TABLE POLICIES ─────────────────────────────────────────

-- Users can view their own orders; Riders can view assigned orders; Admins can view all
CREATE POLICY "View orders" ON public.orders
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid()::text 
        OR rider_id = auth.uid()::text 
        OR public.is_admin()
    );

-- Users can insert their own orders
CREATE POLICY "Create orders" ON public.orders
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid()::text);

-- Admins and assigned Riders can update orders (e.g. status updates)
CREATE POLICY "Update orders" ON public.orders
    FOR UPDATE TO authenticated
    USING (
        user_id = auth.uid()::text 
        OR rider_id = auth.uid()::text 
        OR public.is_admin()
    )
    WITH CHECK (
        user_id = auth.uid()::text 
        OR rider_id = auth.uid()::text 
        OR public.is_admin()
    );


-- ── 8. RIDERS TABLE POLICIES ─────────────────────────────────────────

-- Authenticated users (customers/admins) can view riders to track deliveries
CREATE POLICY "View riders status" ON public.riders
    FOR SELECT TO authenticated
    USING (true);

-- Riders can update their own status/location; Admins can modify all
CREATE POLICY "Modify rider status" ON public.riders
    FOR ALL TO authenticated
    USING (id = auth.uid()::text OR public.is_admin())
    WITH CHECK (id = auth.uid()::text OR public.is_admin());


-- ── 9. NOTIFICATIONS TABLE POLICIES ──────────────────────────────────

-- Users can view and update their own notifications (e.g. marking read)
CREATE POLICY "Manage notifications" ON public.notifications
    FOR ALL TO authenticated
    USING (user_id = auth.uid()::text OR public.is_admin())
    WITH CHECK (user_id = auth.uid()::text OR public.is_admin());


-- ── 10. STORAGE BUCKETS & POLICIES (FOR PRODUCTS IMAGES) ─────────────

-- Create the 'products' storage bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects table (usually enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to files in 'products' bucket
CREATE POLICY "Public Read Product Images" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'products');

-- Allow only Admins to upload files to 'products' bucket
CREATE POLICY "Admin Upload Product Images" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'products' AND public.is_admin());

-- Allow only Admins to update files in 'products' bucket
CREATE POLICY "Admin Update Product Images" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'products' AND public.is_admin());

-- Allow only Admins to delete files from 'products' bucket
CREATE POLICY "Admin Delete Product Images" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'products' AND public.is_admin());
