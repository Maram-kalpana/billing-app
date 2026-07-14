import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

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
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Shop':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            case 'Products':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Billing':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Reports':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Account':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: Fonts.sizes.xs,
          fontWeight: '500',
        }
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
