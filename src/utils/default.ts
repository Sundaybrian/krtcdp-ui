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
export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
export const RELATIONSHIP_OPTIONS = ['Parent', 'Sibling', 'Friend', 'Spouse', 'Child', 'Other'];
export const INSURANCE_TYPE_OPTIONS = ['weather index', 'individual indemnity', 'area yield index'];
export const USER_TYPES_FLAT = ['COOPERATIVE_ADMIN', 'SYSTEM_ADMIN', 'COOPERATIVE_UNION_ADMIN'];

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
      'view:myUnions',
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
  {
    role: 'COOPERATIVE_UNION_ADMIN',
    permissions: [
      'view:dashboard',
      'view:farmer',
      'view:product',
      'view:category',
      'view:county',
      'view:valuechain',
      'view:invoice',
      'view:order',
      'view:category',
      'view:users',
      'view:myCoops',
    ],
  },
];

export const TENANT_LOCAL_STORAGE = 'tenant';

export const UNIT_OF_MEASUREMENT = [
  'KG',
  'TON',
  'LITRE',
  'GALLON',
  'METRIC TON',
  'BAG',
  'BUNDLE',
  'CRATE',
  'PACK',
  'SACK',
  'TRUCK',
  'OTHER',
];

export const QUALITY_GRADE = ['GRADE A', 'GRADE B', 'GRADE C', 'GRADE D', 'GRADE E', 'GRADE F'];

export const TASKTYPES = ['GENERAL', 'MILK_PICK', 'DELIVERY', 'INSPECTION', 'OTHER'];
