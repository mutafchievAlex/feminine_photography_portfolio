import apiClient from './apiClient';

const sanitizeParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );

export const fetchGallery = async (params = {}) => {
  const response = await apiClient.get('/api/v1/gallery', {
    params: sanitizeParams(params),
  });

  return response.data;
};

export default fetchGallery;
