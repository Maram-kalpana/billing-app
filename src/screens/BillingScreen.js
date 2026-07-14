import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { cartItemsData } from '../data/posData';
import { Ionicons } from '@expo/vector-icons';

export const BillingScreen = () => {
  const [cartItems, setCartItems] = useState(cartItemsData);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  
  // State for Dropdown Modal
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  const totalDiscount = 110.00;
  const finalPrice = 420.00;
  const totalQty = 24;

  const handleDelete = (indexToRemove) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };

  const openDropdown = (index) => {
    setActiveItemIndex(index);
    setDropdownVisible(true);
  };

  const selectUnit = (unit) => {
    if (activeItemIndex !== null) {
      const updatedItems = [...cartItems];
      updatedItems[activeItemIndex].type = unit;
      setCartItems(updatedItems);
    }
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bill NO : 066589</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.addItemBtn} onPress={() => setAddItemModalVisible(true)}>
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridBtn}>
            <Ionicons name="grid-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {cartItems.map((item, index) => (
          <View key={item.id + index} style={styles.itemRow}>
            <View style={styles.nameInput}>
              <Text style={styles.nameText}>{item.name}</Text>
            </View>
            
            <TouchableOpacity style={styles.typeDropdown} onPress={() => openDropdown(index)}>
              <Text style={styles.typeText}>{item.type}</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
            
            <View style={styles.qtyContainer}>
              <Text style={styles.qtyText}>{item.value}</Text>
            </View>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>{item.total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(index)}>
              <Text style={{color: '#F5B041', fontSize: 16}}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.agentButton}>
          <Text style={styles.agentButtonText}>Go to agent</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Total Qty   <Text style={styles.footerValueBlack}>{totalQty}</Text></Text>
        <Text style={styles.footerLabel}>Dis %   <Text style={styles.footerValueBlack}>{totalDiscount.toFixed(2)}</Text></Text>
        <Text style={styles.footerTotal}>{finalPrice.toFixed(2)}</Text>
      </View>

      {/* Add Item Modal */}
      <Modal visible={addItemModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Item</Text>
              <TouchableOpacity onPress={() => setAddItemModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.dropdown}>
                <Text style={{color: Colors.text}}>Category</Text>
                <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <TextInput style={styles.input} placeholder="Item Name" placeholderTextColor={Colors.textMuted} />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={() => setAddItemModalVisible(false)}>
              <Text style={styles.submitBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Unit Dropdown Modal */}
      <Modal visible={dropdownVisible} transparent animationType="none">
        <TouchableOpacity style={styles.dropdownModalOverlay} onPress={() => setDropdownVisible(false)} activeOpacity={1}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity 
              style={[styles.dropdownMenuItem, activeItemIndex !== null && cartItems[activeItemIndex]?.type === 'qty' && styles.dropdownMenuItemActive]} 
              onPress={() => selectUnit('qty')}
            >
              {activeItemIndex !== null && cartItems[activeItemIndex]?.type === 'qty' && (
                <Ionicons name="checkmark" size={16} color={Colors.white} style={{marginRight: 6}} />
              )}
              <Text style={[styles.dropdownMenuText, activeItemIndex !== null && cartItems[activeItemIndex]?.type === 'qty' && styles.dropdownMenuTextActive]}>qty</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.dropdownMenuItem, activeItemIndex !== null && cartItems[activeItemIndex]?.type === 'KG' && styles.dropdownMenuItemActive]} 
              onPress={() => selectUnit('KG')}
            >
              {activeItemIndex !== null && cartItems[activeItemIndex]?.type === 'KG' && (
                <Ionicons name="checkmark" size={16} color={Colors.white} style={{marginRight: 6}} />
              )}
              <Text style={[styles.dropdownMenuText, activeItemIndex !== null && cartItems[activeItemIndex]?.type === 'KG' && styles.dropdownMenuTextActive]}>KG</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 1,
  },
  nameInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  nameText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
  },
  typeDropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: Colors.surface,
  },
  typeText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
  },
  qtyContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 8,
  },
  qtyText: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
  },
  totalContainer: {
    width: 60,
    alignItems: 'flex-end',
    marginRight: 8,
  },
  totalText: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  },
  deleteBtn: {
    padding: 4,
  },
  agentButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  agentButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  footerLabel: {
    fontSize: Fonts.sizes.md,
    color: Colors.textMuted,
  },
  footerValueBlack: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  footerTotal: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  // Modal styles
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
  },
  // Dropdown overlay styles
  dropdownModalOverlay: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    width: 120,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 4,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  dropdownMenuItemActive: {
    backgroundColor: Colors.secondary,
  },
  dropdownMenuText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
  },
  dropdownMenuTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  }
});
