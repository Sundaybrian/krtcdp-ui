import axios, { endpoints } from 'src/axios/axios';
import { CreateUser, IUserItem } from 'src/types/user';
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
