import { supabase } from '../lib/supabase';

export const albumService = {
  // Get all albums (admin view)
  async getAll() {
    const { data, error } = await supabase?.from('albums')?.select(`
        *,
        album_photos(
          id,
          image_id,
          caption,
          is_featured,
          gallery_images(
            id,
            image_url,
            thumbnail_url,
            title,
            alt_text
          )
        )
      `)?.order('display_order', { ascending: true });

    if (error) throw error;

    // Convert to camelCase and flatten structure
    return data?.map(album => ({
      id: album?.id,
      title: album?.title,
      description: album?.description,
      coverImageUrl: album?.cover_image_url,
      sessionType: album?.session_type,
      clientName: album?.client_name,
      sessionDate: album?.session_date,
      location: album?.location,
      isPublished: album?.is_published,
      displayOrder: album?.display_order,
      createdBy: album?.created_by,
      createdAt: album?.created_at,
      updatedAt: album?.updated_at,
      photoCount: album?.album_photos?.length || 0,
      featuredPhoto: album?.album_photos?.find(p => p?.is_featured)?.gallery_images || album?.album_photos?.[0]?.gallery_images
    })) || [];
  },

  // Get single album with all photos
  async getById(albumId) {
    const { data, error } = await supabase?.from('albums')?.select(`
        *,
        album_photos(
          id,
          caption,
          is_featured,
          display_order,
          gallery_images(
            id,
            image_url,
            thumbnail_url,
            title,
            alt_text,
            description
          )
        )
      `)?.eq('id', albumId)?.single();

    if (error) throw error;
    if (!data) throw new Error('Album not found');

    // Safely handle album_photos array with proper null checks
    const albumPhotos = Array.isArray(data?.album_photos) ? data?.album_photos : [];
    
    return {
      id: data?.id,
      title: data?.title,
      description: data?.description,
      coverImageUrl: data?.cover_image_url,
      sessionType: data?.session_type,
      clientName: data?.client_name,
      sessionDate: data?.session_date,
      location: data?.location,
      isPublished: data?.is_published,
      displayOrder: data?.display_order,
      createdBy: data?.created_by,
      createdAt: data?.created_at,
      updatedAt: data?.updated_at,
      photos: // Remove entries without gallery images
      albumPhotos?.filter(p => p?.gallery_images)?.sort((a, b) => (a?.display_order || 0) - (b?.display_order || 0))?.map(p => ({
          id: p?.id,
          imageId: p?.gallery_images?.id,
          imageUrl: p?.gallery_images?.image_url,
          thumbnailUrl: p?.gallery_images?.thumbnail_url,
          title: p?.gallery_images?.title || 'Untitled',
          altText: p?.gallery_images?.alt_text || '',
          description: p?.gallery_images?.description || '',
          caption: p?.caption || '',
          isFeatured: p?.is_featured || false,
          displayOrder: p?.display_order || 0
        }))
    };
  },

  // Create new album
  async create(albumData) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('albums')?.insert({
        title: albumData?.title,
        description: albumData?.description,
        cover_image_url: albumData?.coverImageUrl,
        session_type: albumData?.sessionType,
        client_name: albumData?.clientName,
        session_date: albumData?.sessionDate,
        location: albumData?.location,
        is_published: albumData?.isPublished || false,
        display_order: albumData?.displayOrder || 0,
        created_by: user?.id
      })?.select()?.single();

    if (error) throw error;

    return {
      id: data?.id,
      title: data?.title,
      description: data?.description,
      coverImageUrl: data?.cover_image_url,
      sessionType: data?.session_type,
      clientName: data?.client_name,
      sessionDate: data?.session_date,
      location: data?.location,
      isPublished: data?.is_published,
      displayOrder: data?.display_order,
      createdBy: data?.created_by,
      createdAt: data?.created_at,
      updatedAt: data?.updated_at
    };
  },

  // Add batch photo upload for multiple photos at once
  async addMultiplePhotosToAlbum(albumId, photosData) {
    const results = [];
    
    for (let i = 0; i < photosData?.length; i++) {
      const photoData = photosData?.[i];
      const result = await this.addPhotoToAlbum(albumId, photoData?.metadata, photoData?.file);
      results?.push(result);
    }

    // Update album cover image with first featured or first photo
    const featuredPhoto = results?.find(p => p?.isFeatured) || results?.[0];
    if (featuredPhoto) {
      await this.update(albumId, {
        coverImageUrl: featuredPhoto?.imageUrl
      });
    }

    return results;
  },

  // Update album
  async update(albumId, albumData) {
    const { data, error } = await supabase?.from('albums')?.update({
        title: albumData?.title,
        description: albumData?.description,
        cover_image_url: albumData?.coverImageUrl,
        session_type: albumData?.sessionType,
        client_name: albumData?.clientName,
        session_date: albumData?.sessionDate,
        location: albumData?.location,
        is_published: albumData?.isPublished,
        display_order: albumData?.displayOrder
      })?.eq('id', albumId)?.select()?.single();

    if (error) throw error;

    return {
      id: data?.id,
      title: data?.title,
      description: data?.description,
      coverImageUrl: data?.cover_image_url,
      sessionType: data?.session_type,
      clientName: data?.client_name,
      sessionDate: data?.session_date,
      location: data?.location,
      isPublished: data?.is_published,
      displayOrder: data?.display_order,
      updatedAt: data?.updated_at
    };
  },

  // Delete album
  async delete(albumId) {
    const { error } = await supabase?.from('albums')?.delete()?.eq('id', albumId);

    if (error) throw error;
  },

  // Upload photo to storage
  async uploadPhoto(file) {
    const fileExt = file?.name?.split('.')?.pop();
    const fileName = `${Date.now()}-${Math.random()?.toString(36)?.substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase?.storage?.from('album-photos')?.upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase?.storage?.from('album-photos')?.getPublicUrl(filePath);

    return data?.publicUrl;
  },

  // Add photo to gallery_images and link to album
  async addPhotoToAlbum(albumId, photoData, imageFile) {
    // Upload image first
    const imageUrl = await this.uploadPhoto(imageFile);

    // Create gallery_images entry
    const { data: { user } } = await supabase?.auth?.getUser();
    
    const { data: galleryImage, error: galleryError } = await supabase?.from('gallery_images')?.insert({
        title: photoData?.title,
        alt_text: photoData?.altText,
        description: photoData?.description,
        image_url: imageUrl,
        thumbnail_url: imageUrl,
        category: photoData?.category || 'weddings',
        uploaded_by: user?.id
      })?.select()?.single();

    if (galleryError) throw galleryError;

    // Link to album
    const { data: albumPhoto, error: linkError } = await supabase?.from('album_photos')?.insert({
        album_id: albumId,
        image_id: galleryImage?.id,
        caption: photoData?.caption,
        is_featured: photoData?.isFeatured || false,
        display_order: photoData?.displayOrder || 0
      })?.select()?.single();

    if (linkError) throw linkError;

    return {
      id: albumPhoto?.id,
      imageId: galleryImage?.id,
      imageUrl: galleryImage?.image_url,
      thumbnailUrl: galleryImage?.thumbnail_url,
      title: galleryImage?.title,
      altText: galleryImage?.alt_text,
      caption: albumPhoto?.caption,
      isFeatured: albumPhoto?.is_featured,
      displayOrder: albumPhoto?.display_order
    };
  },

  // Remove photo from album (but keep in gallery_images)
  async removePhotoFromAlbum(albumPhotoId) {
    const { error } = await supabase?.from('album_photos')?.delete()?.eq('id', albumPhotoId);

    if (error) throw error;
  },

  // Update photo metadata
  async updatePhotoMetadata(albumPhotoId, metadata) {
    const { data, error } = await supabase?.from('album_photos')?.update({
        caption: metadata?.caption,
        is_featured: metadata?.isFeatured,
        display_order: metadata?.displayOrder
      })?.eq('id', albumPhotoId)?.select()?.single();

    if (error) throw error;
    return data;
  },

  // Reorder photos
  async reorderPhotos(albumId, photoOrders) {
    const updates = photoOrders?.map(({ id, displayOrder }) => 
      supabase?.from('album_photos')?.update({ display_order: displayOrder })?.eq('id', id)?.eq('album_id', albumId)
    );

    await Promise.all(updates);
  },

  // Bulk update photo metadata
  async bulkUpdatePhotoMetadata(updates) {
    const promises = updates?.map(({ id, caption, isFeatured }) => 
      supabase?.from('album_photos')?.update({
        caption: caption,
        is_featured: isFeatured
      })?.eq('id', id)
    );

    const results = await Promise.all(promises);
    const errors = results?.filter(r => r?.error);
    if (errors?.length > 0) throw new Error('Failed to update some photos');
  },

  // Get album templates
  async getTemplates() {
    return [
      {
        id: 'wedding-classic',
        name: 'Classic Wedding',
        sessionType: 'wedding',
        description: 'Traditional wedding album template with ceremony and reception sections',
        photoCount: 50
      },
      {
        id: 'maternity-glow',
        name: 'Maternity Glow',
        sessionType: 'maternity',
        description: 'Elegant maternity session template highlighting the natural glow',
        photoCount: 30
      },
      {
        id: 'family-moments',
        name: 'Family Moments',
        sessionType: 'family',
        description: 'Warm family portrait template capturing precious moments',
        photoCount: 40
      },
      {
        id: 'engagement-story',
        name: 'Engagement Story',
        sessionType: 'engagement',
        description: 'Romantic engagement session template telling your love story',
        photoCount: 35
      },
      {
        id: 'corporate-professional',
        name: 'Corporate Professional',
        sessionType: 'corporate',
        description: 'Professional corporate headshots and team photos template',
        photoCount: 25
      }
    ];
  },

  // Create album from template
  async createFromTemplate(templateId, customData) {
    const templates = await this.getTemplates();
    const template = templates?.find(t => t?.id === templateId);
    
    if (!template) throw new Error('Template not found');

    const albumData = {
      title: customData?.title || template?.name,
      description: customData?.description || template?.description,
      sessionType: template?.sessionType,
      clientName: customData?.clientName || '',
      sessionDate: customData?.sessionDate || new Date()?.toISOString()?.split('T')?.[0],
      location: customData?.location || '',
      isPublished: false,
      displayOrder: 0
    };

    return await this.create(albumData);
  },

  // Toggle album publish status
  async togglePublish(albumId, currentStatus) {
    const { data, error } = await supabase?.from('albums')?.update({
        is_published: !currentStatus
      })?.eq('id', albumId)?.select()?.single();

    if (error) throw error;

    return {
      id: data?.id,
      isPublished: data?.is_published,
      updatedAt: data?.updated_at
    };
  },

  // Get published albums for gallery view
  async getPublishedAlbums() {
    const { data, error } = await supabase?.from('albums')?.select(`
        *,
        album_photos(
          id,
          image_id,
          caption,
          is_featured,
          display_order,
          gallery_images(
            id,
            image_url,
            thumbnail_url,
            title,
            alt_text,
            category
          )
        )
      `)?.eq('is_published', true)?.order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(album => ({
      id: album?.id,
      title: album?.title,
      description: album?.description,
      coverImageUrl: album?.cover_image_url,
      sessionType: album?.session_type,
      clientName: album?.client_name,
      sessionDate: album?.session_date,
      location: album?.location,
      displayOrder: album?.display_order,
      createdAt: album?.created_at,
      photos: album?.album_photos?.filter(p => p?.gallery_images)?.sort((a, b) => (a?.display_order || 0) - (b?.display_order || 0))?.map(p => ({
        id: p?.gallery_images?.id,
        imageUrl: p?.gallery_images?.image_url,
        thumbnailUrl: p?.gallery_images?.thumbnail_url,
        title: p?.gallery_images?.title,
        altText: p?.gallery_images?.alt_text,
        category: p?.gallery_images?.category,
        caption: p?.caption,
        isFeatured: p?.is_featured
      })) || []
    })) || [];
  }
};