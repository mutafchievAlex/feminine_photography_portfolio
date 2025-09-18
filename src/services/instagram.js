import apiClient from './apiClient';

const sanitizeParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );

export const fetchInstagramFeed = async (params = {}) => {
  const response = await apiClient.get('/api/v1/instagram/feed', {
    params: sanitizeParams(params),
  });

  return response.data;
};

export default fetchInstagramFeed;
