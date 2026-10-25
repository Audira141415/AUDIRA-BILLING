import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  internetNumber?: string;
  address?: string;
  role: 'customer' | 'technician' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      const response = await authAPI.login(identifier, password);
      const token = response.data.token || (response.data as any).access_token;
      const rawUser = response.data.user || (response.data as any).customer;
      const userData: User = {
        ...rawUser,
        role: rawUser.role || 'customer',
      };

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      const { token, user: userData } = response.data;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
