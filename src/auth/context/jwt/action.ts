'use client';

import type { UserAccount } from 'src/types/user';
import type { NewUserSchemaType } from 'src/sections/user/user-new-edit-form';

import axios, { endpoints } from 'src/axios/axios';
import { authorizeUser } from 'src/api/permission';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  access_token: string;
  refresh_token: string;
  user: UserAccount;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
        // save to cache
        console.log('permissions:', permissions?.data?.permissions);

        localStorage.setItem('permissions', JSON.stringify(permissions?.data?.permissions || []));
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
