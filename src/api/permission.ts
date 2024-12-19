import axios, { permissionEndpoints } from 'src/axios/permission';
// Function to fetch all roles
export const getRoles = async () => {
  try {
    const response = await axios.get(permissionEndpoints.roles.get);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Function to create a new role
export const createRole = async (roleData: any) => {
  try {
    const response = await axios.post(permissionEndpoints.roles.create, roleData);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// Function to update a role
export const updateRole = async (id: number, roleData: any) => {
  try {
    const response = await axios.put(permissionEndpoints.roles.update(id), roleData);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

// Function to delete a role
export const deleteRole = async (id: number) => {
  try {
    const response = await axios.delete(permissionEndpoints.roles.delete(id));
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

// Function to fetch all permissions
export const getPermissions = async () => {
  try {
    const response = await axios.get(permissionEndpoints.permissions.get);
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

// user roles
export const getUserRoles = async () => {
  try {
    const response = await axios.get(permissionEndpoints.userRoles.get);
    return response.data;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};

// create user role
export const createUserRole = async (roleData: any) => {
  try {
    const response = await axios.post(permissionEndpoints.userRoles.create, roleData);
    return response.data;
  } catch (error) {
    console.error('Error creating user role:', error);
    throw error;
  }
};

// create role permission
export const createRolePermission = async (roleData: any) => {
  try {
    const response = await axios.post(permissionEndpoints.permissions.create, roleData);
    return response.data;
  } catch (error) {
    console.error('Error creating role permission:', error);
    throw error;
  }
};

// authorize user
export const authorizeUser = async (roleData: any) => {
  try {
    const response = await axios.post(permissionEndpoints.permissions.authorize, roleData, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `ApiKey ${process.env.NEXT_PUBLIC_PERMISSION_APP_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error authorizing user:', error);
    return error;
  }
};
