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
import { Ionicons } from '@expo/vector-icons';
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
        {/* Bill Info */}
        <View style={styles.billInfoCard}>
          <View style={styles.billInfoRow}>
            <Text style={styles.billInfoLabel}>Bill Number</Text>
            <Text style={styles.billInfoValue}>#{billNumber}</Text>
          </View>
          <View style={styles.billInfoRow}>
            <Text style={styles.billInfoLabel}>Items</Text>
            <Text style={styles.billInfoValue}>{totalItems}</Text>
          </View>
        </View>

        {/* Line Items */}
        {cartItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>No items in bill</Text>
            <Text style={styles.emptySubtitle}>
              Add products from the Shop to start billing
            </Text>
          </View>
        ) : (
          <>
            {/* Column Headers */}
            <View style={styles.columnHeader}>
              <Text style={[styles.colHeaderText, { flex: 2 }]}>Product</Text>
              <Text style={[styles.colHeaderText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.colHeaderText, { flex: 1, textAlign: 'center' }]}>Price</Text>
              <Text style={[styles.colHeaderText, { flex: 1, textAlign: 'right' }]}>Subtotal</Text>
              <View style={{ width: 30 }} />
            </View>

            {cartItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.lineItemImage} />
                  ) : (
                    <MaterialCommunityIcons name={item.icon || 'package-variant'} size={18} color="#16A34A" style={{ marginRight: 8 }} />
                  )}
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                <Text style={[styles.itemDetail, { flex: 1, textAlign: 'center' }]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.itemDetail, { flex: 1, textAlign: 'center' }]}>
                  ₹{item.price.toFixed(0)}
                </Text>
                <Text style={[styles.itemTotal, { flex: 1, textAlign: 'right' }]}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Ionicons name="close-circle" size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Totals */}
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
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Proceed to Payment */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.paymentBtn}
            onPress={() => setPaymentSheetVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="card-outline" size={22} color={Colors.white} />
            <Text style={styles.paymentBtnText}>Proceed to Payment</Text>
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
    paddingBottom: 40,
  },
  billInfoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  billInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  billInfoLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  billInfoValue: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    marginBottom: 8,
  },
  colHeaderText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  itemName: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  itemDetail: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  lineItemImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  itemTotal: {
    fontSize: Fonts.sizes.sm,
    fontWeight: 'bold',
    color: Colors.text,
  },
  deleteBtn: {
    width: 30,
    alignItems: 'center',
    paddingLeft: 6,
  },
  totalsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
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
    fontSize: Fonts.sizes.md,
    color: Colors.textMuted,
  },
  totalValue: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  grandTotalLabel: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  grandTotalValue: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  footer: {
    padding: 16,
    paddingBottom: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paymentBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
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
