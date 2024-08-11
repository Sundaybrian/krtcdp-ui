export interface SubCounty {
  id: number;
  name: string;
  code: number;
}

export interface County {
  id: any;
  name: string;
  code: number;
  capital: string;
  subCounties: SubCounty[];
}

export interface Page<T> {
  results: T;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  totalItems: number;
  totalPages: number;
}

export interface Ward {
  id: number;
  name: string;
  code: number;
  subCountyId: number;
}
