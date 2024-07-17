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
