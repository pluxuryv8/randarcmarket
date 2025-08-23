import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentsApi } from '../services/api';
import { useTonConnect } from '@tonconnect/ui-react';
import { FaCheck, FaRocket, FaBell, FaShieldAlt, FaZap, FaSearch } from 'react-icons/fa';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { sender } = useTonConnect();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      alert('Пожалуйста, войдите в систему');
      return;
    }

    if (!sender) {
      alert('Пожалуйста, подключите кошелек TON');
      return;
    }

    setLoading(true);
    try {
      const response = await paymentsApi.createSubscription();
      
      if (response.data.success) {
        const { transaction } = response.data.data;
        
        // Send transaction via TonConnect
        await sender.send({
          to: transaction.to,
          amount: transaction.amount,
          comment: transaction.comment
        });
        
        alert('Подписка успешно создана! Проверьте статус в разделе Radar.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Ошибка при создании подписки. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Подписка <span className="gradient-text">Radar</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Получайте уведомления о редких NFT в реальном времени и будьте первым, кто узнает о новых возможностях
        </p>
      </div>

      {/* Pricing Card */}
      <div className="card p-8 md:p-12 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaRocket className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Radar Pro</h2>
          <div className="text-4xl font-bold mb-2">
            <span className="gradient-text">25 TON</span>
          </div>
          <div className="text-gray-400">за 30 дней</div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <FaBell className="text-blue-500 flex-shrink-0" />
            <span>Уведомления в реальном времени</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaSearch className="text-blue-500 flex-shrink-0" />
            <span>AI-поиск редких NFT</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-blue-500 flex-shrink-0" />
            <span>Приоритетный доступ к дропам</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaZap className="text-blue-500 flex-shrink-0" />
            <span>Мгновенные уведомления в Telegram</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaCheck className="text-blue-500 flex-shrink-0" />
            <span>Настраиваемые фильтры</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaCheck className="text-blue-500 flex-shrink-0" />
            <span>Аналитика и статистика</span>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handleSubscribe}
          disabled={loading || !user || !sender}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Обработка...</span>
            </div>
          ) : !user ? (
            'Войдите для подписки'
          ) : !sender ? (
            'Подключите кошелек'
          ) : (
            'Подписаться на Radar'
          )}
        </button>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>• Подписка автоматически продлевается каждые 30 дней</p>
          <p>• Можно отменить в любое время</p>
          <p>• Без скрытых комиссий</p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-20">
        <h3 className="text-2xl font-bold text-center mb-12">Почему стоит подписаться?</h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBell className="text-blue-500 text-2xl" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Мгновенные уведомления</h4>
            <p className="text-gray-400">
              Получайте уведомления о новых листингах и изменениях цен в реальном времени
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-purple-500 text-2xl" />
            </div>
            <h4 className="text-lg font-semibold mb-2">AI-анализ</h4>
            <p className="text-gray-400">
              Наш AI анализирует рынок и находит редкие возможности для покупки
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-green-500 text-2xl" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Приоритетный доступ</h4>
            <p className="text-gray-400">
              Будьте первым, кто узнает о новых дропах и эксклюзивных предложениях
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
