import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { categories, productsData } from '../data/posData';
import { Ionicons } from '@expo/vector-icons';

export const ShopScreen = () => {
  const [activeCategory, setActiveCategory] = useState('3');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bill NO : 066589</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.addItemBtn}>
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridBtn}>
            <Ionicons name="grid-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryChip, activeCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <View style={styles.catIconWrapper}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
              </View>
              <Text style={[styles.catName, activeCategory === cat.id && styles.catNameActive]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.productsGrid} showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          {productsData.map((prod) => (
            <View key={prod.id} style={styles.productCard}>
              <View style={styles.productImageWrapper}>
                 <Text style={{fontSize: 50}}>{prod.image}</Text>
              </View>
              <Text style={styles.productName}>{prod.name}</Text>
              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>₹{prod.price.toFixed(2)}</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
    paddingVertical: 15,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemBtn: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  addItemText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.sm,
  },
  gridBtn: {
    padding: 4,
  },
  categoriesWrapper: {
    paddingVertical: 15,
    backgroundColor: Colors.background,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 70,
  },
  categoryChipActive: {
    backgroundColor: Colors.secondary,
  },
  catIconWrapper: {
    backgroundColor: Colors.background,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catIcon: {
    fontSize: 18,
  },
  catName: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  catNameActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  productsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: Colors.surface,
    width: '48%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  productImageWrapper: {
    backgroundColor: '#F3F4F6', 
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
