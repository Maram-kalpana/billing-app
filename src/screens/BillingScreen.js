import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useBilling } from '../context/BillingContext';
import { useAccount } from '../context/AccountContext';
import { Header } from '../components/Header';
import { AddProductModal } from '../components/AddProductModal';
import { PaymentSheet } from '../components/PaymentSheet';

export const BillingScreen = ({ navigation }) => {
  const { cartItems, subtotal, totalItems, removeFromCart } = useCart();
  const { billNumber } = useBilling();
  const { account } = useAccount();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);

  const gstAmount = useMemo(
    () => (subtotal * (account.gstPercent || 0)) / 100,
    [subtotal, account.gstPercent]
  );

  const grandTotal = useMemo(() => subtotal + gstAmount, [subtotal, gstAmount]);

  const handlePaymentSuccess = () => {
    setPaymentSheetVisible(false);
    navigation.navigate('PaymentSuccess');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        onAddItem={() => setAddModalVisible(true)}
        onCartPress={() => navigation.navigate('Cart')}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Current bill</Text>
              <Text style={styles.summaryValue}>₹{grandTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryPill}>
              <MaterialCommunityIcons name="receipt-text-outline" size={18} color={Colors.primary} />
              <Text style={styles.summaryPillText}>{totalItems} items</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryMeta}>Bill #{billNumber}</Text>
            <Text style={styles.summaryMeta}>GST {account.gstPercent || 0}%</Text>
          </View>
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="receipt-text-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>Your bill is empty</Text>
            <Text style={styles.emptySubtitle}>Add products from the shop to build a polished order.</Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order items</Text>
              <Text style={styles.sectionSubtitle}>Tap to remove</Text>
            </View>

            {cartItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemMain}>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.lineItemImage} />
                  ) : (
                    <View style={styles.iconBubble}>
                      <MaterialCommunityIcons name={item.icon || 'package-variant'} size={20} color={Colors.primary} />
                    </View>
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemMeta}>Qty {item.quantity}</Text>
                  </View>
                </View>

                <View style={styles.itemPricing}>
                  <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => removeFromCart(item.id)}>
                    <MaterialCommunityIcons name="close-circle-outline" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.totalsCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              {account.gstPercent > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>GST ({account.gstPercent}%)</Text>
                  <Text style={styles.totalValue}>₹{gstAmount.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.grandTotalLabel}>Grand total</Text>
                <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.paymentBtn}
            onPress={() => setPaymentSheetVisible(true)}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="credit-card-outline" size={20} color={Colors.white} />
            <Text style={styles.paymentBtnText}>Proceed to payment</Text>
          </TouchableOpacity>
        </View>
      )}

      <AddProductModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} />
      <PaymentSheet
        visible={paymentSheetVisible}
        onClose={() => setPaymentSheetVisible(false)}
        onSuccess={handlePaymentSuccess}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 96,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  summaryPillText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryMeta: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  itemMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lineItemImage: {
    width: 42,
    height: 42,
    borderRadius: 12,
    marginRight: 10,
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  itemMeta: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  deleteBtn: {
    padding: 2,
  },
  totalsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  totalValue: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  paymentBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 999,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Fonts.sizes.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
