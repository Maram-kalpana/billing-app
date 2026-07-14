import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { transactionsData } from '../data/posData';
import { Ionicons } from '@expo/vector-icons';

export const ReportsScreen = () => {
  const [activeTab, setActiveTab] = useState('Transactional');
  const tabs = ['Transactional', 'Sales', 'Inventory', 'Customers'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity style={styles.gridBtn}>
          <Ionicons name="grid-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.dateDropdown}>
          <Text style={styles.dateText}>Today</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.textMuted} />
        </View>
        <View style={styles.searchInput}>
          <TextInput 
            placeholder="Search..." 
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {transactionsData.map((txn) => (
          <View key={txn.id} style={styles.txnCard}>
            <View style={styles.txnRow}>
              <Text style={styles.txnId}>{txn.id}</Text>
              <Text style={[styles.txnAmount, { color: txn.type === 'Sale' ? Colors.success : Colors.error }]}>
                ₹{txn.amount}
              </Text>
            </View>
            <View style={styles.txnRow}>
              <Text style={styles.txnDetails}>{txn.type} • {txn.date}</Text>
              <View style={[styles.statusBadge, { backgroundColor: txn.status === 'Completed' ? Colors.success + '20' : Colors.border }]}>
                <Text style={[styles.statusText, { color: txn.status === 'Completed' ? Colors.success : Colors.textMuted }]}>{txn.status}</Text>
              </View>
            </View>
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  gridBtn: {
    padding: 4,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.white,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  dateDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
    width: 100,
    justifyContent: 'space-between',
  },
  dateText: {
    color: Colors.text,
    fontSize: Fonts.sizes.sm,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  input: {
    color: Colors.text,
    fontSize: Fonts.sizes.sm,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  txnCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  txnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  txnId: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  },
  txnAmount: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
  },
  txnDetails: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: 'bold',
  }
});
