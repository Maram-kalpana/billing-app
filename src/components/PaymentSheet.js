import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from './BottomSheet';
import { useCart } from '../context/CartContext';
import { useBilling } from '../context/BillingContext';
import { useAccount } from '../context/AccountContext';
import { useReports } from '../context/ReportContext';
import { usePayment } from '../context/PaymentContext';

let QRCode = null;
try {
  QRCode = require('react-native-qrcode-svg').default;
} catch (e) {
  // QRCode not available
}

export const PaymentSheet = ({ visible, onClose, onSuccess }) => {
  const { cartItems, subtotal, totalItems, clearCart } = useCart();
  const { billNumber, generateNewBill } = useBilling();
  const { account } = useAccount();
  const { addReport } = useReports();
  const { paymentMethod, selectMethod, resetPayment } = usePayment();

  const [receivedAmount, setReceivedAmount] = useState('');
  const [step, setStep] = useState('select'); // 'select' | 'cash' | 'upi'

  const gstAmount = useMemo(
    () => (subtotal * (account.gstPercent || 0)) / 100,
    [subtotal, account.gstPercent]
  );

  const grandTotal = useMemo(() => subtotal + gstAmount, [subtotal, gstAmount]);

  const balanceAmount = useMemo(() => {
    const received = parseFloat(receivedAmount) || 0;
    return received - grandTotal;
  }, [receivedAmount, grandTotal]);

  const upiString = useMemo(() => {
    const upiId = account.upiId || 'merchant@upi';
    const name = encodeURIComponent(account.merchantName || 'Shop');
    return `upi://pay?pa=${upiId}&pn=${name}&am=${grandTotal.toFixed(2)}`;
  }, [account.upiId, account.merchantName, grandTotal]);

  const handleSelectCash = () => {
    selectMethod('cash');
    setStep('cash');
    setReceivedAmount('');
  };

  const handleSelectUPI = () => {
    selectMethod('upi');
    setStep('upi');
  };

  const handleCompletePayment = async (method) => {
    const now = new Date();
    const report = {
      billNumber,
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: method,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      totalQty: totalItems,
      amount: grandTotal,
      subtotal,
      gst: gstAmount,
    };

    await addReport(report);
    clearCart();
    await generateNewBill();
    resetPayment();
    setStep('select');
    setReceivedAmount('');
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleClose = () => {
    setStep('select');
    setReceivedAmount('');
    resetPayment();
    onClose();
  };

  const renderMethodSelection = () => (
    <View>
      <Text style={styles.sheetSubtitle}>Total Amount</Text>
      <Text style={styles.totalAmount}>₹{grandTotal.toFixed(2)}</Text>

      <Text style={styles.selectLabel}>Select Payment Method</Text>

      <TouchableOpacity style={styles.methodCard} onPress={handleSelectCash} activeOpacity={0.7}>
        <View style={[styles.methodIcon, { backgroundColor: Colors.primaryLight }]}>
          <Ionicons name="cash-outline" size={28} color={Colors.primary} />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>Cash</Text>
          <Text style={styles.methodDesc}>Pay with cash</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={Colors.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.methodCard} onPress={handleSelectUPI} activeOpacity={0.7}>
        <View style={[styles.methodIcon, { backgroundColor: '#EDE9FE' }]}>
          <Ionicons name="phone-portrait-outline" size={28} color="#7C3AED" />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>UPI</Text>
          <Text style={styles.methodDesc}>Pay via UPI / QR</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );

  const renderCashPayment = () => (
    <View>
      <TouchableOpacity style={styles.backBtn} onPress={() => setStep('select')}>
        <Ionicons name="arrow-back" size={20} color={Colors.text} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Grand Total</Text>
        <Text style={styles.amountValue}>₹{grandTotal.toFixed(2)}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Received Amount</Text>
        <TextInput
          style={styles.amountInput}
          value={receivedAmount}
          onChangeText={setReceivedAmount}
          placeholder="0.00"
          placeholderTextColor={Colors.textMuted}
          keyboardType="decimal-pad"
          autoFocus
        />
      </View>

      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Balance Amount</Text>
        <Text
          style={[
            styles.balanceValue,
            { color: balanceAmount >= 0 ? Colors.primary : Colors.error },
          ]}
        >
          ₹{balanceAmount >= 0 ? balanceAmount.toFixed(2) : '0.00'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.completeBtn,
          (parseFloat(receivedAmount) || 0) < grandTotal && styles.completeBtnDisabled,
        ]}
        onPress={() => handleCompletePayment('Cash')}
        disabled={(parseFloat(receivedAmount) || 0) < grandTotal}
        activeOpacity={0.7}
      >
        <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
        <Text style={styles.completeBtnText}>Complete Payment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUPIPayment = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backBtn} onPress={() => setStep('select')}>
        <Ionicons name="arrow-back" size={20} color={Colors.text} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.qrSection}>
        <View style={styles.qrContainer}>
          {QRCode ? (
            <QRCode value={upiString} size={180} backgroundColor={Colors.white} />
          ) : (
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code-outline" size={80} color={Colors.textMuted} />
              <Text style={styles.qrPlaceholderText}>QR Code</Text>
            </View>
          )}
        </View>
        <Text style={styles.scanText}>Scan to Pay</Text>
      </View>

      <View style={styles.upiInfoCard}>
        <View style={styles.upiInfoRow}>
          <Text style={styles.upiInfoLabel}>Merchant UPI ID</Text>
          <Text style={styles.upiInfoValue}>{account.upiId || 'Not configured'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.upiInfoRow}>
          <Text style={styles.upiInfoLabel}>Total Amount</Text>
          <Text style={[styles.upiInfoValue, { color: Colors.primary, fontWeight: 'bold' }]}>
            ₹{grandTotal.toFixed(2)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.completeBtn}
        onPress={() => handleCompletePayment('UPI')}
        activeOpacity={0.7}
      >
        <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
        <Text style={styles.completeBtnText}>Payment Completed</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <BottomSheet visible={visible} onClose={handleClose} title="Payment">
      {step === 'select' && renderMethodSelection()}
      {step === 'cash' && renderCashPayment()}
      {step === 'upi' && renderUPIPayment()}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetSubtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  selectLabel: {
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 14,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  methodIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  methodDesc: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  backText: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  amountCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Fonts.sizes.xl,
    fontWeight: '600',
    color: Colors.text,
    backgroundColor: Colors.background,
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: Fonts.sizes.md,
    color: Colors.textMuted,
  },
  balanceValue: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
  },
  completeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  completeBtnDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.6,
  },
  completeBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.md,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 12,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  qrPlaceholderText: {
    marginTop: 8,
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  scanText: {
    fontSize: Fonts.sizes.md,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  upiInfoCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  upiInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  upiInfoLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  upiInfoValue: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
});
