import { useMemo } from 'react';
import { fetchGallery } from '../services/gallery';
import useServiceFetcher from './useServiceFetcher';

const DEFAULT_LIMIT = 12;

const useGallery = (options = {}) => {
  const {
    photographerId,
    category,
    style,
    season,
    search,
    sort,
    cursor,
    limit: limitOption,
    enabled: enabledOption,
  } = options ?? {};

  const limit = limitOption ?? DEFAULT_LIMIT;
  const isEnabled = enabledOption ?? true;

  const requestOptions = useMemo(() => {
    const payload = { limit };

    if (photographerId !== undefined) {
      payload.photographerId = photographerId;
    }
    if (category !== undefined) {
      payload.category = category;
    }
    if (style !== undefined) {
      payload.style = style;
    }
    if (season !== undefined) {
      payload.season = season;
    }
    if (search !== undefined) {
      payload.search = search;
    }
    if (sort !== undefined) {
      payload.sort = sort;
    }
    if (cursor !== undefined) {
      payload.cursor = cursor;
    }

    return payload;
  }, [photographerId, category, style, season, search, sort, cursor, limit]);

  const query = useServiceFetcher(fetchGallery, requestOptions, isEnabled, []);

  return {
    ...query,
    gallery: query.data,
  };
};

export default useGallery;
