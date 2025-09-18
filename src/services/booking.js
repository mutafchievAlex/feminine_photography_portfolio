import apiClient from './apiClient';

const DEFAULT_PHOTOGRAPHER_ID =
  import.meta.env.VITE_DEFAULT_PHOTOGRAPHER_ID || '11111111-1111-1111-1111-111111111111';

const normalizePayload = (data = {}) => {
  const eventDate = data.selectedDate || data.preferredDate || data.eventDate;

  const payload = {
    photographerId: data.photographerId || DEFAULT_PHOTOGRAPHER_ID,
    clientName: data.fullName || data.clientName,
    clientEmail: data.email || data.clientEmail,
    eventDate,
    location: data.location || undefined,
    totalAmount: data.totalAmount || undefined,
    selectedDate: data.selectedDate || eventDate,
  };

  const optionalFields = {
    phone: data.phone,
    sessionType: data.sessionType,
    alternateDate: data.alternateDate,
    vision: data.vision,
    inspiration: data.inspiration,
    specialRequests: data.specialRequests,
    marketingConsent: data.marketingConsent,
    agreedToTerms: data.agreedToTerms,
  };

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      payload[key] = value;
    }
  });

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined || payload[key] === '') {
      delete payload[key];
    }
  });

  return payload;
};

export const submitBooking = async (formData) => {
  const payload = normalizePayload(formData);
  const response = await apiClient.post('/api/v1/bookings', payload);
  return response.data;
};

export default submitBooking;
