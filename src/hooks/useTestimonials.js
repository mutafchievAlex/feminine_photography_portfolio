import { useMemo } from 'react';
import { fetchTestimonials } from '../services/testimonials';
import useServiceFetcher from './useServiceFetcher';

const DEFAULT_LIMIT = 6;

const useTestimonials = (options = {}) => {
  const {
    photographerId,
    locale,
    limit = DEFAULT_LIMIT,
    enabled = true,
  } = options ?? {};

  const requestOptions = useMemo(() => {
    const payload = { limit };

    if (photographerId !== undefined) {
      payload.photographerId = photographerId;
    }
    if (locale !== undefined) {
      payload.locale = locale;
    }

    return payload;
  }, [photographerId, locale, limit]);

  const query = useServiceFetcher(fetchTestimonials, requestOptions, enabled, []);

  return {
    ...query,
    testimonials: query.data,
  };
};

export default useTestimonials;
