import type { Page } from 'src/api/data.inteface';
import type { ITicket, INotification, RouteItem, RouteTask } from 'src/types/notification';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, creator } from 'src/axios/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useSearchCollections(query: any = {}) {
  const url = query
    ? [endpoints.collections.search, { params: { limit: 1000, page: 1, ...query } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<RouteTask[]>>(url, creator, {
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

export const useGetRouteTasks = (routeId: string) => {
  const url = routeId ? [endpoints.routes.getRouteTasks(routeId)] : '';

  const { data, isLoading, error, isValidating } = useSWR<RouteTask[]>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      tasks:
        data?.filter((task) => {
          // created today
          const today = new Date();
          const taskDate = new Date(task.creationDate);
          return (
            taskDate.getDate() === today.getDate() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear()
          );
        }) || [],
      tasksLoading: isLoading,
      tasksError: error,
      tasksValidating: isValidating,
      tasksEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
};

export function useSearchStages(query: any = {}) {
  const url = query ? [endpoints.collections.searchStages, { params: { ...query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<RouteItem[]>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// use searh milk aggregation
export function useSearchMilkAggregation(query: any = {}) {
  const url = query ? [endpoints.collections.searchMilkAggregation, { params: { ...query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<any>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  console.log('Milk Aggregation Data:', data);

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results?.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// use earch milk aggregation
export function useSearchMilkAggregationByDate(query: any = {}) {
  const url = query
    ? [endpoints.collections.searchMilkAggregationByDate, { params: { ...query } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<any>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results?.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useSearchShifts(query: any = {}) {
  const url = query
    ? [endpoints.collections.searchShifts, { params: { limit: 100, page: 1, ...query } }]
    : '';

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
