import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
};

export type IProductReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  postedAt: IDateValue;
  isPurchased: boolean;
  attachments?: string[];
};

export type IProductItem = {
  id: any;
  sku: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  sizes: string[];
  publish: string;
  gender: string[];
  coverUrl: string;
  images: string[];
  colors: string[];
  quantity: number;
  category: string;
  categoryId: number;
  subCategoryId: number;
  saleStartDate: any;
  saleEndDate: any;
  isOnSale: boolean;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  createdAt: IDateValue;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  marketPrice: number | null;
  reviews: IProductReview[];
  unit: string | null;
  onSale: boolean;
  stockQuantity: number;
  minStockLevel: number;
  taxRate: number;
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  saleLabel: {
    enabled: boolean;
    content: string;
  };
  newLabel: {
    enabled: boolean;
    content: string;
  };
};

export type IProduct = {
  name: string;
  description: string;
  images: any[];
  stockQuantity: number;
  sku?: string;
  price: number;
  minStockLevel: number;
  marketPrice: number;
  tags: string[];
  taxRate: number;
  unit?: string;
  saleStartDate?: any;
  saleEndDate?: any;
  category: string;
  categoryId: number;
  subCategoryId: number;
  isOnSale?: boolean;
};
