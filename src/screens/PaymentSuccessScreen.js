import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { useBilling } from '../context/BillingContext';

export const PaymentSuccessScreen = ({ navigation }) => {
  const { billNumber } = useBilling();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Auto-navigate to Reports after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              routes: [
                { name: 'Shop' },
                { name: 'Products' },
                { name: 'Billing' },
                { name: 'Reports' },
                { name: 'Account' },
              ],
              index: 3, // Reports tab
            },
          },
        ],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={60} color={Colors.white} />
        </View>
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.billText}>Bill #{billNumber}</Text>
        <Text style={styles.subtitle}>Redirecting to Reports...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 40,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  billText: {
    fontSize: Fonts.sizes.lg,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
  },
});
