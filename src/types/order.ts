import type { Grn } from './farm';
import type { Cooperative, CoopFarmerList } from './user';
import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

export type IOrderHistory = {
  orderTime: IDateValue;
  paymentTime: IDateValue;
  deliveryTime: IDateValue;
  completionTime: IDateValue;
  timeline: { title: string; time: IDateValue }[];
};

export type IOrderShippingAddress = {
  fullAddress: string;
  phoneNumber: string;
};

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
};

export type IOrderDelivery = {
  shipBy: string;
  speedy: string;
  trackingNumber: string;
};

export type IOrderCustomer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  ipAddress: string;
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
};

export type IOrderItem = {
  id: string;
  taxes: number;
  status: string;
  shipping: number;
  discount: number;
  subtotal: number;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  createdAt: IDateValue;
  history: IOrderHistory;
  payment: IOrderPayment;
  customer: IOrderCustomer;
  delivery: IOrderDelivery;
  items: IOrderProductItem[];
  shippingAddress: IOrderShippingAddress;
};

export type PurchaseOrderItem = {
  id: any;
  orderDate: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  terms: string;
  grnId: number;
  grn: Grn;
  farmerId: 0;
  farmer: CoopFarmerList;
  cooperativeId: number;
  cooperative: Cooperative;
  creationDate: string;
  lastModifiedDate: string;
  deleteAt: string;
};

export type Order = {
  id: any;
  orderNumber: string;
  subTotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  shippingAddress: IOrderShippingAddress;
  trackingNumber: string;
  createdAt: IDateValue;
  updatedAt: IDateValue;
  productId: number;
  userId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalAmount: number;
  notes: string;
  items: {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discount: number;
    product: {
      id: number;
      name: string;
      price: number;
      stockQuantity: number;
    };
    deliveryDate: IDateValue;
  }[];
  payments: {
    id: number;
    orderId: number;
    amount: number;
    method: 'MPESA' | 'CREDIT_CARD' | 'PAYPAL';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    reference: string;
    currency: string;
  }[];
};
