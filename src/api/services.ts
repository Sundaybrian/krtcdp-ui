import axios, { endpoints } from 'src/axios/axios';
import {
  CoopFarmer,
  CoopFarmerList,
  Cooperative,
  CreateUser,
  IUserItem,
  NewFarmer,
  NewStakeholder,
  Stakeholder,
  UserAccount,
} from 'src/types/user';
import { CreateCooperative } from 'src/types/cooperative';
import { NewValueChain, ValueChain } from 'src/types/value-chain';
import { CategoryData } from 'src/types/category';

import { Farm, Grn, Harvest } from 'src/types/farm';
import { PurchaseOrderItem } from 'src/types/order';
import { InvoiceItem } from 'src/types/invoice';

import { County, Page } from './data.inteface';

// Function to fetch users
export const getUsers = async (query = {}): Promise<Page<IUserItem[]>> => {
  try {
    const response = await axios.get(endpoints.users.search, {
      params: {
        page: 1,
        limit: 20,
        ...query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Function to add a user
export const addUser = async (user: CreateUser) => {
  try {
    const response = await axios.post(endpoints.auth.adminAddUser, user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.users.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// get user by id
export const getUserById = async (id: number): Promise<UserAccount> => {
  try {
    const response = await axios.get(`${endpoints.users.get}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// get user types
export const getUserTypes = async (): Promise<string[]> => {
  try {
    const response = await axios.get(endpoints.users.types);
    return response.data;
  } catch (error) {
    console.error('Error fetching user types:', error);
    throw error;
  }
};

// get stakeholder types
export const getStakeholderTypes = async (): Promise<string[]> => {
  try {
    const response = await axios.get(endpoints.stakeholder.types);
    return response.data;
  } catch (error) {
    console.error('Error fetching stakeholder types:', error);
    throw error;
  }
};

// get current user
export const getCurrentUser = async (): Promise<UserAccount> => {
  try {
    const response = await axios.get(endpoints.auth.me);
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const chnageUserStatus = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.users.changeStatus}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error changing user status:', error);
    throw error;
  }
};

export const chnageUserState = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.users.changeState}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error changing user status:', error);
    throw error;
  }
};

// Function to fetch counties
export const getCounties = async (): Promise<Array<County>> => {
  try {
    const response = await axios.get(endpoints.region.county);
    return response.data;
  } catch (error) {
    console.error('Error fetching counties:', error);
    throw error;
  }
};

// add county

export const addCounty = async (county: any) => {
  try {
    const response = await axios.post(endpoints.region.county, county);
    return response.data;
  } catch (error) {
    console.error('Error adding county:', error);
    throw error;
  }
};

// new subcounty
export const addSubCounty = async (subcounty: any) => {
  try {
    const response = await axios.post(endpoints.region.subcounty, subcounty);
    return response.data;
  } catch (error) {
    console.error('Error adding subcounty:', error);
    throw error;
  }
};

// farmers
export const getFarmers = async (query = {}): Promise<Page<IUserItem[]>> => {
  try {
    const response = await axios.get(endpoints.farmer.search, {
      params: {
        page: 1,
        limit: 20,
        ...query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching farmers:', error);
    throw error;
  }
};

// create farmer
export const createFarmer = async (id: number, farmer: NewFarmer) => {
  try {
    const response = await axios.post(`${endpoints.farmer.new}/${id}`, farmer);
    return response.data;
  } catch (error) {
    console.error('Error adding farmer:', error);
    throw error;
  }
};

// stakeholders
export const getStakeholders = async (query = {}): Promise<Page<Stakeholder[]>> => {
  try {
    const response = await axios.get(endpoints.stakeholder.search, {
      params: {
        page: 1,
        limit: 20,
        ...query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stakeholders:', error);
    throw error;
  }
};

export const createStakeholder = async (id: number, stakeholder: NewStakeholder) => {
  try {
    const response = await axios.post(`${endpoints.stakeholder.new}/${id}`, stakeholder);
    return response.data;
  } catch (error) {
    console.error('Error adding stakeholders:', error);
    throw error;
  }
};

/**
 * Creates a new cooperative entity
 * @param data of type NewCooperative
 * @returns A promise that resolves to a newly created cooperative
 */

export const createCooperative = async (data: CreateCooperative) => {
  try {
    const response = await axios.post(`${endpoints.cooperative.new}`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding cooperative:', error);
    throw error;
  }
};

/**
 * Fetches all cooperatives
 * @param query any eg limit:10
 * @returns A promise that resolves to an array of cooperatives
 */
export const getCooperatives = async (query = {}): Promise<Page<Cooperative[]>> => {
  try {
    const response = await axios.get(endpoints.cooperative.search, {
      params: {
        page: 1,
        limit: 20,
        ...query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cooperatives:', error);
    throw error;
  }
};

// get cooperative by id
export const getCooperativeById = async (id: number): Promise<Cooperative> => {
  try {
    const response = await axios.get(`${endpoints.cooperative.get}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cooperative:', error);
    throw error;
  }
};

export const assignAdminToCoop = async (id: number, data: { admins: number[] }) => {
  try {
    const response = await axios.patch(
      `${endpoints.cooperative.assignAdmin}/${id}/assign-admin`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error adding cooperative:', error);
    throw error;
  }
};

export const addCoopFarmer = async (coopId: number, user: CoopFarmer) => {
  try {
    const response = await axios.post(
      `${endpoints.cooperative.addCoopFarmer}/${coopId}/create-farmer`,
      user
    );
    return response.data;
  } catch (error) {
    console.error('Error adding coop farmer:', error);
    throw error;
  }
};

export const searchCoopFarmers = async (query = {}): Promise<Page<CoopFarmerList[]>> => {
  console.log(query, 'query');

  try {
    const response = await axios.post(
      endpoints.cooperative.searchCoopFarmer,
      {},
      {
        params: {
          page: 1,
          limit: 20,
          ...query,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// get farmer by id
export const getFarmerById = async (id: number): Promise<CoopFarmerList> => {
  try {
    const response = await axios.get(`${endpoints.farmer.get}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching farmer:', error);
    throw error;
  }
};

// unlick coop admins
export const unlinkCoopAdmin = async (coopId: number, userId: number) => {
  try {
    const response = await axios.delete(
      `${endpoints.cooperative.unlinkAdmin}/${coopId}/unlink-admin-cooperative/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error unlinking coop admin:', error);
    throw error;
  }
};

// aprove coop farmer
export const approveCoopFarmer = async (coopId: number, userId: number) => {
  try {
    const response = await axios.post(
      `${endpoints.cooperative.approveFarmer}/${userId}/approve-join-cooperative/${coopId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error approving coop farmer:', error);
    throw error;
  }
};

// reject farmer join
export const rejectCoopFarmer = async (coopId: number, userId: number) => {
  try {
    const response = await axios.post(endpoints.farmer.rejectJoin(userId, coopId));
    return response.data;
  } catch (error) {
    console.error('Error rejecting coop farmer:', error);
    throw error;
  }
};

// approve leave coop
export const approveLeaveCoop = async (coopId: number, userId: number) => {
  try {
    const response = await axios.post(endpoints.farmer.approveLeaveCoop(userId, coopId));
    return response.data;
  } catch (error) {
    console.error('Error approving leave coop:', error);
    throw error;
  }
};

// create value chain
export const createValueChain = async (data: NewValueChain) => {
  try {
    const response = await axios.post(endpoints.valuechain.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding value chain:', error);
    throw error;
  }
};

// create category
export const createCategory = async (data: any) => {
  try {
    const response = await axios.post(endpoints.category.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// search categories
export const searchCategories = async (query = {}): Promise<Page<CategoryData[]>> => {
  try {
    const response = await axios.post(
      endpoints.category.search,
      {
        page: 1,
        limit: 20,
      },
      {
        params: {
          page: 1,
          limit: 20,
          ...query,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// search farmers
export const searchFarms = async (query = {}): Promise<Page<Farm[]>> => {
  try {
    const response = await axios.post(
      endpoints.farmer.searchFarms,
      {
        page: 1,
        limit: 20,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching farmers:', error);
    throw error;
  }
};

// search haversts
export const searchHarvests = async (query = {}): Promise<Page<Harvest[]>> => {
  try {
    const response = await axios.post(
      endpoints.farmer.searchHarvests,
      {
        page: 1,
        limit: 20,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching harvests:', error);
    throw error;
  }
};

// aprove harvest
export const approveHarvest = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.farmer.approveHarvest(id)}`, data);
    return response.data;
  } catch (error) {
    console.error('Error approving harvest:', error);
    throw error;
  }
};

// evaluate harvet
export const evaluateHarvest = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.farmer.evaluateHarvest(id)}`, data);
    return response.data;
  } catch (error) {
    console.error('Error evaluating harvest:', error);
    throw error;
  }
};

// search farm value chain's
export const searchFarmValueChain = async (query = {}): Promise<Page<ValueChain[]>> => {
  try {
    const response = await axios.post(
      endpoints.farmer.searchFarmValueChain,
      {
        page: 1,
        limit: 20,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching farm value chain:', error);
    throw error;
  }
};

// search grn
export const searchGrn = async (query = {}): Promise<Page<Grn[]>> => {
  try {
    const response = await axios.post(
      endpoints.farmer.searchGrn,
      {
        page: 1,
        limit: 20,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching grn:', error);
    throw error;
  }
};

// create purchase order
export const createPurchaseOrder = async (data: any) => {
  try {
    const response = await axios.post(endpoints.purchaseOrder.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding purchase order:', error);
    throw error;
  }
};

// search purchase order
export const searchPurchaseOrder = async (query = {}): Promise<Page<PurchaseOrderItem[]>> => {
  try {
    const response = await axios.post(
      endpoints.purchaseOrder.search,
      {
        page: 1,
        limit: 20,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    throw error;
  }
};

// search invoice
export const searchInvoice = async (query = {}): Promise<Page<InvoiceItem[]>> => {
  try {
    const response = await axios.post(
      endpoints.invoice.search,
      {
        page: 1,
        limit: 20,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};
