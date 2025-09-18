import { useMemo } from 'react';
import { fetchInstagramFeed } from '../services/instagram';
import useServiceFetcher from './useServiceFetcher';

const DEFAULT_LIMIT = 9;

const useInstagramFeed = (options = {}) => {
  const {
    photographerId,
    username,
    hashtag,
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
    if (username !== undefined) {
      payload.username = username;
    }
    if (hashtag !== undefined) {
      payload.hashtag = hashtag;
    }
    if (cursor !== undefined) {
      payload.cursor = cursor;
    }

    return payload;
  }, [photographerId, username, hashtag, cursor, limit]);

  const query = useServiceFetcher(fetchInstagramFeed, requestOptions, isEnabled, []);

  return {
    ...query,
    posts: query.data,
  };
};

export default useInstagramFeed;
