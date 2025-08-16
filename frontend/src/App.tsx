import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout    from './components/Layout';
import Home from './pages/Home';
import Market from './pages/Market';
import Collections from './pages/Collections';
import Collection from './pages/Collection';
import Item from './pages/Item';
import Drops from './pages/Drops';
import Activity from './pages/Activity';
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
          {/* новый маркет (Explore) */}
          <Route path="/market" element={<Layout><Market /></Layout>} />
          {/* коллекции и предметы */}
          <Route path="/collections" element={<Layout><Collections /></Layout>} />
          <Route path="/collection/:id" element={<Layout><Collection /></Layout>} />
          <Route path="/item/:id" element={<Layout><Item /></Layout>} />
          {/* дропы/ланчпад и активность */}
          <Route path="/drops" element={<Layout><Drops /></Layout>} />
          <Route path="/activity" element={<Layout><Activity /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
