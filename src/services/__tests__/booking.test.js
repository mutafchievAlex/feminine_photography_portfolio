import { beforeEach, describe, expect, it, mock, vi } from 'bun:test';

mock.module('../apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

const apiClient = (await import('../apiClient')).default;
const { submitBooking } = await import('../booking');

describe('booking service', () => {
  beforeEach(() => {
    apiClient.post.mockReset();
  });

  it('posts booking payload including the selected date', async () => {
    apiClient.post.mockResolvedValue({ data: { id: 'booking-1' } });

    const result = await submitBooking({
      fullName: 'Test User',
      email: 'test@example.com',
      selectedDate: '2025-01-15',
      phone: '+359123456789',
      sessionType: 'wedding',
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/v1/bookings',
      expect.objectContaining({
        photographerId: expect.any(String),
        clientName: 'Test User',
        clientEmail: 'test@example.com',
        selectedDate: '2025-01-15',
        eventDate: '2025-01-15',
        phone: '+359123456789',
        sessionType: 'wedding',
      })
    );
    expect(result).toEqual({ id: 'booking-1' });
  });

  it('falls back to preferred date when no calendar selection exists', async () => {
    apiClient.post.mockResolvedValue({ data: { id: 'booking-2' } });

    await submitBooking({
      fullName: 'Another User',
      email: 'another@example.com',
      preferredDate: '2025-02-01',
    });

    expect(apiClient.post).toHaveBeenLastCalledWith(
      '/api/v1/bookings',
      expect.objectContaining({
        eventDate: '2025-02-01',
        selectedDate: '2025-02-01',
      })
    );
  });
});
