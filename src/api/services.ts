import type { ItaskNew } from 'src/types/task';
import type { InvoiceItem } from 'src/types/invoice';
import type { CategoryData } from 'src/types/category';
import type { CreateCooperative } from 'src/types/cooperative';
import type { Order, PurchaseOrderItem } from 'src/types/order';
import type { IProduct, IProductItem } from 'src/types/product';
import type { ValueChain, NewValueChain } from 'src/types/value-chain';
import type { ITicket, IcartItem, INotification } from 'src/types/notification';
import type { Grn, Farm, Harvest, Expense, CreateExpense, WarehouseReceipt } from 'src/types/farm';
import type {
  FamerBalace,
  InsuranceProvider,
  IcheckoffTransactionApply,
} from 'src/types/transaction';
import type {
  IUserItem,
  NewFarmer,
  CoopFarmer,
  CreateUser,
  Cooperative,
  Stakeholder,
  UserAccount,
  CreateUnion,
  CoopFarmerList,
  NewStakeholder,
} from 'src/types/user';

import axios, { endpoints, pageLimit } from 'src/axios/axios';

import type { Otp, Page, Ward, County } from './data.inteface';

// auth - sign in with mobile phone
export const signInWithMobilePhone = async (data: any): Promise<Otp> => {
  try {
    const response = await axios.post(endpoints.auth.signInWithOtp, data);
    return response.data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// validate OTP
export const validateOtp = async (data: any) => {
  try {
    const response = await axios.post(endpoints.auth.verifyOtp, data);
    return response.data;
  } catch (error) {
    console.error('Error validating OTP:', error);
    throw error;
  }
};

// Function to fetch users
export const getUsers = async (query = {}): Promise<Page<IUserItem[]>> => {
  try {
    const response = await axios.post(endpoints.users.search, {
      page: 0,
      limit: pageLimit,
      ...query,
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

// get wards based on subcounty ID
export const getWards = async (id: number): Promise<Array<Ward>> => {
  try {
    const response = await axios.get(endpoints.region.ward(id));
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
};

// farmers
export const getFarmers = async (query = {}): Promise<Page<IUserItem[]>> => {
  try {
    const response = await axios.get(endpoints.farmer.search, {
      params: {
        page: 0,
        limit: pageLimit,
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

// download farmer template
export const downloadFarmerTemplate = async () => {
  try {
    return await axios.get(endpoints.farmer.template, {
      responseType: 'blob',
    });
  } catch (error) {
    console.error('Error downloading farmer template:', error);
    throw error;
  }
};

// bulk upload farmers
export const bulkUploadFarmers = async (coopId: number, data: FormData) => {
  try {
    const response = await axios.post(endpoints.farmer.bulkUpload(coopId), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading farmers:', error);
    throw error;
  }
};

// stakeholders
export const getStakeholders = async (query = {}): Promise<Page<Stakeholder[]>> => {
  try {
    const response = await axios.get(endpoints.stakeholder.search, {
      params: {
        page: 0,
        limit: pageLimit,
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

// update cooperative
export const updateCooperative = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.cooperative.update(id)}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating cooperative:', error);
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
        page: 0,
        limit: pageLimit,
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
  try {
    const response = await axios.post(
      endpoints.cooperative.searchCoopFarmer,
      {
        page: 1,
        limit: 1000,
      },
      {
        params: {
          page: 1,
          limit: 1000,
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
        limit: pageLimit,
      },
      {
        params: {
          page: 1,
          limit: pageLimit,
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
        limit: pageLimit,
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
        limit: pageLimit,
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
        page: 0,
        limit: pageLimit,
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
        limit: pageLimit,
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
        limit: pageLimit,
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

// get user orders
export const getUserOrders = async (query = {}): Promise<Page<Order[]>> => {
  try {
    const response = await axios.get(endpoints.orders.myOrders, {
      params: {
        page: 0,
        limit: pageLimit,
        ...query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
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
        limit: pageLimit,
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

// search warehouse reciepts
export const searchWarehouseReceipts = async (query = {}): Promise<Page<WarehouseReceipt[]>> => {
  try {
    const response = await axios.post(
      endpoints.farmer.searchWarehouseReceipt,
      {
        page: 1,
        limit: pageLimit,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Receipts:', error);
    throw error;
  }
};

// create warehouse reciept
export const createWarehouseReceipt = async (data: any) => {
  try {
    const response = await axios.post(endpoints.farmer.newWarehouseReceipt, data);
    return response.data;
  } catch (error) {
    console.error('Error adding warehouse receipt:', error);
    throw error;
  }
};

// download invoice template
export const downloadInvoiceTemplate = async () => {
  try {
    const response = await axios.get(endpoints.invoice.template);
    return response.data;
  } catch (error) {
    console.error('Error downloading invoice template:', error);
    throw error;
  }
};

// download invoice template data
export const downloadInvoiceTemplateData = async (id: number) => {
  try {
    const response = await axios.get(endpoints.invoice.templateData(id), {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error downloading invoice template data:', error);
    throw error;
  }
};

// create coop union
export const createUnion = async (data: CreateUnion) => {
  try {
    const response = await axios.post(endpoints.cooperative.newUnion, data);
    return response.data;
  } catch (error) {
    console.error('Error adding union:', error);
    throw error;
  }
};

// patch a coop union
export const updateUnion = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.cooperative.updateUnion(id)}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating union:', error);
    throw error;
  }
};

// asign admin to union
export const assignAdminToUnion = async (id: number, data: { userId: number }) => {
  try {
    const response = await axios.post(
      `${endpoints.cooperative.assignAdminToUnion}/${id}/add-admin`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error adding union:', error);
    throw error;
  }
};

// coop join union
export const coopJoinUnion = async (id: number, data: { cooperativeId: number }) => {
  try {
    const response = await axios.post(
      `${endpoints.cooperative.coopJoinUnion}/${id}/assign-cooperative`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error joining union:', error);
    throw error;
  }
};

// unlink coop admin  from union
export const unlinkCoopAdminFromUnion = async (unionId: number, userId: number) => {
  try {
    const response = await axios.delete(
      endpoints.cooperative.unlinkAdminFromUnion(unionId, userId)
    );
    return response.data;
  } catch (error) {
    console.error('Error unlinking coop admin:', error);
    throw error;
  }
};

// get cooperative by union id
export const getCooperativeByUnionId = async (id: number): Promise<Array<Cooperative>> => {
  try {
    const response = await axios.get(endpoints.cooperative.getCooperativeByUnionId(id));
    return response.data;
  } catch (error) {
    console.error('Error fetching cooperative:', error);
    throw error;
  }
};

// create farm expense
export const createFarmExpense = async (id: number, data: CreateExpense) => {
  try {
    const response = await axios.post(endpoints.farmer.newExpense(id), data);
    return response.data;
  } catch (error) {
    console.error('Error adding farm expense:', error);
    throw error;
  }
};

// search farm expense
export const searchFarmExpense = async (query = {}): Promise<Page<Expense[]>> => {
  try {
    const response = await axios.post(
      endpoints.farmer.searchExpense,
      {
        page: 1,
        limit: pageLimit,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching farm expense:', error);
    throw error;
  }
};

// get notifications
export const searchNotifications = async (query = {}): Promise<Page<INotification[]>> => {
  try {
    const response = await axios.post(endpoints.notification.search, {
      page: 1,
      limit: pageLimit,
      ...query,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// create notification
export const createNotification = async (data: any) => {
  try {
    const response = await axios.post(endpoints.notification.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

// create task
export const createTask = async (data: ItaskNew) => {
  try {
    const response = await axios.post(endpoints.task.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// apply check off deduction
export const applyCheckOffDeduction = async (data: IcheckoffTransactionApply) => {
  try {
    const response = await axios.post(endpoints.invoice.applyCheckOffDeduction, data);
    return response.data;
  } catch (error) {
    console.error('Error applying check off:', error);
    throw error;
  }
};

// create check off deduction
export const createCheckOffDeduction = async (data: any) => {
  try {
    const response = await axios.post(endpoints.checkoffTransaction.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding check off:', error);
    throw error;
  }
};

// get farmer balance
export const getFarmerBalance = async (id: number): Promise<FamerBalace> => {
  try {
    const response = await axios.get(endpoints.farmer.getBalance(id));
    console.log(response, 'response');

    return response.data;
  } catch (error) {
    console.error('Error fetching farmer balance:', error);
    throw error;
  }
};

// search farmer balance
export const searchFarmerBalance = async (query = {}): Promise<Page<FamerBalace[]>> => {
  try {
    const response = await axios.post(
      endpoints.farmer.searchBalance,
      {
        page: 1,
        limit: pageLimit,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching farmer balance:', error);
    throw error;
  }
};

// create next of kin
export const createNextOfKin = async (data: any) => {
  try {
    const response = await axios.post(endpoints.farmer.newNextOfKin, data);
    return response.data;
  } catch (error) {
    console.error('Error adding next of kin:', error);
    throw error;
  }
};

// insurance provider
export const searchInsuranceProviders = async (query = {}): Promise<Page<InsuranceProvider[]>> => {
  try {
    const response = await axios.post(
      endpoints.insuranceProvider.search,
      {
        page: 1,
        limit: pageLimit,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching insurance providers:', error);
    throw error;
  }
};

// create insurance
export const createInsuranceProvider = async (data: any) => {
  try {
    const response = await axios.post(endpoints.insuranceProvider.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding insurance:', error);
    throw error;
  }
};

// product
export const searchProducts = async (query = {}): Promise<Page<IProductItem[]>> => {
  try {
    const response = await axios.get(endpoints.product.search, {
      params: {
        page: 0,
        limit: pageLimit,
        ...query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// get product by id
export const getProductById = async (id: number): Promise<IProductItem> => {
  try {
    const response = await axios.get(`${endpoints.product.get}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return error;
  }
};

// create product
export const createProduct = async (data: IProduct) => {
  try {
    const response = await axios.post(endpoints.product.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// update product
export const updateProduct = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.product.update(id)}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// upload product image
export const uploadProductImage = async (id: number, data: FormData) => {
  try {
    const response = await axios.post(endpoints.product.uploadImage(id), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
};

// tickets
export const searchTickets = async (query = {}): Promise<Page<ITicket[]>> => {
  try {
    const response = await axios.post(
      endpoints.ticket.search,
      {
        page: 1,
        limit: pageLimit,
        ...query,
      },
      {
        params: {},
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// create ticket
export const createTicket = async (data: any) => {
  try {
    const response = await axios.post(endpoints.ticket.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error;
  }
};

// update ticket
export const updateTicket = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${endpoints.ticket.update(id)}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

// approve ticket
export const approveTicket = async (id: number, data: any) => {
  try {
    const response = await axios.post(`${endpoints.ticket.approve(id)}`, data);
    return response.data;
  } catch (error) {
    console.error('Error approving ticket:', error);
    throw error;
  }
};

//  create cart
export const createCart = async (data: any) => {
  try {
    const response = await axios.post(endpoints.cart.new, data);
    return response.data;
  } catch (error) {
    console.error('Error adding cart:', error);
    throw error;
  }
};

// search cart by user id
export const searchCart = async (query = {}): Promise<IcartItem> => {
  try {
    const response = await axios.get(
      endpoints.cart.search,

      {
        params: {
          page: 0,
          limit: pageLimit,
          ...query,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// cart checkout
export const cartCheckout = async (data: any) => {
  try {
    const response = await axios.post(endpoints.cart.checkout, data);
    return response.data;
  } catch (error) {
    console.error('Error checking out cart:', error);
    throw error;
  }
};
