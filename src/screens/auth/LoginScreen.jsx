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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Logo } from '../../components/auth/Logo';
import { CustomInput } from '../../components/auth/CustomInput';
import { PrimaryButton } from '../../components/auth/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/validators';

export const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = 'Email is required';
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email';
    if (!password.trim()) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {

  if (!validate()) return;

  setLoading(true);

  try {

    const response = await login({
      email,
      password,
    });

    if (response.success) {

      Alert.alert(
        "Success",
        "Login Successful"
      );

      navigation.replace("Splash");

    } else {

      Alert.alert(
        "Login Failed",
        response.message
      );

    }

  } catch (error) {

    console.log("Login Error:", error.response?.data);

    Alert.alert(
      "Login Failed",
      error.response?.data?.message ||
      "Something went wrong. Please try again."
    );

  } finally {

    setLoading(false);

  }

};
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.card}>
            <Logo title="Welcome Back" subtitle="Sign in to continue" />

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
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              iconName="lock-outline"
              rightIconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword((prev) => !prev)}
              error={errors.password}
            />

            <View style={styles.rowBetween}>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe((prev) => !prev)}>
                <View style={[styles.checkbox, rememberMe ? styles.checkboxActive : null]}>
                  {rememberMe ? <MaterialCommunityIcons name="check" size={14} color={Colors.white} /> : null}
                </View>
                <Text style={styles.checkboxText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.linkText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <PrimaryButton title="Login" loading={loading} onPress={handleLogin} />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.secondaryAction} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.secondaryText}>Don’t have an account?</Text>
              <Text style={styles.secondaryLink}>Register</Text>
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxText: {
    color: Colors.text,
    fontSize: Fonts.sizes.sm,
  },
  linkText: {
    color: Colors.primary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
  },
  secondaryAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
