import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { AddProductModal } from '../components/AddProductModal';
import { Snackbar } from '../components/Snackbar';
import { getProductIconName } from '../constants/ProductAssets';

export const ShopScreen = ({ navigation }) => {
  const { products, categories } = useProducts();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState('All');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  useEffect(() => {
    setActiveCategory('All');
  }, [categories.length]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarMessage(`${product.name} added to cart`);
    setSnackbarVisible(true);
  };

  const renderProductCard = ({ item }) => <ProductCard product={item} onPress={handleAddToCart} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        onAddItem={() => setAddModalVisible(true)}
        onCartPress={() => navigation.navigate('Cart')}
      />

      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity
            style={[styles.categoryChip, activeCategory === 'All' && styles.categoryChipActive]}
            onPress={() => setActiveCategory('All')}
          >
            <View style={styles.catIconWrapper}>
              <MaterialCommunityIcons name="storefront-outline" size={18} color={activeCategory === 'All' ? Colors.white : Colors.primary} />
            </View>
            <Text style={[styles.catName, activeCategory === 'All' && styles.catNameActive]}>All</Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, activeCategory === cat.name && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat.name)}
            >
              <View style={[styles.catIconWrapper, activeCategory === cat.name && styles.catIconWrapperActive]}>
                <MaterialCommunityIcons
                  name={cat.icon || 'package-variant'}
                  size={18}
                  color={activeCategory === cat.name ? Colors.white : Colors.textMuted}
                />
              </View>
              <Text style={[styles.catName, activeCategory === cat.name && styles.catNameActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductCard}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="package-variant" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>No products</Text>
            <Text style={styles.emptySubtitle}>Tap Add Item to create your first grocery SKU.</Text>
          </View>
        )}
      />

      <AddProductModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} />
      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </SafeAreaView>
  );
};

const ProductCard = ({ product, onPress }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 120 }) }],
    opacity: withTiming(scale.value === 1 ? 1 : 0.98, { duration: 120 }),
  }));

  return (
    <Animated.View style={[styles.productCard, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.85}
        android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: false }}
        onPress={() => onPress(product)}
        onPressIn={() => {
          scale.value = 0.97;
        }}
        onPressOut={() => {
          scale.value = 1;
        }}
        style={styles.productTouchable}
      >
        <View style={styles.productIconWrapper}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.productImage} />
          ) : (
            <MaterialCommunityIcons
              name={getProductIconName(product)}
              size={42}
              color="#16A34A"
            />
          )}
        </View>
        <View style={styles.productDetailsContainer}>
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text style={styles.productStock}>Stock {product.stock}</Text>
        </View>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹{product.price.toFixed(2)}</Text>
          <View style={styles.addButton}>
            <MaterialCommunityIcons name="plus" size={20} color={Colors.white} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  categoriesWrapper: {
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    paddingBottom: 2,
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    width: 74,
    height: 86,
    borderRadius: 18,
    marginRight: 10,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catIconWrapper: {
    backgroundColor: Colors.surface,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catIconWrapperActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  catName: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  catNameActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  productsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    flexBasis: '30%',
    maxWidth: 132,
    height: 172,
    borderRadius: 18,
    backgroundColor: Colors.white,
    marginBottom: 0,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    padding: 12,
    justifyContent: 'space-between',
  },
  productTouchable: {
    flex: 1,
  },
  productIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F6EF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productDetailsContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 17,
  },
  productStock: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  addButton: {
    backgroundColor: Colors.success,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
