import type { IProductItem } from 'src/types/product';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/axios/axios';
import { Page } from 'src/api/data.inteface';
import { ICooperative } from 'src/types/cooperative';
import { IUserAccount, IUserItem } from 'src/types/user';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export function useSearchAdmins(query: any = {}) {
  const url = query ? [endpoints.users.search, { params: { limit: 1000, page: 1, ...query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<IUserItem[]>>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      userResults: data?.results || [],
      useerLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
