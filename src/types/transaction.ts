import type { IUserItem } from './user';

export type FamerBalace = {
  cooperativeId: number;
  totalOwed: number;
  totalPaid: number;
  outstandingBalance: number;
  overDraft: number;
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
