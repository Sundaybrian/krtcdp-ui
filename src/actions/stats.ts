import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/axios/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

//---------------------------------------------------------------------

export type Istats = {
  activeUsers: {
    accountState: string;
    count: number;
  }[];

  totalUsers: number;

  farmersCount: number;
  cooperativesCount: number;
  farmsCount: number;
  farmActivities: {
    activityType: string;
    quantity: number;
    expenseAmount: number;
    amount: number;
  }[];

  userTypeCounts: {
    userType: string;
    count: number;
  }[];
};

export function useGetStatistcis(query: any = {}) {
  const url = query ? [endpoints.statistics.get, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<Istats>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data,
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
