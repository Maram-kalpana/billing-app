import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ShopScreen = ({ navigation }) => {
  const { products, categories } = useProducts();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState('All');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const filteredProducts = useMemo(() => {
    const nextProducts = activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

    return nextProducts;
  }, [products, activeCategory]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
            <View style={[styles.catIconWrapper, activeCategory === 'All' && styles.catIconWrapperActive]}>
              <MaterialCommunityIcons name="shopping-outline" size={18} color={activeCategory === 'All' ? Colors.white : Colors.primary} />
            </View>
            <Text style={[styles.catName, activeCategory === 'All' && styles.catNameActive]}>All</Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat.name)}
              >
                <View style={[styles.catIconWrapper, isActive && styles.catIconWrapperActive]}>
                  <MaterialCommunityIcons
                    name={cat.icon || 'package-variant'}
                    size={18}
                    color={isActive ? Colors.white : Colors.textMuted}
                  />
                </View>
                <Text style={[styles.catName, isActive && styles.catNameActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
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
            <Text style={styles.emptySubtitle}>Tap Add Item to create your first premium SKU.</Text>
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

const ProductImage = ({ product }) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageUri = product.image_url || `https://source.unsplash.com/300x300/?${encodeURIComponent(product.name)}`;

  return (
    <View style={styles.productIconWrapper}>
      {!hasError ? (
        <>
          {!loaded && (
            <View style={styles.imageSkeleton}>
              <MaterialCommunityIcons name={getProductIconName(product)} size={28} color={Colors.primary} />
            </View>
          )}
          <Image
            source={{ uri: imageUri }}
            style={styles.productImage}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(true);
              setHasError(true);
            }}
          />
        </>
      ) : (
        <MaterialCommunityIcons name={getProductIconName(product)} size={34} color={Colors.primary} />
      )}
    </View>
  );
};

const ProductCard = ({ product, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 220 });
    translateY.value = withTiming(0, { duration: 220 });
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(scale.value, { duration: 120 }) },
      { translateY: withTiming(translateY.value, { duration: 220 }) },
    ],
    opacity: withTiming(opacity.value, { duration: 220 }),
  }));

  return (
    <Animated.View style={[styles.productCard, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress(product)}
        onPressIn={() => {
          scale.value = 0.97;
        }}
        onPressOut={() => {
          scale.value = 1;
        }}
        style={styles.productTouchable}
      >
        <ProductImage product={product} />
        <View style={styles.productDetailsContainer}>
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text style={styles.productStock}>Stock {product.stock}</Text>
        </View>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹{product.price.toFixed(2)}</Text>
          <View style={styles.addButton}>
            <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
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
    minWidth: 82,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catIconWrapper: {
    backgroundColor: Colors.primaryLight,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 88,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    flexBasis: '31%',
    maxWidth: 118,
    height: 164,
    borderRadius: 16,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    padding: 10,
    justifyContent: 'space-between',
  },
  productTouchable: {
    flex: 1,
  },
  productIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F6EF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  imageSkeleton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F6EF',
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
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
    lineHeight: 17,
  },
  productStock: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
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
