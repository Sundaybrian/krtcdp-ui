import { useState, useEffect } from 'react';
import { getCurrentUser } from 'src/api/services';
import { UserAccount } from 'src/types/user';

const useAuthUser = (): UserAccount => {
  const [authUser, setAuthUser] = useState<UserAccount>({
    acceptTerms: false,
    email: '',
    firstName: '',
    lastName: '',
    accountState: '',
    emailVerified: false,
    phonenumber: '',
    userType: 'USER',
    verified: false,
    id: 0,
  });

  useEffect(() => {
    // Your authentication logic here
    // For example, you can fetch the authenticated user from an API endpoint
    const fetchAuthUser = async () => {
      try {
        const response = await getCurrentUser();
        setAuthUser(response);
      } catch (error) {
        console.error('Error fetching authenticated user:', error);
      }
    };

    fetchAuthUser();

    // Clean up the effect
    return () => {
      // Cancel any ongoing requests or clean up any resources here
      // fetchAuthUser();
    };
  }, []);

  return authUser;
};

export default useAuthUser;
