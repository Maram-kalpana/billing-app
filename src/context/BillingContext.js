import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BillingContext = createContext();

const BILL_COUNTER_KEY = '@bill_counter';

export const BillingProvider = ({ children }) => {
  const [billNumber, setBillNumber] = useState('0000001');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadBillNumber();
  }, []);

  const loadBillNumber = async () => {
    try {
      const stored = await AsyncStorage.getItem(BILL_COUNTER_KEY);
      if (stored) {
        const counter = parseInt(stored, 10);
        setBillNumber(String(counter).padStart(7, '0'));
      } else {
        await AsyncStorage.setItem(BILL_COUNTER_KEY, '1');
        setBillNumber('0000001');
      }
    } catch (error) {
      console.error('Error loading bill number:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const generateNewBill = async () => {
    try {
      const stored = await AsyncStorage.getItem(BILL_COUNTER_KEY);
      const currentCounter = stored ? parseInt(stored, 10) : 1;
      const nextCounter = currentCounter + 1;
      await AsyncStorage.setItem(BILL_COUNTER_KEY, String(nextCounter));
      const newBillNumber = String(nextCounter).padStart(7, '0');
      setBillNumber(newBillNumber);
      return newBillNumber;
    } catch (error) {
      console.error('Error generating bill number:', error);
      return billNumber;
    }
  };

  return (
    <BillingContext.Provider
      value={{
        billNumber,
        isLoaded,
        generateNewBill,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};
