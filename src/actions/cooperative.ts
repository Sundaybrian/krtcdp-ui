import type { Page } from 'src/api/data.inteface';
import type { CreateUnion } from 'src/types/user';
import type { IProductItem } from 'src/types/product';
import type { ValueChain } from 'src/types/value-chain';
import type { ICooperative } from 'src/types/cooperative';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, creator, endpoints } from 'src/axios/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type ProductsData = {
  products: IProductItem[];
};

export function useGetCooperatives() {
  const url = endpoints.cooperative.search;

  const { data, isLoading, error, isValidating } = useSWR<ProductsData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      products: data?.products || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId: string) {
  const url = endpoints.product.details(productId);

  const { data, isLoading, error, isValidating } = useSWR<IProductItem>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      product: data,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
export function useSearchCooperative(query: any = {}) {
  const url = query
    ? [endpoints.cooperative.search, { params: { limit: 200, page: 1, ...query } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<ICooperative[]>>(url, fetcher, {
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

// ----------------------------------------------------------------------
export function useSearchCooperativeFarmers(query: any = {}) {
  const url = query
    ? [
        endpoints.cooperative.searchCoopFarmer,
        { params: { limit: 20, page: 1, cooperativeId: 1, ...query } },
      ]
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

export function useSearchValueChain(query: any = {}) {
  const url = query
    ? [endpoints.valuechain.search, { params: { limit: 20, page: 1, ...query } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<ValueChain[]>>(url, fetcher, {
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

// ----------------------------------------------------------------------
export function useSearchCooperativeUnions(query: any = {}) {
  const url = query
    ? [endpoints.cooperative.searchUnion, { params: { limit: 20, page: 1, ...query } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<Page<CreateUnion[]>>(url, creator, {
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
