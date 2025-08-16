import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Marketplace from './pages/Marketplace';
import Collections from './pages/Collections';
import Gifts from './pages/Gifts';
import Drops from './pages/Drops';
import ActivityPage from './pages/Activity';
import Radar     from './pages/Radar';
import RadarPage from './components/RadarPage';
import Profile   from './pages/Profile';
import Login     from './pages/Login';
import NotFound  from './pages/NotFound';
import Search from './pages/Search';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* публичная страница логина */}
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<AppShell><Search /></AppShell>} />

          {/* приватные страницы — все в одном Layout */}
          <Route path="/" element={<AppShell><Home /></AppShell>} />
          <Route path="/inventory" element={<AppShell><Inventory /></AppShell>} />
          <Route path="/marketplace" element={<AppShell><Marketplace /></AppShell>} />
          <Route path="/collections" element={<AppShell><Collections /></AppShell>} />
          <Route path="/gifts" element={<AppShell><Gifts /></AppShell>} />
          <Route path="/drops" element={<AppShell><Drops /></AppShell>} />
          <Route path="/activity" element={<AppShell><ActivityPage /></AppShell>} />
          <Route path="/radar" element={<AppShell><Radar /></AppShell>} />
          <Route path="/radar/analysis" element={<AppShell><RadarPage /></AppShell>} />
          <Route path="/profile" element={<AppShell><Profile /></AppShell>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
