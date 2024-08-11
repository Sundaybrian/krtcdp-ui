import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.baseUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const creator = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.post(url, { limit: 10, page: 1 }, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/user/me',
    signIn: '/api/auth/signin',
    signUp: '/api/auth/signup',
    adminAddUser: '/api/auth/signup',
  },
  region: {
    county: '/api/county',
    subcounty: '/api/county/subcounty',
    ward: (id: number) => `/api/county/${id}/wards`,
  },
  category: {
    new: '/api/category',
    search: '/api/category/search',
  },
  users: {
    details: '/api/users/details',
    search: '/api/user/search',
    update: '/api/user',
    get: '/api/user',
    changeStatus: '/api/user/changeStatus',
    changeState: '/api/user/changeState',
    types: '/api/user/types',
  },
  farmer: {
    new: '/api/farmer',
    search: '/api/farmer/search',
    get: '/api/farmer',
    searchFarms: '/api/farm/search',
    searchHarvests: '/api/harvest/search',
    searchFarmValueChain: '/api/farm/valuechain/search',
    searchGrn: '/api/grn/search',
    approveHarvest: (id: number) => `/api/harvest/${id}/reject-harvest`,
    evaluateHarvest: (id: number) => `/api/harvest/${id}/evaluate`,
    rejectJoin: (userId: number, coopId: number) =>
      `/api/cooperative/${userId}/reject-join-cooperative/${coopId}`,
    approveLeaveCoop: (userId: number, coopId: number) =>
      `/api/cooperative/${userId}/approve-leave-cooperative/${coopId}`,
  },
  purchaseOrder: {
    new: '/api/purchaseorder',
    search: '/api/purchaseorder/search',
  },
  stakeholder: {
    new: '/api/stakeholder',
    search: '/api/stakeholder/search',
    types: '/api/stakeholder/types',
  },
  cooperative: {
    new: '/api/cooperative',
    search: '/api/cooperative/search',
    get: 'api/cooperative',
    assignAdmin: 'api/cooperative',
    unlinkAdmin: 'api/cooperative',
    addCoopFarmer: '/api/cooperative',
    approveFarmer: '/api/cooperative',
    searchCoopFarmer: '/api/cooperative/search-coop-farmers',
    update: (id: number) => `/api/cooperative/${id}`,
  },
  valuechain: {
    new: '/api/valuechain',
    search: '/api/valuechain/search',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  invoice: {
    search: '/api/invoice/search',
  },
  statistics: {
    get: '/api/stats/statistics',
  },
};
