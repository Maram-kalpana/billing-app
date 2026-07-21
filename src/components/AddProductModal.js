import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { getCategoryIconName } from '../constants/ProductAssets';
import { assignProductImage, uploadProductImage } from '../services/ImageUploadService';
import { AddCategoryModal } from './AddCategoryModal';
import { useAuth } from "../context/AuthContext";

import {
  createProduct,
  updateProduct as updateProductAPI,
} from "../services/productService";

export const AddProductModal = ({ visible, onClose, productToEdit }) => {
  const { categories, addCategory } = useProducts();

const { token } = useAuth();



  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUri, setLocalImageUri] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setPrice(String(productToEdit.price || ''));
      setStock(String(productToEdit.stock || ''));
      const cat = categories.find(c => c.id === productToEdit.category_id);
setSelectedCategory(cat || null);
      setImageUrl(productToEdit.image_url || '');
      setLocalImageUri('');
    } else {
      resetForm();
    }
  }, [productToEdit]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setSelectedCategory('');
    setImageUrl('');
    setLocalImageUri('');
    setErrors({});
    setShowCategoryPicker(false);
    setShowAddCategoryModal(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!selectedCategory) newErrors.category = 'Category is required';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!stock || parseInt(stock, 10) <= 0) newErrors.stock = 'Stock must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    let finalImageUrl = imageUrl;

    if (localImageUri) {
      try {
        setUploading(true);
        const uploadedUrl = await uploadProductImage(localImageUri);
        finalImageUrl = uploadedUrl || finalImageUrl;
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          image: 'Image upload failed. Please try again.',
        }));
        return;
      } finally {
        setUploading(false);
      }
    } else if (!finalImageUrl) {
      try {
        setUploading(true);
        finalImageUrl = await assignProductImage(name.trim(), null);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          image: 'Image lookup failed. Please try again.',
        }));
        return;
      } finally {
        setUploading(false);
      }
    }

    const payload = {
      name: name.trim(),
      category: selectedCategory,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image_url: finalImageUrl || null,
      icon: getCategoryIconName(selectedCategory),
    };
try {

    if (productToEdit) {

        await updateProductAPI(productToEdit.id, {
            category_id: selectedCategory.id,
            product_name: name,
            price,
            stock,
            image: finalImageUrl,
        }, token);

    } else {

        await createProduct({
            category_id: selectedCategory.id,
            product_name: name,
            price,
            stock,
            image: finalImageUrl,
        }, token);

    }

    resetForm();

    onClose();

} catch (err) {

    console.log(err.response?.data || err.message);

}

    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setErrors((prev) => ({
        ...prev,
        image: 'Permission is required to select a product image.',
      }));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri || result.uri;
    if (uri) {
      setLocalImageUri(uri);
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleAddCategory = async (categoryName) => {
    const result = await addCategory(categoryName);
    if (result) {
      setSelectedCategory(result.data);
      setShowCategoryPicker(false);
      setShowAddCategoryModal(false);
    }
  };

  const getCategoryName = () => {
    return selectedCategory?.name || "";
};
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Product</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.iconSection}>
              <View style={styles.iconPreview}>
                {localImageUri || imageUrl ? (
                  <Image
                    source={{ uri: localImageUri || imageUrl }}
                    style={styles.imageAsset}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={getCategoryIconName(selectedCategory)}
                    size={46}
                    color="#16A34A"
                  />
                )}
              </View>
              <Text style={styles.iconHint}>
                {localImageUri || imageUrl
                  ? 'Product image will be used if available.'
                  : 'Choose an image or use category icon fallback.'}
              </Text>
              <TouchableOpacity
                style={styles.imageSelectBtn}
                onPress={handleSelectImage}
                activeOpacity={0.85}
              >
                <Text style={styles.imageSelectBtnText}>
                  {localImageUri || imageUrl ? 'Change Image' : 'Select Image'}
                </Text>
              </TouchableOpacity>
              {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={name}
                onChangeText={setName}
                placeholder="Enter product name"
                placeholderTextColor={Colors.textMuted}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={[styles.dropdown, errors.category && styles.inputError]}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Text style={selectedCategory ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {selectedCategory?.name || "Select category"}
                </Text>
                <MaterialCommunityIcons
                  name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
              {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
              {showCategoryPicker && (
                <View style={styles.categoryList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryOption,
                        selectedCategory?.id === cat.id && styles.categoryOptionActive,
                      ]}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={styles.categoryOptionText}>{cat.name}</Text>
                      {selectedCategory?.id === cat.id ? (
                        <MaterialCommunityIcons name="check" size={18} color={Colors.primary} />
                      ) : null}
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.categoryOptionAdd}
                    onPress={() => {
                      setShowCategoryPicker(false);
                      setShowAddCategoryModal(true);
                    }}
                  >
                    <MaterialCommunityIcons name="plus" size={18} color={Colors.primary} />
                    <Text style={styles.categoryOptionAddText}>Add category</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price (₹)</Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputError]}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
              />
              {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Stock Quantity</Text>
              <TextInput
                style={[styles.input, errors.stock && styles.inputError]}
                value={stock}
                onChangeText={setStock}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
              />
              {errors.stock ? <Text style={styles.errorText}>{errors.stock}</Text> : null}
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <MaterialCommunityIcons name="check" size={20} color={Colors.white} />
              <Text style={styles.saveBtnText}>Save Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <AddCategoryModal
        visible={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSave={handleAddCategory}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: Colors.background,
    borderRadius: 999,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconPreview: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  imageAsset: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  iconHint: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  imageSelectBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    marginTop: 6,
  },
  imageSelectBtnText: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: Fonts.sizes.xs,
    marginTop: 4,
    marginLeft: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  dropdownText: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
  },
  dropdownPlaceholder: {
    fontSize: Fonts.sizes.md,
    color: Colors.textMuted,
  },
  categoryList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 6,
    backgroundColor: Colors.surface,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  categoryOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  categoryOptionText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
    flex: 1,
  },
  categoryOptionAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.background,
    marginTop: 4,
    gap: 8,
  },
  categoryOptionAddText: {
    color: Colors.primary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  cancelBtnText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: Fonts.sizes.sm,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    gap: 6,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Fonts.sizes.sm,
  },
});
