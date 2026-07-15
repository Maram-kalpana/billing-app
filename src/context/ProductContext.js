import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productsData as seedProducts, categories as seedCategories } from '../data/posData';
import { getCategoryIconName } from '../constants/ProductAssets';

const ProductContext = createContext();

const PRODUCTS_KEY = '@products';
const CATEGORIES_KEY = '@categories';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedProducts, storedCategories] = await Promise.all([
        AsyncStorage.getItem(PRODUCTS_KEY),
        AsyncStorage.getItem(CATEGORIES_KEY),
      ]);

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(seedProducts);
        await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(seedProducts));
      }

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(seedCategories);
        await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(seedCategories));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(seedProducts);
      setCategories(seedCategories);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveProducts = async (updatedProducts) => {
    try {
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  };

  const saveCategories = async (updatedCategories) => {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const addProduct = async (product) => {
    const newProduct = {
      ...product,
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    await saveProducts(updatedProducts);
    return newProduct;
  };

  const addCategory = async (categoryName) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return null;

    const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    const exists = categories.some((cat) => cat.name.toLowerCase() === normalized.toLowerCase());
    if (exists) return exists;

    const newCategory = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: normalized,
      icon: getCategoryIconName(normalized),
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
    return newCategory;
  };

  const updateProduct = async (productId, updates) => {
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, ...updates } : p
    );
    setProducts(updatedProducts);
    await saveProducts(updatedProducts);
  };

  const deleteProduct = async (productId) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
    await saveProducts(updatedProducts);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoaded,
        addProduct,
        addCategory,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
