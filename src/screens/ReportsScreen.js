import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../context/ReportContext';

export const ReportsScreen = () => {
  const { reports } = useReports();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dateFilterOptions = ['All', 'Today', 'Last 7 days', 'Last 30 days'];

  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.billNumber.toLowerCase().includes(q) ||
          r.paymentMethod.toLowerCase().includes(q)
      );
    }

    // Date filter
    if (dateFilter !== 'All') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter((r) => {
        // Parse Indian date format (DD/MM/YYYY)
        const parts = r.date.split('/');
        let reportDate;
        if (parts.length === 3) {
          reportDate = new Date(parts[2], parts[1] - 1, parts[0]);
        } else {
          reportDate = new Date(r.date);
        }

        if (dateFilter === 'Today') {
          return reportDate >= today;
        } else if (dateFilter === 'Last 7 days') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return reportDate >= weekAgo;
        } else if (dateFilter === 'Last 30 days') {
          const monthAgo = new Date(today);
          monthAgo.setDate(monthAgo.getDate() - 30);
          return reportDate >= monthAgo;
        }
        return true;
      });
    }

    return filtered;
  }, [reports, searchQuery, dateFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <View style={styles.reportCount}>
          <Text style={styles.reportCountText}>{reports.length} transactions</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.dateDropdown}
          onPress={() => setShowDatePicker(!showDatePicker)}
        >
          <Text style={styles.dateText}>{dateFilter}</Text>
          <Ionicons
            name={showDatePicker ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={Colors.textMuted}
          />
        </TouchableOpacity>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            placeholder="Search bill no..."
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {showDatePicker && (
        <View style={styles.datePickerDropdown}>
          {dateFilterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.dateOption,
                dateFilter === option && styles.dateOptionActive,
              ]}
              onPress={() => {
                setDateFilter(option);
                setShowDatePicker(false);
              }}
            >
              <Text
                style={[
                  styles.dateOptionText,
                  dateFilter === option && styles.dateOptionTextActive,
                ]}
              >
                {option}
              </Text>
              {dateFilter === option && (
                <Ionicons name="checkmark" size={16} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredReports.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>
              {reports.length === 0 ? 'No transactions yet' : 'No matching results'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {reports.length === 0
                ? 'Complete a payment to see reports here'
                : 'Try adjusting your search or filters'}
            </Text>
          </View>
        ) : (
          filteredReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.billBadge}>
                  <Text style={styles.billBadgeText}>#{report.billNumber}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: Colors.primary + '15' },
                  ]}
                >
                  <Text style={[styles.statusText, { color: Colors.primary }]}>
                    {report.status}
                  </Text>
                </View>
              </View>

              <View style={styles.reportBody}>
                <View style={styles.reportRow}>
                  <View style={styles.reportField}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.reportFieldText}>{report.date}</Text>
                  </View>
                  <View style={styles.reportField}>
                    <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.reportFieldText}>{report.time}</Text>
                  </View>
                </View>
                <View style={styles.reportRow}>
                  <View style={styles.reportField}>
                    <Ionicons name="card-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.reportFieldText}>{report.paymentMethod}</Text>
                  </View>
                  <View style={styles.reportField}>
                    <Ionicons name="cube-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.reportFieldText}>
                      {report.items?.length || 0} items • Qty: {report.totalQty || 0}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.reportFooter}>
                <Text style={styles.amountLabel}>Amount</Text>
                <Text style={styles.amountValue}>₹{(report.amount || 0).toFixed(2)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 64,
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
  reportCount: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  reportCountText: {
    color: Colors.primary,
    fontSize: Fonts.sizes.xs,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  dateDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    gap: 6,
  },
  dateText: {
    color: Colors.text,
    fontSize: Fonts.sizes.sm,
    fontWeight: '500',
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    gap: 8,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: Fonts.sizes.sm,
    paddingVertical: 10,
  },
  datePickerDropdown: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    overflow: 'hidden',
  },
  dateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dateOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  dateOptionText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
  },
  dateOptionTextActive: {
    fontWeight: '700',
    color: Colors.primary,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  reportCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billBadge: {
    backgroundColor: Colors.text,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  billBadgeText: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: 'bold',
  },
  reportBody: {
    gap: 8,
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  reportFieldText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  amountLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  amountValue: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: Colors.primary,
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
