import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { DashboardCard } from '../components/DashboardCard';
import { ActionCard } from '../components/ActionCard';
import { summaryData, recentActivities } from '../data/dashboardData';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Good Morning, Alex" rightIcon="notifications-outline" onRightPress={() => {}} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <DashboardCard 
          title="Total Balance"
          amount={summaryData.totalRevenue}
          subtitle="Updated just now"
        />

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <ActionCard title="Send Invoice" icon="document-text" color={Colors.primary} onPress={() => {}} />
          <ActionCard title="Add Client" icon="person-add" color={Colors.secondary} onPress={() => navigation.navigate('Customers')} />
          <ActionCard title="View Reports" icon="bar-chart" color={Colors.warning} onPress={() => navigation.navigate('Reports')} />
        </View>

        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Upgrade to Pro</Text>
            <Text style={styles.bannerText}>Get unlimited invoices and premium support.</Text>
          </View>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentActivities.slice(0,3).map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: activity.status === 'completed' ? Colors.success + '20' : Colors.info + '20' }]}>
              <Ionicons 
                name={activity.status === 'completed' ? "checkmark-circle" : "information-circle"} 
                size={24} 
                color={activity.status === 'completed' ? Colors.success : Colors.info} 
              />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
            {activity.amount && (
              <Text style={styles.activityAmount}>${activity.amount.toFixed(2)}</Text>
            )}
          </View>
        ))}
        
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
  seeAll: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  banner: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
  },
  bannerButton: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
  },
  activityAmount: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  }
});
