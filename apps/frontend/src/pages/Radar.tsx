import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// import { radarApi } from '../services/api'; // Удален старый API
import { FaSearch, FaBell, FaPlus, FaTrash, FaCog } from 'react-icons/fa';

interface WatchlistFilter {
  id: string;
  user_id: string;
  collection_address?: string;
  min_price?: number;
  max_price?: number;
  rarity_filter?: string[];
  below_floor_percent?: number;
  created_at: Date;
}

interface RadarSignal {
  id: string;
  user_id: string;
  filter_id: string;
  item_address: string;
  signal_type: 'price_drop' | 'rarity_match' | 'volume_spike' | 'below_floor';
  message: string;
  created_at: Date;
}

const Radar: React.FC = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistFilter[]>([]);
  const [notifications, setNotifications] = useState<RadarSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFilter, setShowAddFilter] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Временные моки для демонстрации
      const mockWatchlist: WatchlistFilter[] = [
        {
          id: '1',
          user_id: user.id,
          collection_address: 'EQD...abc123',
          min_price: 10,
          max_price: 100,
          rarity_filter: ['Legendary', 'Rare'],
          below_floor_percent: 20,
          created_at: new Date()
        }
      ];
      
      const mockNotifications: RadarSignal[] = [
        {
          id: '1',
          user_id: user.id,
          filter_id: '1',
          item_address: 'EQD...def456',
          signal_type: 'price_drop',
          message: 'Цена упала на 15%',
          created_at: new Date()
        }
      ];

      setWatchlist(mockWatchlist);
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching radar data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold mb-2">Требуется авторизация</h3>
        <p className="text-gray-400">Войдите в систему для доступа к Radar</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Radar</h1>
        <p className="text-gray-400">Настройте уведомления о редких NFT</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Watchlist */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Мои фильтры</h2>
            <button
              onClick={() => setShowAddFilter(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <FaPlus className="inline mr-2" />
              Добавить фильтр
            </button>
          </div>

          {watchlist.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-400">У вас пока нет фильтров</p>
              <button
                onClick={() => setShowAddFilter(true)}
                className="mt-4 text-blue-400 hover:text-blue-300"
              >
                Создать первый фильтр
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlist.map((filter) => (
                <div key={filter.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        Фильтр #{filter.id.slice(0, 8)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {filter.min_price && filter.max_price && 
                          `Цена: ${filter.min_price}-${filter.max_price} TON`}
                        {filter.below_floor_percent && 
                          ` | Ниже floor: ${filter.below_floor_percent}%`}
                      </div>
                    </div>
                    <button
                      onClick={() => {/* TODO: Remove filter */}}
                      className="text-red-400 hover:text-red-300"
                      title="Удалить фильтр"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Уведомления</h2>
            <button
              onClick={() => {/* TODO: Mark all as read */}}
              className="text-blue-400 hover:text-blue-300"
            >
              Отметить все как прочитанные
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔔</div>
              <p className="text-gray-400">Уведомлений пока нет</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">
                        {notification.message}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Filter Modal */}
      {showAddFilter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">Добавить фильтр</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Минимальная цена (TON)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Максимальная цена (TON)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Ниже floor price (%)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddFilter(false)}
                className="flex-1 border border-gray-500 text-gray-400 py-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  // TODO: Add filter
                  setShowAddFilter(false);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Radar;
