import { supabase } from '../lib/supabase';

export const galleryService = {
  async getAll(category = null) {
    let query = supabase?.from('gallery_images')?.select('*')?.order('display_order', { ascending: true });

    if (category) {
      query = query?.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map(image => ({
      id: image?.id,
      title: image?.title,
      description: image?.description,
      imageUrl: image?.image_url,
      thumbnailUrl: image?.thumbnail_url,
      category: image?.category,
      altText: image?.alt_text,
      displayOrder: image?.display_order,
      isFeatured: image?.is_featured,
      createdAt: image?.created_at
    })) || [];
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