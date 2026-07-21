import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import React, { useEffect, useState } from 'react';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../services/dashboardService';


export const DashboardScreen = () => {

  const { token } = useAuth();

  const [summary, setSummary] = useState({
    totalBills: 0,
    totalSales: 0,
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

      const response = await getDashboard(token);

      if (response.data.success) {
        setSummary(response.data.data);
      }

    } catch (err) {
      console.log("Dashboard Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
 
  
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
  title="Total Sales"
  value={`₹${summary.totalSales}`}
  icon="cash"
  color={Colors.success}
/>

<StatCard
  title="Total Bills"
  value={summary.totalBills.toString()}
  icon="receipt"
  color={Colors.warning}
/>

<StatCard
  title="Products"
  value={summary.totalProducts.toString()}
  icon="cube"
  color={Colors.primary}
/>

<StatCard
  title="Categories"
  value={summary.totalCategories.toString()}
  icon="grid"
  color={Colors.info}
/>

<StatCard
  title="Low Stock Products"
  value={summary.lowStockProducts.toString()}
  icon="alert-circle"
  color={Colors.error}
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
