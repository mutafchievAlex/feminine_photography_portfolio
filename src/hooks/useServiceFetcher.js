import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Shared data-fetching helper hook used by resource-specific hooks.
 * It ensures that only the latest request updates the component state
 * and exposes a stable refetch callback.
 */
const useServiceFetcher = (serviceFn, requestOptions, enabled = true, initialData) => {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));

  const isMountedRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchLatest = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const result = await serviceFn(requestOptions);

      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setData(result);
    } catch (err) {
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setError(err);
    } finally {
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setIsLoading(false);
    }
  }, [serviceFn, requestOptions]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    fetchLatest();
  }, [enabled, fetchLatest]);

  return {
    data,
    error,
    isLoading,
    loading: isLoading,
    isFetching: isLoading,
    refetch: fetchLatest,
  };
};

export default useServiceFetcher;
