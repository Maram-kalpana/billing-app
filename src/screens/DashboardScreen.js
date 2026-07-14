import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { summaryData } from '../data/dashboardData';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

export const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Dashboard" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>Revenue Overview (Chart)</Text>
          <View style={styles.chartBars}>
            {[40, 70, 50, 90, 60, 80].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h }]} />
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Summary Statistics</Text>
        <StatCard 
          title="Total Revenue"
          value={`$${summaryData.totalRevenue.toFixed(2)}`}
          icon="cash"
          color={Colors.success}
        />
        <StatCard 
          title="Pending Invoices"
          value={`$${summaryData.pendingInvoices.toFixed(2)}`}
          icon="time"
          color={Colors.warning}
        />
        <StatCard 
          title="Total Expenses"
          value={`$${summaryData.expenses.toFixed(2)}`}
          icon="trending-down"
          color={Colors.error}
        />
        <StatCard 
          title="Active Customers"
          value={summaryData.activeCustomers.toString()}
          icon="people"
          color={Colors.primary}
        />
        
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  chartPlaceholder: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    height: 200,
    justifyContent: 'space-between',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  chartText: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 10,
  },
  bar: {
    width: 30,
    backgroundColor: Colors.primary + '80',
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  }
});
