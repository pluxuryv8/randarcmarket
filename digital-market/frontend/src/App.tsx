import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout    from './components/Layout';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Marketplace from './pages/Marketplace';
import Radar     from './pages/Radar';
import RadarPage from './components/RadarPage';
import Profile   from './pages/Profile';
import Login     from './pages/Login';
import NotFound  from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* публичная страница логина */}
          <Route path="/login" element={<Login />} />

          {/* приватные страницы — все в одном Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/inventory"
            element={
              <Layout>
                <Inventory />
              </Layout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <Layout>
                <Marketplace />
              </Layout>
            }
          />
          <Route
            path="/radar"
            element={
              <Layout>
                <Radar />
              </Layout>
            }
          />
          <Route
            path="/radar/analysis"
            element={
              <Layout>
                <RadarPage />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
