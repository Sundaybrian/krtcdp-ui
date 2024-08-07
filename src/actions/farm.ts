import type { IProductItem } from 'src/types/product';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, creator } from 'src/axios/axios';
import { Page } from 'src/api/data.inteface';
import { ICooperative } from 'src/types/cooperative';
import { ValueChain } from 'src/types/value-chain';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export function useSearchFarms(query: any = {}) {
  const url = query
    ? [endpoints.farmer.searchFarms, { params: { limit: 20, page: 1, ...query } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<ICooperative[]>>(url, creator, {
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
