import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { productsData } from '../data/posData';
import { Ionicons } from '@expo/vector-icons';

export const ProductsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.gridBtn}>
          <Ionicons name="grid-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color={Colors.white} style={{marginRight: 8}} />
          <Text style={styles.addBtnText}>Add New Product</Text>
        </TouchableOpacity>

        {productsData.map((prod) => (
          <View key={prod.id} style={styles.productRow}>
            <View style={styles.productIconWrapper}>
              <Text style={{fontSize: 30}}>{prod.image}</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{prod.name}</Text>
              <Text style={styles.productDetails}>₹{prod.price}  •  Stock: {prod.stock}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="pencil-outline" size={20} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add New Product Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Product</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <TextInput style={styles.input} placeholder="Product Name" placeholderTextColor={Colors.textMuted} />
            </View>
            <View style={styles.inputGroup}>
              <TextInput style={styles.input} placeholder="Price (₹)" placeholderTextColor={Colors.textMuted} keyboardType="numeric" />
            </View>
            <View style={styles.inputGroup}>
              <View style={styles.dropdown}>
                <Text style={{color: Colors.text}}>Vegetables</Text>
                <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <TextInput style={styles.input} placeholder="Stock Quantity" placeholderTextColor={Colors.textMuted} keyboardType="numeric" />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.submitBtnText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  gridBtn: {
    padding: 4,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  addBtn: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 20,
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.md,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productIconWrapper: {
    backgroundColor: Colors.background,
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  productDetails: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Fonts.sizes.md,
    color: Colors.text,
  },
  dropdown: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.md,
  }
});
