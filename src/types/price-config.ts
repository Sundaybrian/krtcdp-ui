// ----------------------------------------------------------------------

export type IPriceConfig = {
  id?: number;
  price: number;
  effectiveDate: string;
  cooperativeId: number;
  productName: string;
  createdAt?: string;
  updatedAt?: string;
};

export type IPriceConfigTableFilters = {
  name: string;
  productName: string[];
  cooperativeId: number[];
  startDate: any | null;
  endDate: any | null;
};
