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

// ----------------------------------------------------------------------

export const useGetPeopleStats = (query: any = {}) => {
  const url = query ? [endpoints.statistics.people, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<{ userTypeBreakdown: any[] }>(
    url,
    fetcher,
    swrOptions
  );
  const memoizedValue = useMemo(
    () => ({
      peopleStats: data,
      peopleLoading: isLoading,
      peopleError: error,
      peopleValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
};

export const useGetFinancialStats = (query: any = {}) => {
  const url = query ? [endpoints.statistics.financial, { params: { query } }] : '';
  const { data, isLoading, error, isValidating } = useSWR<{
    purchaseOrderFunnel: any[];
    kpis: any;
    invoiceStatusBuckets: any[];
    invoiceAging: any[];
  }>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      financialStats: data,
      financialLoading: isLoading,
      financialError: error,
      financialValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
};

export const useMilkLogisticStats = (query: any = {}) => {
  const url = query ? [endpoints.statistics.milkLogistics, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<{
    quality: any;
    billingPeriods: any[];
    routes: any[];
    collectionTrend: any;
  }>(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      milkLogisticStats: data,
      milkLogisticLoading: isLoading,
      milkLogisticError: error,
      milkLogisticValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
};
