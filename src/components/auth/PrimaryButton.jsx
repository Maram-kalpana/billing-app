import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';

export const PrimaryButton = ({ title, onPress, loading = false, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.disabled : null]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  disabled: {
    opacity: 0.7,
  },
  title: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
  },
});
