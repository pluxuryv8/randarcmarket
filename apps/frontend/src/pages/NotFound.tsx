import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaRocket } from 'react-icons/fa';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-8">🚀</div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Похоже, что страница, которую вы ищете, не существует или была перемещена.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <FaHome />
            <span>На главную</span>
          </Link>
          
          <Link
            to="/market"
            className="flex items-center justify-center space-x-2 border border-blue-500 text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all"
          >
            <FaSearch />
            <span>Исследовать рынок</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
