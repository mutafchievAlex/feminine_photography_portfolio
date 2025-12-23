-- Location: supabase/migrations/20251222213712_album_management.sql
-- Schema Analysis: Existing tables - user_profiles, gallery_images, bookings, activity_logs
-- Integration Type: addition
-- Dependencies: user_profiles (for created_by), gallery_images (for photo references)

-- Create albums table
CREATE TABLE public.albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    session_type public.session_type,
    client_name TEXT,
    session_date DATE,
    location TEXT,
    is_published BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create album_photos junction table (links albums to gallery_images)
CREATE TABLE public.album_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE,
    image_id UUID REFERENCES public.gallery_images(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    caption TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(album_id, image_id)
);

-- Create indexes for performance
CREATE INDEX idx_albums_created_by ON public.albums(created_by);
CREATE INDEX idx_albums_session_type ON public.albums(session_type);
CREATE INDEX idx_albums_display_order ON public.albums(display_order);
CREATE INDEX idx_albums_is_published ON public.albums(is_published);
CREATE INDEX idx_album_photos_album_id ON public.album_photos(album_id);
CREATE INDEX idx_album_photos_image_id ON public.album_photos(image_id);
CREATE INDEX idx_album_photos_display_order ON public.album_photos(display_order);

-- Enable RLS
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for albums
CREATE POLICY "public_view_published_albums" ON public.albums
FOR SELECT TO public
USING (is_published = true);

CREATE POLICY "admins_manage_albums" ON public.albums
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- RLS Policies for album_photos
CREATE POLICY "public_view_album_photos" ON public.album_photos
FOR SELECT TO public
USING (
    EXISTS (
        SELECT 1 FROM public.albums a 
        WHERE a.id = album_photos.album_id AND a.is_published = true
    )
);

CREATE POLICY "admins_manage_album_photos" ON public.album_photos
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_albums_updated_at
BEFORE UPDATE ON public.albums
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for album photos (public for client viewing)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'album-photos',
    'album-photos',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- RLS policies for album photos storage
CREATE POLICY "public_view_album_photos_storage" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'album-photos');

CREATE POLICY "admins_upload_album_photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'album-photos' AND public.is_admin());

CREATE POLICY "admins_delete_album_photos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'album-photos' AND public.is_admin());

-- Mock data for testing
DO $$
DECLARE
    admin_id UUID;
    album1_id UUID := gen_random_uuid();
    album2_id UUID := gen_random_uuid();
    wedding_img UUID;
    maternity_img UUID;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;
    
    -- Get existing gallery images
    SELECT id INTO wedding_img FROM public.gallery_images WHERE category = 'weddings' LIMIT 1;
    SELECT id INTO maternity_img FROM public.gallery_images WHERE category = 'maternity' LIMIT 1;
    
    IF admin_id IS NOT NULL THEN
        -- Create sample albums
        INSERT INTO public.albums (id, title, description, session_type, client_name, session_date, location, is_published, created_by)
        VALUES
            (album1_id, 'Sarah & Michael Wedding', 'Beautiful outdoor wedding ceremony and reception at sunset', 'wedding', 'Sarah & Michael', '2025-06-15', 'Villa Toscana, Sofia', true, admin_id),
            (album2_id, 'Maria Maternity Session', 'Elegant maternity photoshoot in natural setting', 'maternity', 'Maria Petrova', '2025-05-20', 'Studio & Outdoor', false, admin_id);
        
        -- Link existing gallery images to albums
        IF wedding_img IS NOT NULL THEN
            INSERT INTO public.album_photos (album_id, image_id, display_order, is_featured)
            VALUES (album1_id, wedding_img, 1, true);
        END IF;
        
        IF maternity_img IS NOT NULL THEN
            INSERT INTO public.album_photos (album_id, image_id, display_order, is_featured)
            VALUES (album2_id, maternity_img, 1, true);
        END IF;
    END IF;
END $$;