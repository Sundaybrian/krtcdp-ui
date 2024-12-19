import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const permissionAxios = axios.create({
  baseURL: CONFIG.site.permissionBaseUrl,
});

permissionAxios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

console.log('--------------------------------------------');

console.log(CONFIG.site.permissionBaseUrl);

console.log('--------------------------------------------');

export default permissionAxios;

// ----------------------------------------------------------------------

export const permissionFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await permissionAxios.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch permission:', error);
    throw error;
  }
};

export const permissionCreator = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await permissionAxios.post(url, { ...config?.params }, { params: {} });

    return res.data;
  } catch (error) {
    console.error('Failed to create permission:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const permissionEndpoints = {
  roles: {
    get: '/role',
    create: '/role',
    update: (id: number) => `/api/roles/${id}`,
    delete: (id: number) => `/api/roles/${id}`,
  },
  userRoles: {
    get: '/user-role',
    create: '/user-role',
    update: (id: number) => `/api/user-roles/${id}`,
    delete: (id: number) => `/api/user-roles/${id}`,
  },
  appUsers: {
    get: '/mambu-users',
    create: '/mambu-users',
    update: (id: number) => `/api/app-users/${id}`,
    delete: (id: number) => `/api/app-users/${id}`,
  },
  permissions: {
    get: '/permission',
    create: '/permission',
    authorize: 'authorize',
    assign: (roleId: number) => `/api/roles/${roleId}/permissions`,
    getRolePermissions: (roleId: number) => `/api/roles/${roleId}/permissions`,
  },
  applications: {
    get: '/application',
  },
  actions: {
    get: '/action',
  },
};
