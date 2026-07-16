import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { useBilling } from '../context/BillingContext';
import { useCart } from '../context/CartContext';

export const Header = ({ onAddItem, onCartPress }) => {
  const { billNumber } = useBilling();
  const { totalItems } = useCart();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.billLabel}>Bill</Text>
          <Text style={styles.billNumber}>#{billNumber}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.addItemBtn} onPress={onAddItem} activeOpacity={0.9}>
            <MaterialCommunityIcons name="plus-circle-outline" size={18} color={Colors.white} />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartBtn} onPress={onCartPress} activeOpacity={0.9}>
            <MaterialCommunityIcons name="cart-outline" size={22} color={Colors.text} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.surface,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 58,
    backgroundColor: Colors.surface,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  left: {
    flexDirection: 'column',
  },
  billLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  billNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  addItemText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Fonts.sizes.sm,
    marginLeft: 6,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: 3,
    right: 3,
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
