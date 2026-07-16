import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Logo } from '../../components/auth/Logo';
import { useAuth } from '../../context/AuthContext';

export const SplashScreen = ({ navigation }) => {
  const { token, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timeout = setTimeout(() => {
      if (token) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [loading, navigation, token]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)} style={styles.container}>
        <Logo title="Billing App" subtitle="Smart Billing Solution" />
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
  },
  loader: {
    marginTop: 24,
  },
});
