import type {
  Role,
  Action,
  AppUser,
  UserRoles,
  Permission,
  Application,
  Ipagination,
} from 'src/api/data.inteface';

import useSWR from 'swr';
import { useMemo } from 'react';

import { permissionFetcher, permissionEndpoints } from 'src/axios/permission';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export function useSearchApps(query: any = {}) {
  const url = query
    ? [permissionEndpoints.applications.get, { params: { $limit: 1000, ...query } }]
    : '';
  const { data, isLoading, error, isValidating } = useSWR<Ipagination<Application[]>>(
    url,
    permissionFetcher,
    {
      ...swrOptions,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      applications: data?.data || [],
      loading: isLoading,
      error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.total,
    }),
    [data?.data, error, isLoading, isValidating, data?.total]
  );

  return memoizedValue;
}

export function useSearchRoles(query: any = {}) {
  const url = query ? [permissionEndpoints.roles.get, { params: { $limit: 1000, ...query } }] : '';
  const { data, isLoading, error, isValidating } = useSWR<Ipagination<Role[]>>(
    url,
    permissionFetcher,
    {
      ...swrOptions,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      roles: data?.data || [],
      loading: isLoading,
      error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.total,
    }),
    [data?.data, error, isLoading, isValidating, data?.total]
  );

  return memoizedValue;
}

// user roles search
export function useSearchUserRoles(query: any = {}) {
  const url = query
    ? [permissionEndpoints.userRoles.get, { params: { $limit: 1000, ...query } }]
    : '';
  const { data, isLoading, error, isValidating } = useSWR<Ipagination<UserRoles[]>>(
    url,
    permissionFetcher,
    {
      ...swrOptions,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      roles: data?.data || [],
      loading: isLoading,
      error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.total,
    }),
    [data?.data, error, isLoading, isValidating, data?.total]
  );

  return memoizedValue;
}

// search users
export function useSearchUsers(query: any = {}) {
  const url = query
    ? [permissionEndpoints.appUsers.get, { params: { $limit: 1000, ...query } }]
    : '';
  const { data, isLoading, error, isValidating } = useSWR<Ipagination<AppUser[]>>(
    url,
    permissionFetcher,
    {
      ...swrOptions,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      users: data?.data || [],
      loading: isLoading,
      error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.total,
    }),
    [data?.data, error, isLoading, isValidating, data?.total]
  );

  return memoizedValue;
}

// search permissions
export function useSearchPermissions(query: any = {}) {
  const url = query
    ? [permissionEndpoints.permissions.get, { params: { $limit: 1000, ...query } }]
    : '';
  const { data, isLoading, error, isValidating } = useSWR<Ipagination<Permission[]>>(
    url,
    permissionFetcher,
    {
      ...swrOptions,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      permissions: data?.data || [],
      loading: isLoading,
      error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.total,
    }),
    [data?.data, error, isLoading, isValidating, data?.total]
  );

  return memoizedValue;
}

// search actions
export function useSearchActions(query: any = {}) {
  const url = query
    ? [permissionEndpoints.actions.get, { params: { $limit: 1000, ...query } }]
    : '';
  const { data, isLoading, error, isValidating } = useSWR<Ipagination<Action[]>>(
    url,
    permissionFetcher,
    {
      ...swrOptions,
      keepPreviousData: true,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      actions: data?.data || [],
      loading: isLoading,
      error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.total,
    }),
    [data?.data, error, isLoading, isValidating, data?.total]
  );

  return memoizedValue;
}
