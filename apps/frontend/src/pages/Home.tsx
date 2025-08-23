import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaSearch, FaGift, FaShieldAlt, FaTelegram } from 'react-icons/fa';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Randar Market</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Первый NFT маркетплейс в TON с AI-радаром для поиска редких предметов
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/market"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Исследовать рынок
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all"
            >
              Подписаться на Radar
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Почему <span className="gradient-text">Randar Market</span>?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Radar</h3>
              <p className="text-gray-400">
                Получайте уведомления о редких NFT по вашим критериям в реальном времени
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGift className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Эксклюзивные дропы</h3>
              <p className="text-gray-400">
                Участвуйте в эксклюзивных NFT дропах с уникальными предметами
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTelegram className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Telegram интеграция</h3>
              <p className="text-gray-400">
                Войдите через Telegram и получайте уведомления прямо в боте
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRocket className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">TON блокчейн</h3>
              <p className="text-gray-400">
                Быстрые и дешевые транзакции на блокчейне TON
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Безопасность</h3>
              <p className="text-gray-400">
                Проверенная безопасность и прозрачные транзакции
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRocket className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Простота использования</h3>
              <p className="text-gray-400">
                Интуитивный интерфейс для начинающих и опытных пользователей
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Присоединяйтесь к тысячам пользователей, которые уже используют Randar Market
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/market"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Начать торговлю
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all"
            >
              Подписаться на Radar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
