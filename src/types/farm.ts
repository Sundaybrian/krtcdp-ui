import { CoopFarmerList } from './user';

export type ValueChain = {
  id: number;
  name: string;
  creationDate: string;
  valueChainType: string;
};

export type Farm = {
  valueChains: ValueChain[];
  latitude: number;
  longitude: number;
  polygon: string;
  lastModifiedDate: string;
  id: number;
  sizeInAcres: number;
  ownershipType: string;
  county: string;
  subCounty: string;
  ward: string;
  ecologicalZone: string;
  soilType: string;
  irrigationMethod: string;
  farmingCategory: string;
  creationDate: string;
  userId: number;
  hasInsurance: boolean;
  insuranceProvider: string;
  insuranceType: string;
};

export type Harvest = {
  id: any;
  farmId: number;
  crop: string;
  quantity: number;
  unit: string;
  date: string;
  userId: number;
  creationDate: string;
  quality: string;
  status: 'PENDINGCONFIRMATION' | 'APPROVED' | 'REJECTED' | 'PENDING';
  harvestDate: string;
  farmerId: number;
  cooperativeId: number;
  partitionId: number;
  lastModifiedDate: string;
  deleteAt: string;
};

export type Grn = {
  id: any;
  harvestId: number;
  approvedQuantity: number;
  cooperativeId: number;
  date: string;
  farmerId: number;
  creationDate: string;
  status: 'PENDINGCONFIRMATION' | 'APPROVED' | 'REJECTED' | 'PENDING';
  lastModifiedDate: string;
  deleteAt: string;
  receivedDate: string;
  farmer: CoopFarmerList;
};
