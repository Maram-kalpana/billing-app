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

  try {

    console.log("Sending Login Data:", data);

    const response = await loginUser(data);

    console.log("Login Response:", response.data);

    if (response.data.success) {

      const jwt = response.data.token;

      await AsyncStorage.setItem("@auth_token", jwt);

      setToken(jwt);

      setUser(response.data.user);

    }

    return response.data;

  } catch (error) {

    console.log("Login Error:", error.response?.data);

    throw error;

  }

};

  // REGISTER

  const register = async (data) => {

  try {

    const response = await registerUser(data);

    console.log("Register Response:", response.data);

    return response.data;

  } catch (error) {

    console.log("Register Error:", error.response?.data);

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