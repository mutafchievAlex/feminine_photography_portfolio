import apiClient from './apiClient';

const sanitizeParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );

export const fetchStories = async (params = {}) => {
  const response = await apiClient.get('/api/v1/stories', {
    params: sanitizeParams(params),
  });

  return response.data;
};

export default fetchStories;
