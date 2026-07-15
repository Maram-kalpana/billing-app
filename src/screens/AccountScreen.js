import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { useAccount } from '../context/AccountContext';

export const AccountScreen = ({ navigation }) => {
  const { account, updateAccountSettings } = useAccount();

  const [merchantName, setMerchantName] = useState(account.merchantName || '');
  const [upiId, setUpiId] = useState(account.upiId || '');
  const [gstPercent, setGstPercent] = useState(String(account.gstPercent || ''));
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setMerchantName(account.merchantName || '');
    setUpiId(account.upiId || '');
    setGstPercent(String(account.gstPercent || ''));
  }, [account]);

  useEffect(() => {
    const changed =
      merchantName !== (account.merchantName || '') ||
      upiId !== (account.upiId || '') ||
      gstPercent !== String(account.gstPercent || '');
    setHasChanges(changed);
  }, [merchantName, upiId, gstPercent, account]);

  const handleSave = async () => {
    const gst = parseFloat(gstPercent) || 0;
    if (gst < 0 || gst > 100) {
      Alert.alert('Invalid GST', 'GST percentage must be between 0 and 100');
      return;
    }

    await updateAccountSettings({
      merchantName: merchantName.trim(),
      upiId: upiId.trim(),
      gstPercent: gst,
    });

    setHasChanges(false);
    Alert.alert('Saved', 'Account settings saved successfully');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.white} />
          </View>
          <Text style={styles.name}>{account.merchantName || 'Admin Store'}</Text>
          <Text style={styles.email}>admin@store.com</Text>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>

          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputIconBox}>
                <Ionicons name="storefront-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Merchant Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={merchantName}
                  onChangeText={setMerchantName}
                  placeholder="Your shop name"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputIconBox}>
                <Ionicons name="phone-portrait-outline" size={20} color="#7C3AED" />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>UPI ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={upiId}
                  onChangeText={setUpiId}
                  placeholder="merchant@upi"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputIconBox}>
                <Ionicons name="calculator-outline" size={20} color={Colors.warning} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>GST Percentage (%)</Text>
                <TextInput
                  style={styles.textInput}
                  value={gstPercent}
                  onChangeText={setGstPercent}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, !hasChanges && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!hasChanges}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={20} color={Colors.white} />
            <Text style={styles.saveBtnText}>Save Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="settings-outline" size={22} color={Colors.text} />
            </View>
            <Text style={styles.menuText}>General Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.border} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    height: 64,
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.surface,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
    color: Colors.textMuted,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  textInput: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    fontWeight: '500',
    paddingVertical: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 10,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
});
