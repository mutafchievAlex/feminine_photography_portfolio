import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../services/galleryService';

// Query keys for caching
export const galleryKeys = {
  all: ['gallery'],
  lists: () => [...galleryKeys?.all, 'list'],
  list: (category) => [...galleryKeys?.lists(), { category }],
  featured: () => [...galleryKeys?.all, 'featured'],
  details: () => [...galleryKeys?.all, 'detail'],
  detail: (id) => [...galleryKeys?.details(), id],
};

/**
 * Hook to fetch all gallery images with optional category filter
 */
export function useGalleryImages(category = null, options = {}) {
  return useQuery({
    queryKey: galleryKeys?.list(category),
    queryFn: () => galleryService?.getAll(category),
    ...options,
  });
}

/**
 * Hook to fetch gallery images by specific category
 */
export function useGalleryByCategory(category, options = {}) {
  return useQuery({
    queryKey: galleryKeys?.list(category),
    queryFn: () => galleryService?.getByCategory(category),
    enabled: !!category,
    ...options,
  });
}

/**
 * Hook to fetch featured gallery images
 */
export function useFeaturedGallery(options = {}) {
  return useQuery({
    queryKey: galleryKeys?.featured(),
    queryFn: () => galleryService?.getFeatured(),
    ...options,
  });
}

/**
 * Hook to create new gallery image with automatic cache invalidation
 */
export function useCreateGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageData) => galleryService?.create(imageData),
    onSuccess: () => {
      // Invalidate all gallery queries to refetch
      queryClient?.invalidateQueries({ queryKey: galleryKeys?.all });
    },
  });
}

/**
 * Hook to update gallery image with automatic cache invalidation
 */
export function useUpdateGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, updates }) =>
      galleryService?.update(imageId, updates),
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: galleryKeys?.all });
    },
  });
}

/**
 * Hook to delete gallery image with automatic cache invalidation
 */
export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId) => galleryService?.delete(imageId),
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: galleryKeys?.all });
    },
  });
}