import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  steamId: string;
  name: string;
  avatar: string;
  telegramLinked: boolean;
}

interface AuthContextType {
  user: User | null;
  loginWithSteam: () => void;
  loginWithTelegram: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('randar_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('randar_user', JSON.stringify(user));
    else localStorage.removeItem('randar_user');
  }, [user]);

  const loginWithSteam = () => {
    const demo: User = {
      steamId: '76561198000000000',
      name: 'CSGOPlayer123',
      avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/demo.jpg',
      telegramLinked: false,
    };
    setUser(demo);
  };

  const loginWithTelegram = () => {
    if (!user) return alert('Сначала войдите через Steam');
    setUser({ ...user, telegramLinked: true });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginWithSteam, loginWithTelegram, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
