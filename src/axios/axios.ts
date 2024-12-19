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

    const res = await axiosInstance.post(url, { ...config?.params }, { params: {} });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/chat',
  kanban: '/kanban',
  calendar: '/calendar',
  auth: {
    me: '/user/me',
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    adminAddUser: '/auth/signup',
    signInWithOtp: '/auth/login-with-otp',
    verifyOtp: '/auth/validate-otp',
  },
  region: {
    county: '/county',
    subcounty: '/county/subcounty',
    ward: (id: number) => `/county/${id}/wards`,
  },
  category: {
    new: '/category',
    search: '/category/search',
  },
  users: {
    details: '/users/details',
    search: '/user/search',
    update: '/user',
    get: '/user',
    changeStatus: '/user/changeStatus',
    changeState: '/user/changeState',
    types: '/user/types',
  },
  farmer: {
    new: '/farmer',
    search: '/farmer/search',
    get: '/farmer',
    getOne: (id: number) => `/farmer/${id}`,
    getBalance: (id: number) => `/farmerbalance/${id}`,
    searchFarms: '/farm/search',
    searchHarvests: '/harvest/search',
    searchFarmValueChain: '/farm/valuechain/search',
    searchWarehouseReceipt: '/warehousereceipt/search',
    newWarehouseReceipt: '/warehousereceipt',
    searchGrn: '/grn/search',
    searchExpense: '/farmmanagementactivity/search',
    newNextOfKin: '/nextofkin',
    searchBalance: '/farmerbalance/search',
    newExpense: (id: number) => `/farmmanagementactivity/${id}/input`,
    approveHarvest: (id: number) => `/harvest/${id}/reject-harvest`,
    evaluateHarvest: (id: number) => `/harvest/${id}/evaluate`,
    rejectJoin: (userId: number, coopId: number) =>
      `/cooperative/${userId}/reject-join-cooperative/${coopId}`,
    approveLeaveCoop: (userId: number, coopId: number) =>
      `/cooperative/${userId}/approve-leave-cooperative/${coopId}`,
  },
  purchaseOrder: {
    new: '/purchaseorder',
    search: '/purchaseorder/search',
  },
  stakeholder: {
    new: '/stakeholder',
    search: '/stakeholder/search',
    types: '/stakeholder/types',
  },
  cooperative: {
    new: '/cooperative',
    search: '/cooperative/search',
    get: 'cooperative',
    assignAdmin: 'cooperative',
    unlinkAdmin: 'cooperative',
    addCoopFarmer: '/cooperative',
    approveFarmer: '/cooperative',
    searchCoopFarmer: '/cooperative/search-coop-farmers',
    update: (id: number) => `/cooperative/${id}`,
    // union
    newUnion: '/coop-unions',
    searchUnion: '/coop-unions/search',
    updateUnion: (id: number) => `/coop-unions/${id}`,
    assignAdminToUnion: '/coop-unions',
    coopJoinUnion: '/coop-unions',
    unlinkAdminFromUnion: (unionId: number, adminId: number) =>
      `/coop-unions${unionId}/remove-admin/${adminId}`,
    getCooperativeByUnionId: (unionId: number) => `/coop-unions/${unionId}/cooperatives`,
  },
  valuechain: {
    new: '/valuechain',
    search: '/valuechain/search',
  },
  mail: {
    list: '/mail/list',
    details: '/mail/details',
    labels: '/mail/labels',
  },
  post: {
    list: '/post/list',
    details: '/post/details',
    latest: '/post/latest',
    search: '/post/search',
  },
  product: {
    list: '/product/list',
    details: '/product/details',
    search: '/product/search',
  },
  invoice: {
    search: '/invoice/search',
    template: '/invoice/download-template',
    applyCheckOffDeduction: '/invoice/apply-checkoff-deductions',
    templateData: (coopId: number) =>
      `/invoice/pending-invoices-excel/download?cooperativeId=${coopId}`,
  },
  statistics: {
    get: '/stats/statistics',
  },
  notification: {
    search: '/brodcastmessage/search',
    new: '/brodcastmessage',
  },
  task: {
    search: '/task/search',
    new: '/task',
  },
  checkoffTransaction: {
    search: '/checkofftransaction/search',
    new: '/checkofftransaction',
  },
};
