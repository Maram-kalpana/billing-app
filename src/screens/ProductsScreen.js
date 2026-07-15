import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { Header } from '../components/Header';
import { AddProductModal } from '../components/AddProductModal';
import { AddCategoryModal } from '../components/AddCategoryModal';
import { getProductIconName } from '../constants/ProductAssets';

export const ProductsScreen = ({ navigation }) => {
  const { products, deleteProduct, addCategory } = useProducts();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const handleDelete = (productId, productName) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(productId),
        },
      ]
    );
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setAddModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        onAddItem={() => setAddModalVisible(true)}
        onCartPress={() => navigation.navigate('Cart')}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.addBtn, styles.primaryBtn]}
            onPress={() => {
              setEditingProduct(null);
              setAddModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={20} color={Colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.addBtnText}>Add New Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addBtn, styles.secondaryBtn]}
            onPress={() => setShowAddCategoryModal(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="category" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.addBtnText, styles.secondaryBtnText]}>Add Category</Text>
          </TouchableOpacity>
        </View>

        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first product to get started
            </Text>
          </View>
        ) : (
          products.map((prod) => (
            <View key={prod.id} style={styles.productRow}>
              <View style={styles.productIconWrapper}>
                {prod.image_url ? (
                  <Image source={{ uri: prod.image_url }} style={styles.productImage} />
                ) : (
                  <MaterialCommunityIcons
                    name={getProductIconName(prod)}
                    size={46}
                    color="#16A34A"
                  />
                )}
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{prod.name}</Text>
                <Text style={styles.productDetails}>
                  ₹{prod.price.toFixed(2)} • Stock: {prod.stock}
                </Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{prod.category}</Text>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleEdit(prod)}
                >
                  <MaterialIcons name="edit" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(prod.id, prod.name)}
                >
                  <MaterialIcons name="delete" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <AddProductModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
      />
      <AddCategoryModal
        visible={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSave={async (categoryName) => {
          await addCategory(categoryName);
          setShowAddCategoryModal(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtn: {
    marginRight: 12,
  },
  secondaryBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.sizes.sm,
  },
  secondaryBtnText: {
    color: Colors.primary,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  productIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: Fonts.sizes.md,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 3,
  },
  productDetails: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 4,
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
