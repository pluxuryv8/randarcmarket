import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTonWallet } from '@tonconnect/ui-react';
import { api } from '../services/api';

interface User {
  id: string;
  tg_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  wallet_address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (initData: any) => Promise<void>;
  logout: () => void;
  updateWallet: (address: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const wallet = useTonWallet();

  useEffect(() => {
    // Check if user is authenticated on mount
    if (token) {
      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.success) {
          setUser(response.data.data.user);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Update wallet address when wallet connects
    if (wallet && user) {
      updateWallet(wallet.account.address);
    }
  }, [wallet, user]);

  const login = async (initData: any) => {
    try {
      const response = await api.post('/auth/telegram/verify', initData);
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateWallet = (address: string) => {
    if (user) {
      setUser({ ...user, wallet_address: address });
      
      // Update wallet on backend
      api.post('/auth/wallet', { address }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    updateWallet,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
