'use client';

import type { UserAccount } from 'src/types/user';
import type { NewUserSchemaType } from 'src/sections/user/user-new-edit-form';

import axios, { endpoints } from 'src/axios/axios';
import { authorizeUser } from 'src/api/permission';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';
import { PERMISSIONS } from 'src/utils/default';

// ----------------------------------------------------------------------

export type SignInParams = {
  access_token: string;
  refresh_token: string;
  user: UserAccount;
};

export type SignInWithPasswordParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: UserAccount;
};
/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async (auth: SignInParams): Promise<void> => {
  try {
    // const params = { email, password };

    // const res = await axios.post(endpoints.auth.signIn, params);

    const { access_token } = auth;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    setSession(access_token);

    // get user permissions
    authorizeUser({ username: auth.user.email, action: 'accessApp' })
      .then((permissions) => {
        let defaultCoopAdminPermissions: any = [];
        if (auth.user.userType === 'COOPERATIVE_ADMIN') {
          const perms = PERMISSIONS.find((permission) => permission.role === 'COOPERATIVE_ADMIN');
          defaultCoopAdminPermissions = perms?.permissions || [];
        }
        // save to cache
        localStorage.setItem(
          'permissions',
          JSON.stringify({
            permissions: [...permissions?.data?.permissions, ...defaultCoopAdminPermissions],
            isSuperAdmin: permissions?.data?.isSuperAdmin || auth.user.userType === 'SYSTEM_ADMIN',
          })
        );
      })
      .catch((error) => {
        console.error('Error during sign in:', error);
      });

    // save to cache
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};
/** **************************************
 * Sign in with userbame and pass
 *************************************** */
export const signInWithEmailPassword = async (
  data: SignInWithPasswordParams
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(endpoints.auth.signIn, data);
    return response.data;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async (data: NewUserSchemaType): Promise<void> => {
  try {
    const res = await axios.post(endpoints.auth.signUp, data);

    const { access_token } = res.data;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, access_token);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
    // clear user permissions
    localStorage.removeItem('permissions');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
