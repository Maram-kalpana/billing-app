import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Logo } from '../../components/auth/Logo';
import { CustomInput } from '../../components/auth/CustomInput';
import { PrimaryButton } from '../../components/auth/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { validateAuthFields } from '../../utils/validators';

export const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
 const [shopType, setShopType] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    const validationErrors = validateAuthFields({
      fullName,
      shopName,
      shopType,
      mobile,
      email,
      password,
      confirmPassword,
    });

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await register({ fullName, shopName, shopType, mobile, email, password });
      navigation.replace('Splash');
    } catch (error) {
      Alert.alert('Registration Failed', 'Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.card}>
            <Logo title="Create Account" subtitle="Set up your store" />

            <CustomInput
              label="Full Name"
              value={fullName}
              onChangeText={(value) => {
                setFullName(value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              placeholder="Enter your name"
              iconName="account-outline"
              error={errors.fullName}
            />

            <CustomInput
              label="Shop Name"
              value={shopName}
              onChangeText={(value) => {
                setShopName(value);
                if (errors.shopName) setErrors((prev) => ({ ...prev, shopName: undefined }));
              }}
              placeholder="Enter shop name"
              iconName="storefront-outline"
              error={errors.shopName}
            />

            <CustomInput
  label="Business Type"
  value={shopType}
  onChangeText={(value) => {
    setShopType(value);
    if (errors.shopType) {
      setErrors((prev) => ({ ...prev, shopType: undefined }));
    }
  }}
  placeholder="Enter your business type (e.g. Grocery Store, Boutique)"
  iconName="briefcase-outline"
  error={errors.shopType}
/>
            <CustomInput
              label="Mobile Number"
              value={mobile}
              onChangeText={(value) => {
                setMobile(value);
                if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
              }}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              iconName="phone-outline"
              error={errors.mobile}
            />

            <CustomInput
              label="Email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              iconName="email-outline"
              error={errors.email}
            />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="Minimum 8 characters"
              secureTextEntry={!showPassword}
              iconName="lock-outline"
              rightIconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword((prev) => !prev)}
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              iconName="lock-check-outline"
              rightIconName={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
              error={errors.confirmPassword}
            />

            <PrimaryButton title="Register" loading={loading} onPress={handleRegister} />

            <TouchableOpacity style={styles.secondaryAction} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.secondaryText}>Already have an account?</Text>
              <Text style={styles.secondaryLink}>Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  secondaryAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  secondaryLink: {
    color: Colors.primary,
    fontWeight: '700',
    marginLeft: 6,
    fontSize: Fonts.sizes.sm,
  },
});
