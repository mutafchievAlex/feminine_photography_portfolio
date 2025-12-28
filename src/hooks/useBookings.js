import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';

// Query keys for caching
export const bookingKeys = {
  all: ['bookings'],
  lists: () => [...bookingKeys?.all, 'list'],
  list: (filters) => [...bookingKeys?.lists(), { filters }],
  details: () => [...bookingKeys?.all, 'detail'],
  detail: (id) => [...bookingKeys?.details(), id],
  stats: () => [...bookingKeys?.all, 'stats'],
};

/**
 * Hook to fetch all bookings with loading, error, and empty states
 */
export function useBookings(options = {}) {
  return useQuery({
    queryKey: bookingKeys?.lists(),
    queryFn: () => bookingService?.getAllBookings(),
    ...options,
  });
}

/**
 * Hook to fetch recent bookings (limited to 5)
 */
export function useRecentBookings(options = {}) {
  return useQuery({
    queryKey: [...bookingKeys?.lists(), 'recent'],
    queryFn: async () => {
      const bookings = await bookingService?.getAllBookings();
      return bookings?.slice(0, 5) || [];
    },
    ...options,
  });
}

/**
 * Hook to fetch booking statistics
 */
export function useBookingStats(options = {}) {
  return useQuery({
    queryKey: bookingKeys?.stats(),
    queryFn: () => bookingService?.getStats(),
    ...options,
  });
}

/**
 * Hook to update booking status with automatic cache invalidation
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, status, adminNotes }) =>
      bookingService?.updateStatus(bookingId, status, adminNotes),
    onSuccess: () => {
      // Invalidate and refetch bookings and stats
      queryClient?.invalidateQueries({ queryKey: bookingKeys?.all });
    },
  });
}

/**
 * Hook to fetch user's own bookings
 */
export function useUserBookings(options = {}) {
  return useQuery({
    queryKey: [...bookingKeys?.lists(), 'user'],
    queryFn: () => bookingService?.getUserBookings(),
    ...options,
  });
}