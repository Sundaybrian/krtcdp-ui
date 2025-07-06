import type { Page } from 'src/api/data.inteface';
import type { ITicket, INotification, RouteItem } from 'src/types/notification';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/axios/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useSearchRoutes(query: any = {}) {
  const url = query ? [endpoints.routes.search, { params: { ...query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<RouteItem[]>>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
