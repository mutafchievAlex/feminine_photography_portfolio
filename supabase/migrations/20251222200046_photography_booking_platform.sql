-- Location: supabase/migrations/20251222200046_photography_booking_platform.sql
-- Schema Analysis: Fresh database - no existing schema
-- Integration Type: Complete photography booking platform with authentication
-- Dependencies: None (fresh project)

-- ===============================
-- 1. ENUMS & TYPES
-- ===============================

CREATE TYPE public.user_role AS ENUM ('admin', 'client');

CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'confirmed', 
    'completed',
    'cancelled'
);

CREATE TYPE public.session_type AS ENUM (
    'wedding',
    'maternity',
    'family',
    'engagement',
    'individual',
    'corporate',
    'newborn',
    'other'
);

CREATE TYPE public.location_preference AS ENUM (
    'studio',
    'outdoor',
    'home',
    'venue',
    'flexible'
);

CREATE TYPE public.gallery_category AS ENUM (
    'weddings',
    'maternity',
    'family',
    'portraits',
    'corporate',
    'events'
);

-- ===============================
-- 2. CORE TABLES
-- ===============================

-- User Profiles (intermediary table for auth)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'client'::public.user_role,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Booking Consultations
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    session_type public.session_type NOT NULL,
    preferred_date DATE NOT NULL,
    alternate_date DATE,
    location public.location_preference,
    vision TEXT,
    inspiration TEXT,
    special_requests TEXT,
    marketing_consent BOOLEAN DEFAULT false,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images
CREATE TABLE public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category public.gallery_category NOT NULL,
    alt_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Activity Log (for admin dashboard)
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 3. INDEXES
-- ===============================

CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

CREATE INDEX idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_preferred_date ON public.bookings(preferred_date);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);

CREATE INDEX idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX idx_gallery_images_is_featured ON public.gallery_images(is_featured);
CREATE INDEX idx_gallery_images_display_order ON public.gallery_images(display_order);

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ===============================
-- 4. FUNCTIONS (BEFORE RLS POLICIES)
-- ===============================

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, phone, role, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'client'::public.user_role),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
    activity_type_param TEXT,
    description_param TEXT,
    metadata_param JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.activity_logs (user_id, activity_type, description, metadata)
    VALUES (auth.uid(), activity_type_param, description_param, metadata_param);
END;
$$;

-- ===============================
-- 5. ENABLE RLS
-- ===============================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ===============================
-- 6. RLS POLICIES
-- ===============================

-- User Profiles Policies (Pattern 1: Core user table)
CREATE POLICY "users_view_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "users_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "admins_view_all_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Bookings Policies
CREATE POLICY "clients_view_own_bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (client_id = auth.uid());

CREATE POLICY "clients_create_bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (client_id = auth.uid());

CREATE POLICY "clients_update_own_bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (client_id = auth.uid())
WITH CHECK (client_id = auth.uid());

CREATE POLICY "admins_manage_all_bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Gallery Images Policies (Public read, admin write)
CREATE POLICY "public_view_gallery_images"
ON public.gallery_images
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_gallery_images"
ON public.gallery_images
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Activity Logs Policies
CREATE POLICY "users_view_own_activity"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "admins_view_all_activity"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "authenticated_users_create_activity"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ===============================
-- 7. TRIGGERS
-- ===============================

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at timestamp
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
    BEFORE UPDATE ON public.gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===============================
-- 8. MOCK DATA
-- ===============================

DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    client_uuid UUID := gen_random_uuid();
    booking1_uuid UUID := gen_random_uuid();
    booking2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'elena@elenarosephotography.bg', crypt('elena2024', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Elena Rose", "phone": "+359 888 123 456", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (client_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'maria.petrova@example.com', crypt('maria2024', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Мария Петрова", "phone": "+359 888 999 888", "role": "client"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample bookings
    INSERT INTO public.bookings (
        id, client_id, full_name, email, phone, session_type, 
        preferred_date, alternate_date, location, vision, 
        inspiration, special_requests, status
    ) VALUES
        (booking1_uuid, client_uuid, 'Мария Петрова', 'maria.petrova@example.com', 
         '+359 888 999 888', 'maternity', '2025-01-15', '2025-01-22', 'outdoor',
         'Искам нежна фотосесия в природата с романтично усещане',
         'Вдъхновена съм от вашите снимки с естествена светлина',
         'Бих искала да включим моя съпруг в някои от снимките', 'pending'),
        (booking2_uuid, client_uuid, 'Стефан Николов', 'stefan.nikolov@example.com',
         '+359 888 777 666', 'wedding', '2025-02-14', '2025-02-21', 'venue',
         'Търсим фотограф за нашата сватба във Витоша',
         'Обичам естествения ви стил на заснемане',
         'Церемонията ще бъде в планина', 'confirmed');

    -- Create sample gallery images
    INSERT INTO public.gallery_images (
        title, description, image_url, thumbnail_url, category, 
        alt_text, display_order, is_featured, uploaded_by
    ) VALUES
        ('Golden Hour Wedding', 'Beautiful outdoor wedding at sunset', 
         'https://images.unsplash.com/photo-1519741497674-611481863552', 
         'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
         'weddings', 'Bride and groom during golden hour sunset', 1, true, admin_uuid),
        ('Maternity Glow', 'Expecting mother in nature', 
         'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22',
         'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=400',
         'maternity', 'Pregnant woman in white dress in natural setting', 2, true, admin_uuid),
        ('Family Joy', 'Happy family portrait in park',
         'https://images.unsplash.com/photo-1511895426328-dc8714191300',
         'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
         'family', 'Family of four smiling in outdoor park setting', 3, false, admin_uuid);

    -- Create sample activity logs
    INSERT INTO public.activity_logs (user_id, activity_type, description, metadata)
    VALUES
        (client_uuid, 'booking_created', 'Нова резервация за фотосесия', 
         jsonb_build_object('booking_id', booking1_uuid, 'session_type', 'maternity')),
        (admin_uuid, 'booking_confirmed', 'Потвърдена резервация за сватба',
         jsonb_build_object('booking_id', booking2_uuid, 'session_type', 'wedding')),
        (admin_uuid, 'gallery_image_added', 'Добавена нова снимка в галерията',
         jsonb_build_object('category', 'weddings', 'title', 'Golden Hour Wedding'));

END $$;