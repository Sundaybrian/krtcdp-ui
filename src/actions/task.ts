import type { Itask } from 'src/types/task';
import type { Page } from 'src/api/data.inteface';

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
export function useSearchTasks(query: any = {}) {
  const url = query ? [endpoints.task.search, { params: { limit: 20, page: 1, ...query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<Itask[]>>(url, creator, {
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
