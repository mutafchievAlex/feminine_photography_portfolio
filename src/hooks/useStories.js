import { useMemo } from 'react';
import { fetchStories } from '../services/stories';
import useServiceFetcher from './useServiceFetcher';

const DEFAULT_LIMIT = 6;

const useStories = (options = {}) => {
  const {
    photographerId,
    limit = DEFAULT_LIMIT,
    category,
    tag,
    cursor,
    locale,
    sort,
    enabled = true,
  } = options ?? {};

  const requestOptions = useMemo(() => {
    const payload = { limit };

    if (photographerId !== undefined) {
      payload.photographerId = photographerId;
    }
    if (category !== undefined) {
      payload.category = category;
    }
    if (tag !== undefined) {
      payload.tag = tag;
    }
    if (cursor !== undefined) {
      payload.cursor = cursor;
    }
    if (locale !== undefined) {
      payload.locale = locale;
    }
    if (sort !== undefined) {
      payload.sort = sort;
    }

    return payload;
  }, [photographerId, limit, category, tag, cursor, locale, sort]);

  const query = useServiceFetcher(fetchStories, requestOptions, enabled, []);

  return {
    ...query,
    stories: query.data,
  };
};

export default useStories;
