import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);

  const selectMethod = (method) => {
    setPaymentMethod(method);
    setReceivedAmount('');
    setPaymentComplete(false);
  };

  const resetPayment = () => {
    setPaymentMethod(null);
    setReceivedAmount('');
    setPaymentComplete(false);
  };

  const markComplete = () => {
    setPaymentComplete(true);
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentMethod,
        receivedAmount,
        paymentComplete,
        selectMethod,
        setReceivedAmount,
        markComplete,
        resetPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
