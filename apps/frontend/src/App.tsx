import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Market from './pages/Market';
import Collection from './pages/Collection';
import Item from './pages/Item';
import Pricing from './pages/Pricing';
import AdminPage from './pages/Admin';
// import Drops from './pages/Drops'; // Удалено
import Radar from './pages/Radar';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/collection/:id" element={<Collection />} />
              <Route path="/item/:address" element={<Item />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* <Route path="/drops" element={<Drops />} /> */}
              {/* <Route path="/drops/:id" element={<Drops />} /> */}
              <Route path="/radar" element={<Radar />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
