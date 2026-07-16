import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as authLogin, logout as authLogout, register as authRegister } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@auth_token');
        const storedUser = await AsyncStorage.getItem('@auth_user');

        if (storedToken) {
          setToken(storedToken);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.warn('Auth bootstrap failed', error);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (credentials) => {
    const response = await authLogin(credentials);
    const nextUser = response.user;
    const nextToken = response.token || 'user_logged_in';

    setUser(nextUser);
    setToken(nextToken);
    await AsyncStorage.setItem('@auth_token', nextToken);
    await AsyncStorage.setItem('@auth_user', JSON.stringify(nextUser));

    return response;
  };

  const register = async (payload) => {
    const response = await authRegister(payload);
    const nextUser = response.user;
    const nextToken = response.token || 'user_logged_in';

    setUser(nextUser);
    setToken(nextToken);
    await AsyncStorage.setItem('@auth_token', nextToken);
    await AsyncStorage.setItem('@auth_user', JSON.stringify(nextUser));

    return response;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@auth_user');
  };

  const isLoggedIn = () => Boolean(token);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    logout,
    register,
    isLoggedIn,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
