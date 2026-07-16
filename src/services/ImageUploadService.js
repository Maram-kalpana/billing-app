import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UPLOAD_ENDPOINT = 'https://your-server.com/api/upload';
const IMAGE_ASSIGNMENT_ENDPOINT = 'https://your-server.com/api/products/auto-image';
export const DEFAULT_GROCERY_PLACEHOLDER =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80';

const IMAGE_CACHE_KEY = '@product-image-cache';
const imageCache = new Map();
let cacheLoaded = false;

const loadCache = async () => {
  if (cacheLoaded) return;

  try {
    const stored = await AsyncStorage.getItem(IMAGE_CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([key, value]) => imageCache.set(key, value));
    }
  } catch (error) {
    console.warn('Unable to load image cache', error);
  } finally {
    cacheLoaded = true;
  }
};

const persistCache = async () => {
  try {
    await AsyncStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(Object.fromEntries(imageCache)));
  } catch (error) {
    console.warn('Unable to save image cache', error);
  }
};

const buildSearchQueries = (productName) => {
  const normalizedName = (productName || '').trim();
  const queries = [
    normalizedName || 'grocery product',
    `${normalizedName || 'grocery product'} isolated product`,
    `${normalizedName || 'grocery product'} product`,
    `${normalizedName || 'grocery product'} grocery`,
    `${normalizedName || 'grocery product'} package`,
  ];

  return Array.from(new Set(queries)).slice(0, 6);
};

export const prefetchProductImage = async (uri) => {
  if (!uri) return;

  try {
    await Image.prefetch(uri);
  } catch (error) {
    console.warn('Unable to prefetch image', error);
  }
};

export const assignProductImage = async (productName, existingImageUrl) => {
  if (existingImageUrl) {
    await prefetchProductImage(existingImageUrl);
    return existingImageUrl;
  }

  const normalizedName = (productName || 'grocery product').trim().toLowerCase();
  await loadCache();

  const cachedImage = imageCache.get(normalizedName);
  if (cachedImage) {
    await prefetchProductImage(cachedImage);
    return cachedImage;
  }

  const queries = buildSearchQueries(productName);

  try {
    const response = await fetch(IMAGE_ASSIGNMENT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName: productName?.trim() || 'grocery product', queries }),
    });

    if (!response.ok) {
      throw new Error(`Image assignment failed: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl =
      data.image_url || data.imageUrl || data.url || data.photo?.src?.large || data.photo?.src?.medium || null;

    if (imageUrl) {
      imageCache.set(normalizedName, imageUrl);
      await persistCache();
      await prefetchProductImage(imageUrl);
      return imageUrl;
    }
  } catch (error) {
    console.warn('Auto image lookup failed', error);
  }

  imageCache.set(normalizedName, DEFAULT_GROCERY_PLACEHOLDER);
  await persistCache();
  await prefetchProductImage(DEFAULT_GROCERY_PLACEHOLDER);
  return DEFAULT_GROCERY_PLACEHOLDER;
};

export const uploadProductImage = async (uri) => {
  if (!uri) return null;

  const uriParts = uri.split('.');
  const fileType = uriParts[uriParts.length - 1].toLowerCase();
  const formData = new FormData();

  formData.append('file', {
    uri,
    name: `product_${Date.now()}.${fileType}`,
    type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
  });

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image upload failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.image_url || data.url || null;
};
