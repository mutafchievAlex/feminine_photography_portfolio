-- Add album_id to gallery_images and backfill from album_photos
BEGIN;

ALTER TABLE IF EXISTS public.gallery_images
ADD COLUMN IF NOT EXISTS album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_gallery_images_album_id ON public.gallery_images(album_id);

-- Backfill album_id for existing images linked via album_photos
UPDATE public.gallery_images AS gi
SET album_id = ap.album_id
FROM public.album_photos AS ap
WHERE gi.id = ap.image_id
AND gi.album_id IS NULL;

COMMIT;
