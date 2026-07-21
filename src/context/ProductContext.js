import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(token),
        getCategories(token),
      ]);

      if (productsRes.data.success) {
        setProducts(productsRes.data.data);
      }

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // PRODUCTS
  // ------------------------

  const addProduct = async (product) => {
    const res = await createProduct(product, token);

    if (res.data.success) {
      await loadData();
    }

    return res.data;
  };

  const editProduct = async (id, product) => {
    const res = await updateProduct(id, product, token);

    if (res.data.success) {
      await loadData();
    }

    return res.data;
  };

  const removeProduct = async (id) => {
    const res = await deleteProduct(id, token);

    if (res.data.success) {
      await loadData();
    }

    return res.data;
  };

  // ------------------------
  // CATEGORIES
  // ------------------------

  const addCategory = async (name) => {
    const res = await createCategory(
      {
        name,
        image: "",
        status: "Active",
      },
      token
    );

    if (res.data.success) {
      await loadData();
    }

    return res.data;
  };

  const editCategory = async (id, category) => {
    const res = await updateCategory(id, category, token);

    if (res.data.success) {
      await loadData();
    }

    return res.data;
  };

  const removeCategory = async (id) => {
    const res = await deleteCategory(id, token);

    if (res.data.success) {
      await loadData();
    }

    return res.data;
  };

  return (
    <ProductContext.Provider
      value={{
        loading,
        products,
        categories,
        loadData,

        addProduct,
        editProduct,
        removeProduct,

        addCategory,
        editCategory,
        removeCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }

  return context;
};