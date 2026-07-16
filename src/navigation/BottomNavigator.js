import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

import { ShopScreen } from '../screens/ShopScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { BillingScreen } from '../screens/BillingScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { AccountScreen } from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

export const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, size }) => {
          let iconName;

          switch (route.name) {
            case 'Shop':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            case 'Products':
              iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
              break;
            case 'Billing':
              iconName = focused ? 'receipt-text' : 'receipt-text-outline';
              break;
            case 'Reports':
              iconName = focused ? 'chart-box' : 'chart-box-outline';
              break;
            case 'Account':
              iconName = focused ? 'account' : 'account-outline';
              break;
          }

          return (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? Colors.primary : Colors.transparent,
              }}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={size - 4}
                color={focused ? Colors.white : Colors.textMuted}
              />
            </View>
          );
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarHideOnKeyboard: true,
        safeAreaInsets: { bottom: 0 },
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          height: 74,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarItemStyle: {
          height: 58,
          paddingTop: 4,
        },
      })}
    >
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Billing" component={BillingScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};
