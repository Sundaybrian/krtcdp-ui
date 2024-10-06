import type { Page } from 'src/api/data.inteface';
import type { IcheckoffTransaction } from 'src/types/transaction';

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
export function useSearchCheckoffTrx(query: any = {}) {
  const url = query
    ? [endpoints.checkoffTransaction.search, { params: { limit: 20, page: 1, ...query } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<IcheckoffTransaction[]>>(
    url,
    creator,
    {
      ...swrOptions,
      keepPreviousData: true,
    }
  );

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
