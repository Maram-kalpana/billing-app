import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  loginUser,
  registerUser,
  getProfile,
} from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadUser();

  }, []);

  const loadUser = async () => {

    try {

      const savedToken = await AsyncStorage.getItem('@auth_token');

      if (!savedToken) {

        setLoading(false);

        return;

      }

      setToken(savedToken);

      const response = await getProfile(savedToken);

      if (response.success) {

        setUser(response.user);

      }

    } catch (error) {

      console.log(error);

      await AsyncStorage.removeItem('@auth_token');

    } finally {

      setLoading(false);

    }

  };

  // LOGIN

  const login = async (data) => {

    const response = await loginUser(data);

    if (response.data.success) {

      const jwt = response.data.token;

      setToken(jwt);

      setUser(response.data.user);

      await AsyncStorage.setItem('@auth_token', jwt);

    }

    return response.data;

  };

  // REGISTER

  const register = async (data) => {

  try {

    console.log("Sending Registration Data:", data);

    const response = await registerUser(data);

    console.log("Backend Response:", response.data);

    if (response.data.success) {

      const jwt = response.data.token;

      await AsyncStorage.setItem('@auth_token', jwt);

      setToken(jwt);

      const profile = await getProfile(jwt);

      console.log("Profile Response:", profile.data);

      if (profile.data.success) {

        setUser(profile.data.user);

      }

    }

    return response.data;

  } catch (error) {

    console.log("Registration Error:", error.message);

    console.log("Server Response:", error.response?.data);

    throw error;

  }

};
  // LOGOUT

  const logout = async () => {

    await AsyncStorage.removeItem('@auth_token');

    setUser(null);

    setToken(null);

  };

  const value = useMemo(() => ({

    user,

    token,

    loading,

    login,

    register,

    logout,

    isLoggedIn: !!token,

  }), [user, token, loading]);

  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () => {

  return useContext(AuthContext);

};