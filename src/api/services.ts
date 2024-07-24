import axios, { endpoints } from 'src/axios/axios';
import {
  CoopFarmer,
  Cooperative,
  CreateUser,
  IUserItem,
  NewFarmer,
  NewStakeholder,
  Stakeholder,
} from 'src/types/user';
import { CreateCooperative } from 'src/types/cooperative';

import { County, Page } from './data.inteface';
import { NewValueChain } from 'src/types/value-chain';

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

export const chnageUserStatus = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.users.changeStatus}/${id}`, data);
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

export const searchCoopFarmers = async (query = {}): Promise<Page<IUserItem[]>> => {
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
