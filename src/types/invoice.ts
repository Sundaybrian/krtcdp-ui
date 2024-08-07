import type { IDateValue, IAddressItem, IDatePickerControl } from './common';
import { CoopFarmerList, Cooperative } from './user';

// ----------------------------------------------------------------------

export type IInvoiceTableFilters = {
  name: string;
  status: string;
  service: string[];
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type IInvoiceItem = {
  id: string;
  title: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  description: string;
};

export type IInvoice = {
  id: string;
  sent: number;
  taxes: number;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  totalAmount: number;
  invoiceNumber: string;
  items: IInvoiceItem[];
  invoiceTo: IAddressItem;
  invoiceFrom: IAddressItem;
  createDate: IDateValue;
  dueDate: IDateValue;
};

export type InvoiceItem = {
  id: any;
  invoiceDate: string;
  status: 'PENDIND' | 'PAID' | 'CANCELLED' | 'LATE';
  amountBalance: number;
  amountPaid: number;
  amountDue: number;
  dueDate: string;
  purchaseOrderId: number;
  cooperativeId: number;
  cooperative: Cooperative;
  farmerId: number;
  farmer: CoopFarmerList;
  creationDate: string;
  lastModifiedDate: string;
  deleteAt: string;
};
