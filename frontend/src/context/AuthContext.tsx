import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TelegramUserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  isTelegramLinked: boolean;
  tonWallet?: string;
}

interface AuthContextType {
  user: TelegramUserProfile | null;
  loginWithTelegram: () => Promise<void> | void;
  linkTonWallet: (address: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('randar_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('randar_user', JSON.stringify(user));
    else localStorage.removeItem('randar_user');
  }, [user]);

  const loginWithTelegram = async () => {
    // Заглушка Telegram Login: подменяем профилем до подключения реального SDK/бота
    const demo: TelegramUserProfile = {
      id: 'tg_1001',
      username: 'randar_user',
      avatarUrl: undefined,
      isTelegramLinked: true,
      tonWallet: undefined,
    };
    setUser(demo);
  };

  const linkTonWallet = (address: string) => {
    if (!user) return;
    setUser({ ...user, tonWallet: address });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginWithTelegram, linkTonWallet, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
