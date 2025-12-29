import { supabase } from '../lib/supabase';

export const galleryService = {
  async getAll(category = null) {
    try {
      console.log('galleryService.getAll() called with category:', category);
      
      // First try to get from gallery_images table
      let query = supabase?.from('gallery_images')?.select('*')?.order('display_order', { ascending: true });

      if (category) {
        query = query?.eq('category', category);
      }

      const { data: galleryData, error: galleryError } = await query;
      console.log('gallery_images query result:', { data: galleryData, error: galleryError });
      
      // If gallery_images table exists and has data, use it
      if (!galleryError && galleryData && galleryData.length > 0) {
        const mapped = galleryData?.map(image => ({
          id: image?.id,
          title: image?.title,
          description: image?.description,
          imageUrl: image?.image_url,
          thumbnailUrl: image?.thumbnail_url,
          category: image?.category,
          albumId: image?.album_id,
          altText: image?.alt_text,
          displayOrder: image?.display_order,
          isFeatured: image?.is_featured,
          createdAt: image?.created_at
        })) || [];
        console.log('Using gallery_images data:', mapped);
        return mapped;
      }

      // Otherwise, get images from album_photos and expand albums
      console.log('Fetching from albums table instead...');
      const { data: albums, error: albumError } = await supabase
        ?.from('albums')
        ?.select(`
          id,
          title,
          description,
          category,
          cover_image_url,
          photos (
            id,
            image_url,
            thumbnail_url,
            title,
            description,
            alt_text
          )
        `)
        ?.eq('is_published', true)
        ?.neq('title', 'Hero'); // Exclude Hero album from public gallery

      console.log('Albums query result:', { data: albums, error: albumError });

      if (albumError) throw albumError;

      // Flatten the photos from all albums into a single gallery array
      const allPhotos = [];
      albums?.forEach(album => {
        // Skip Hero album (reserved for homepage hero carousel only)
        if (album?.title === 'Hero') return;
        console.log('Processing album:', album?.title, 'photos count:', album?.photos?.length);
        if (album?.photos && Array.isArray(album.photos)) {
          album.photos.forEach(photo => {
            allPhotos.push({
              id: photo?.id,
              title: photo?.title || album?.title,
              description: photo?.description || album?.description,
              imageUrl: photo?.image_url,
              thumbnailUrl: photo?.thumbnail_url || photo?.image_url,
              category: album?.category || category,
              albumId: album?.id,
              altText: photo?.alt_text,
              displayOrder: 0,
              isFeatured: false,
              createdAt: photo?.created_at
            });
          });
        }
      });

      console.log('Total photos flattened:', allPhotos.length);

      // Filter by category if specified
      if (category) {
        const filtered = allPhotos.filter(p => p.category === category);
        console.log('Filtered by category:', category, 'result:', filtered.length);
        return filtered;
      }

      console.log('Final gallery data:', allPhotos);
      return allPhotos;
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
  },

  async getByCategory(category) {
    const { data, error } = await supabase
      ?.from('gallery_images')
      ?.select('*')
      ?.eq('category', category)
      ?.order('display_order', { ascending: true });

    if (error) throw error;

    return data?.map(image => ({
      id: image?.id,
      title: image?.title,
      description: image?.description,
      imageUrl: image?.image_url,
      thumbnailUrl: image?.thumbnail_url,
      category: image?.category,
      altText: image?.alt_text,
      albumId: image?.album_id,
      displayOrder: image?.display_order,
      isFeatured: image?.is_featured,
      createdAt: image?.created_at
    })) || [];
  },

  async getFeatured() {
    const { data, error } = await supabase?.from('gallery_images')?.select('*')?.eq('is_featured', true)?.order('display_order', { ascending: true })?.limit(6);

    if (error) throw error;

    return data?.map(image => ({
      id: image?.id,
      title: image?.title,
      description: image?.description,
      imageUrl: image?.image_url,
      thumbnailUrl: image?.thumbnail_url,
      category: image?.category,
      albumId: image?.album_id,
      altText: image?.alt_text,
      isFeatured: image?.is_featured
    })) || [];
  },

  async create(imageData) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('gallery_images')?.insert({
        title: imageData?.title,
        description: imageData?.description || null,
        image_url: imageData?.imageUrl,
        thumbnail_url: imageData?.thumbnailUrl || imageData?.imageUrl,
        category: imageData?.category,
        alt_text: imageData?.altText,
        album_id: imageData?.albumId || null,
        display_order: imageData?.displayOrder || 0,
        is_featured: imageData?.isFeatured || false,
        uploaded_by: user?.id
      })?.select()?.single();

    if (error) throw error;

    // Log activity
    await supabase?.rpc('log_activity', {
      activity_type_param: 'gallery_image_added',
      description_param: `Добавена нова снимка: ${imageData?.title}`,
      metadata_param: { image_id: data?.id, category: imageData?.category }
    });

    return {
      id: data?.id,
      title: data?.title,
      imageUrl: data?.image_url,
      category: data?.category
    };
  },

  async update(imageId, updates) {
    const { data, error } = await supabase?.from('gallery_images')?.update({
        title: updates?.title,
        description: updates?.description,
        category: updates?.category,
        album_id: updates?.albumId,
        alt_text: updates?.altText,
        display_order: updates?.displayOrder,
        is_featured: updates?.isFeatured,
        updated_at: new Date()?.toISOString()
      })?.eq('id', imageId)?.select()?.single();

    if (error) throw error;
    return data;
  },

  async delete(imageId) {
    const { error } = await supabase?.from('gallery_images')?.delete()?.eq('id', imageId);

    if (error) throw error;
  }
};