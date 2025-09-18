import { useMemo } from 'react';
import { fetchAddOnServices } from '../services/addOnServices';
import useServiceFetcher from './useServiceFetcher';

const DEFAULT_LIMIT = 6;

const useAddOnServices = (options = {}) => {
  const {
    photographerId,
    locale,
    currency,
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

    return payload;
  }, [photographerId, locale, currency, limit]);

  const query = useServiceFetcher(fetchAddOnServices, requestOptions, enabled, []);

  return {
    ...query,
    addOnServices: query.data,
  };
};

export default useAddOnServices;
