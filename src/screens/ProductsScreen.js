import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const displayedProducts = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    let nextProducts = [...products];

    if (normalized) {
      nextProducts = nextProducts.filter((product) => {
        const haystack = `${product.name} ${product.category}`.toLowerCase();
        return haystack.includes(normalized);
      });
    }

    nextProducts.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

    return nextProducts;
  }, [products, searchQuery, sortBy]);

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
        <View style={styles.toolbarCard}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products"
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.toolbarActions}>
            <TouchableOpacity
              style={[styles.toolbarBtn, sortBy === 'name' && styles.toolbarBtnActive]}
              onPress={() => setSortBy('name')}
            >
              <MaterialCommunityIcons name="sort-alphabetical-ascending" size={16} color={sortBy === 'name' ? Colors.white : Colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolbarBtn, sortBy === 'price' && styles.toolbarBtnActive]}
              onPress={() => setSortBy('price')}
            >
              <MaterialCommunityIcons name="cash-multiple" size={16} color={sortBy === 'price' ? Colors.white : Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.addBtn, styles.primaryBtn]}
            onPress={() => {
              setEditingProduct(null);
              setAddModalVisible(true);
            }}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
            <Text style={styles.addBtnText}>Add product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addBtn, styles.secondaryBtn]}
            onPress={() => setShowAddCategoryModal(true)}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="shape" size={18} color={Colors.primary} />
            <Text style={[styles.addBtnText, styles.secondaryBtnText]}>Add category</Text>
          </TouchableOpacity>
        </View>

        {displayedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="package-variant-closed" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>No products match</Text>
            <Text style={styles.emptySubtitle}>Adjust your search or add a fresh SKU.</Text>
          </View>
        ) : (
          displayedProducts.map((prod) => (
            <View key={prod.id} style={styles.productRow}>
              <View style={styles.productIconWrapper}>
                {prod.image_url ? (
                  <Image source={{ uri: prod.image_url }} style={styles.productImage} />
                ) : (
                  <MaterialCommunityIcons
                    name={getProductIconName(prod)}
                    size={32}
                    color={Colors.primary}
                  />
                )}
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{prod.name}</Text>
                <Text style={styles.productDetails}>₹{prod.price.toFixed(2)} • Stock {prod.stock}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{prod.category}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(prod)}>
                  <MaterialCommunityIcons name="pencil-outline" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(prod.id, prod.name)}>
                  <MaterialCommunityIcons name="delete-outline" size={18} color={Colors.error} />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
  },
  toolbarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
  },
  toolbarActions: {
    flexDirection: 'row',
  },
  toolbarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginLeft: 6,
  },
  toolbarBtnActive: {
    backgroundColor: Colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtn: {
    marginRight: 8,
  },
  secondaryBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Fonts.sizes.sm,
    marginLeft: 6,
  },
  secondaryBtnText: {
    color: Colors.text,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  productIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  productDetails: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
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
    fontWeight: '700',
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
