import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AccountProvider } from './src/context/AccountContext';
import { ProductProvider } from './src/context/ProductContext';
import { CartProvider } from './src/context/CartContext';
import { BillingProvider } from './src/context/BillingContext';
import { PaymentProvider } from './src/context/PaymentContext';
import { ReportProvider } from './src/context/ReportContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AccountProvider>
        <ProductProvider>
          <CartProvider>
            <BillingProvider>
              <PaymentProvider>
                <ReportProvider>
                  <AppNavigator />
                  <StatusBar style="dark" />
                </ReportProvider>
              </PaymentProvider>
            </BillingProvider>
          </CartProvider>
        </ProductProvider>
      </AccountProvider>
    </SafeAreaProvider>
  );
}
