import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountContext = createContext();

const ACCOUNT_KEY = '@account';

const defaultAccount = {
  merchantName: 'My Shop',
  upiId: '',
  qrImageUri: '',
  gstPercent: 0,
};

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(defaultAccount);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACCOUNT_KEY);
      if (stored) {
        setAccount({ ...defaultAccount, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading account:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const updateAccountSettings = async (updates) => {
    try {
      const updatedAccount = { ...account, ...updates };
      setAccount(updatedAccount);
      await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(updatedAccount));
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        account,
        isLoaded,
        updateAccountSettings,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
