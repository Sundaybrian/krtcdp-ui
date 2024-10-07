import type { IUserItem } from 'src/types/user';
import type { Page } from 'src/api/data.inteface';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/axios/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export function useGetFarmerBalance(id: number) {
  const url = id ? [endpoints.farmer.getBalance(id), {}] : '';
  const { data, isLoading, error, isValidating } = useSWR<Page<IUserItem[]>>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      balance: data || {},
      loading: isLoading,
      error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
