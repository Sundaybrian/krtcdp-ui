// import { IUserTypes } from 'src/types/default';

export type IUserTypes = {
  value: string;
  label: string;
};

export const USER_TYPES: IUserTypes[] = [
  // { value: 'SYSTEM_ADMIN', label: 'System Admin' },
  // { value: 'SYSTEM_USER', label: 'System User' },
  { value: 'FARMER', label: 'Farmer' },
  { value: 'IMMEDIATE_OFFTAKERS', label: 'Immediate Offtakers' },
  { value: 'AGRO_INPUT_DEALER', label: 'Agro Input Dealer' },
  { value: 'EQUIPMENT_PROVIDER', label: 'Equipment Provider' },
  { value: 'POST_HARVEST_PROVIDER', label: 'Post Harvest Provider' },
];

export const MARITAL_STATUS_OPTIONS = ['single', 'married', 'divorced', 'widowed'];
export const INSURANCE_TYPE_OPTIONS = ['weather index', 'individual indemnity', 'area yield index'];

export const PERMISSIONS = [
  {
    role: 'SYSTEM_ADMIN',
    permissions: [
      'view:county',
      'view:dashboard',
      'view:user',
      'view:cooperative',
      'view:management',
      'view:permission',
      'view:valuechain',
      'view:product',
      'view:order',
      'view:category',
      'view:farmer',
      'view:invoice',
    ],
  },
  {
    role: 'COOPERATIVE_ADMIN',
    permissions: [
      'view:dashboard',
      // 'view:cooperative',
      'view:farmer',
      'view:product',
      'view:category',
      'view:county',
      'view:valuechain',
      'view:invoice',
      'view:order',
      'view:category',
      'view:users',
    ],
  },
  {
    role: 'SYSTEM_USER',
    permissions: ['view:dashboard'],
  },
  {
    role: 'FARMER',
    permissions: ['view:dashboard'],
  },
  {
    role: 'IMMEDIATE_OFFTAKERS',
    permissions: ['view:dashboard'],
  },
  {
    role: 'AGRO_INPUT_DEALER',
    permissions: ['view:dashboard'],
  },
  {
    role: 'EQUIPMENT_PROVIDER',
    permissions: ['view:dashboard'],
  },
  {
    role: 'POST_HARVEST_PROVIDER',
    permissions: ['view:dashboard'],
  },
];

export const TENANT_LOCAL_STORAGE = 'tenant';
