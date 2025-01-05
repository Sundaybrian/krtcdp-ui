import type { Page } from 'src/api/data.inteface';
import type { ITicket, INotification } from 'src/types/notification';

import useSWR from 'swr';
import { useMemo } from 'react';

import { creator, endpoints } from 'src/axios/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export function useSearchNotifications(query: any = {}) {
  const url = query
    ? [endpoints.notification.search, { params: { limit: 20, page: 1, ...query } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<INotification[]>>(url, creator, {
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

export function useSearchTickets(query: any = {}) {
  const url = query ? [endpoints.ticket.search, { params: { limit: 20, page: 1, ...query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<ITicket[]>>(url, creator, {
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
