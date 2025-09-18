import { useMemo } from 'react';
import { fetchPackages } from '../services/packages';
import useServiceFetcher from './useServiceFetcher';

const DEFAULT_LIMIT = 6;

const usePackages = (options = {}) => {
  const {
    photographerId,
    locale,
    currency,
    category,
    sort,
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
    if (currency !== undefined) {
      payload.currency = currency;
    }
    if (category !== undefined) {
      payload.category = category;
    }
    if (sort !== undefined) {
      payload.sort = sort;
    }

    return payload;
  }, [photographerId, locale, currency, category, sort, limit]);

  const query = useServiceFetcher(fetchPackages, requestOptions, enabled, []);

  return {
    ...query,
    packages: query.data,
  };
};

export default usePackages;
