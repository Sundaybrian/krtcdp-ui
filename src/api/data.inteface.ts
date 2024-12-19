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

export interface Ipagination<T> {
  page: number;
  limit: number;
  total: number;
  data: T;
}

export interface Ward {
  id: number;
  name: string;
  code: number;
  subCountyId: number;
}

// add permission interface here
export interface Permission {
  id: number;
  name: string;
  description: string;
  role: Role;
  actionId: number;
}

export interface Role {
  id: number;
  name: string;

  permissions: Permission[];
}

// add application interface here
export interface Application {
  id: number;
  name: string;
  description: string;
}

export interface AppUser {
  id: number;
  username: string;
}

// user roles interface
export interface UserRoles {
  id: number;
  userId: number;
  roleId: number;
  role: Role;
  user: AppUser;
}

export interface Action {
  id: number;
  name: string;
  description: string;
  selected?: boolean;
}

export interface Otp {
  id: number;
  userId: number;
  otp: number;
  createdAt: Date;
  updatedAt: Date;
}
