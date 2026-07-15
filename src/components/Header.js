import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBilling } from '../context/BillingContext';
import { useCart } from '../context/CartContext';

export const Header = ({ onAddItem, onCartPress }) => {
  const { billNumber } = useBilling();
  const { totalItems } = useCart();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.billLabel}>Bill No</Text>
          <Text style={styles.billNumber}>#{billNumber}</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity style={styles.addItemBtn} onPress={onAddItem} activeOpacity={0.85}>
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color={Colors.white} />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn} onPress={onCartPress} activeOpacity={0.85}>
            <MaterialCommunityIcons name="cart-outline" size={26} color={Colors.text} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.surface,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    minHeight: 68,
    backgroundColor: Colors.surface,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  left: {
    flexDirection: 'column',
  },
  billLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  billNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  left: {
    flexDirection: 'column',
  },
  billLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  billNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    width: 130,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  addItemText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Fonts.sizes.sm,
    marginLeft: 8,
  },
  cartBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
