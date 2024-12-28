import type { IUserItem } from './user';

export type FamerBalace = {
  id?: number;
  cooperativeId: number;
  totalOwed: number;
  totalPaid: number;
  outstandingBalance: number;
  overDraft: number;
  farmerId?: number;
};
export type IcheckoffTransaction = {
  id: any;
  userId: number;
  user: IUserItem;
  cooperativeId: number;
  cooperative: Record<string, any>;
  transactionType: string;
  amount: number;
  commodity: string;
  narration: string;
  farmerBalanceId: number;
  farmerBalance: FamerBalace;
  creationDate: string;
  lastModifiedDate: string;
};

export type IcheckoffTransactionApply = {
  status: string;
  cooperativeId: number;
  invoiceId: number[];
};

export type InsuranceProvider = {
  description: string;
  coverageTypes: string[];
  specialFeatures: string[];
  targetMarket: string[];
  contactPhone: string;
  contactEmail: string;
  website: string;
  creationDate: string;
  deletedAt: string;
  lastModifiedDate: string;
  id: string;
  name: string;
};
