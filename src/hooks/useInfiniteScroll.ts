import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  hasNextPage,
  fetchNextPage,
  threshold = 100,
  rootMargin = '100px'
}: UseInfiniteScrollOptions) => {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      
      if (target.isIntersecting && hasNextPage && !isFetching) {
        setIsFetching(true);
        fetchNextPage();
      }
    },
    [hasNextPage, isFetching, fetchNextPage]
  );

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin
    });

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold, rootMargin]);

  const resetFetching = useCallback(() => {
    setIsFetching(false);
  }, []);

  return {
    isFetching,
    loadMoreRef,
    resetFetching
  };
};

interface InfiniteScrollData<T> {
  items: T[];
  page: number;
  hasNextPage: boolean;
}

export const useInfiniteData = <T>(
  initialData: T[],
  fetchFunction: (page: number) => Promise<{ items: T[]; hasNextPage: boolean }>
) => {
  const [data, setData] = useState<InfiniteScrollData<T>>({
    items: initialData,
    page: 1,
    hasNextPage: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNextPage = useCallback(async () => {
    if (isLoading || !data.hasNextPage) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(data.page + 1);
      
      setData(prev => ({
        items: [...prev.items, ...result.items],
        page: prev.page + 1,
        hasNextPage: result.hasNextPage
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, data.page, data.hasNextPage, isLoading]);

  const resetData = useCallback(() => {
    setData({
      items: initialData,
      page: 1,
      hasNextPage: true
    });
    setError(null);
    setIsLoading(false);
  }, [initialData]);

  return {
    data,
    isLoading,
    error,
    fetchNextPage,
    resetData
  };
};
