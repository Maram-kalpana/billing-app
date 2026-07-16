import React from 'react';
import { View, Text,TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';

export const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  iconName,
  rightIconName,
  onRightIconPress,
  error,
  multiline = false,
}) => {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, error ? styles.containerError : null]}>
        {iconName ? (
          <MaterialCommunityIcons name={iconName} size={18} color={Colors.textMuted} />
        ) : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
        />
        {rightIconName ? (
          <TouchableOpacity onPress={onRightIconPress} hitSlop={8}>
            <MaterialCommunityIcons name={rightIconName} size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginBottom: 8,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  containerError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    paddingVertical: 0,
  },
  errorText: {
    color: Colors.error,
    fontSize: Fonts.sizes.xs,
    marginTop: 6,
    marginLeft: 2,
  },
});
