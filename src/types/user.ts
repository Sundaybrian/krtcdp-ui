import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type CreateUser = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  mobilePhone: string;
  birthDate: string;
  ward: string;
  residence: string;
  county: string;
  maritalStatus: string;
  subCounty: string;
  kraPin: string;
  // Not required
  acceptTerms: boolean;
  isAdministrator: boolean;
  userState: string;
  isSupport: boolean;
  userType: string;
};

export type CoopFarmer = {
  user: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    password: string;
    mobilePhone: string;
    birthDate: string;
    ward: string;
    residence: string;
    county: string;
    subCounty: string;
    kraPin: string;
    // Not required
    acceptTerms: boolean;
    isAdministrator: boolean;
    userState: string;
    isSupport: boolean;
    userType: string;
  };
  farmer: {
    maritalStatus: string;
    hasInsurance: boolean;
    insuranceProvider: string;
    insuranceType: string;
  };
};

export type CoopFarmerList = {
  id: any;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  mobilePhone: string;
  birthDate: string;
  ward: string;
  residence: string;
  county: string;
  subCounty: string;
  kraPin: string;
  // Not required
  acceptTerms: boolean;
  isAdministrator: boolean;
  userState: string;
  isSupport: boolean;
  userType: string;
  Farmer: {
    maritalStatus: string;
    hasInsurance: boolean;
    insuranceProvider: string;
    insuranceType: string;
    cooperativeId?: number;
  };
  status: {
    status:
      | 'APPROVED'
      | 'REJECTED'
      | 'PENDINGAPPROVAL'
      | 'ACTIVE'
      | 'INACTIVE'
      | 'PENDINGEXITAPPROVAL';
  }[];
};

export type NewFarmer = {
  maritalStatus: string;
  hasInsurance: boolean;
  insuranceProvider: string;
  insuranceType: string;
};

export type NewStakeholder = {
  type: string;
  businessName: string;
  mobilePhone: string;
  yearOfRegistration: any;
  kraPin: string;
  residence: string;
  county: string;
  subCounty: string;
  ward: string;
  supplyChainId?: 0;
  valueChainType: string;
};

export type Stakeholder = {
  id: any;
  type: string;
  businessName: string;
  mobilePhone: string;
  yearOfRegistration: any;
  kraPin: string;
  residence: string;
  county: string;
  subCounty: string;
  ward: string;
  supplyChainId?: 0;
};

export type Cooperative = {
  id: number;
  type: string;
  businessName: string;
  mobilePhone: string;
  yearOfCreation: any;
  krapin: string;
  residence: string;
  county: string;
  subCounty: string;
  ward: string;
  supplyChainId?: 0;
  groupName: string;
  insuranceProvider: string;
  incorporationNumber: string;
  enterpriseCovered: string;
  insuranceType: string;
  hasInsurance: boolean;
  admins?: IUserItem[];
  cooperativeUnionId: number;
};

export type IUserItem = {
  id: any;
  coopId?: number;
  firstName: string;
  lastName: string;
  middleName: string;
  accountState: 'active' | 'inactive' | 'pending' | 'banned';
  userType:
    | 'SYSTEM_ADMIN'
    | 'ADMIN'
    | 'SUPPORT'
    | 'USER'
    | 'FARMER'
    | 'COOPERATIVE_ADMIN'
    | 'COOPERATIVE_UNION_ADMIN';
  email: string;
  mobilePhone: string;
  birthDate: string;
  maritalStatus: 'married' | 'single' | 'divorced' | 'widowed';
  kraPin: string;
  userState: string;
  residence: string;
  county: string;
  subCounty: string;
  ward: string;
  isAdministrator: boolean;
  isSupport: boolean;
  acceptTerms: boolean;
  avatarUrl: string;
  coopUnionId?: number;
};

export type IUserAccount = {
  city: string;
  email: string;
  state: string;
  about: string;
  address: string;
  zipCode: string;
  isPublic: boolean;
  displayName: string;
  phoneNumber: string;
  country: string | null;
  photoURL: File | string | null;
};

export type UserAccount = {
  acceptTerms: boolean;
  accountState: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  id: number;
  lastName: string;
  phonenumber: string;
  userType: 'SYSTEM_ADMIN' | 'ADMIN' | 'SUPPORT' | 'USER' | 'FARMER';
  verified: boolean;
  coopId?: number;
  coopUnionId?: number;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};

export type CreateUnion = {
  id?: number;
  name: string;
  location: string;
  registrationDate: string;
  totalCooperatives: any;
  contactEmail: string;
  phoneNumber: string;
  address: string;
};
