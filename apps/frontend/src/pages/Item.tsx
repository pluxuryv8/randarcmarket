import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { giftsApi } from '../services/giftsLocal';
import { GiftItem as ItemType } from '../types/domain';
import { FaArrowLeft, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';

const ItemPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [item, setItem] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!address) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await giftsApi.getItem(address);
        setItem(data);
      } catch (error) {
        console.error('Error fetching item details:', error);
        setError('Предмет не найден');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [address]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Можно добавить toast уведомление
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
          <p className="text-text-300">Загрузка предмета...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2 text-text-100">Предмет не найден</h3>
        <p className="text-text-300 mb-4">{error || 'Попробуйте другой адрес'}</p>
        <Link to="/market" className="btn-primary">
          Вернуться к рынку
        </Link>
      </div>
    );
  }

  return (
    <div className="item-page max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/market"
          className="inline-flex items-center space-x-2 text-accent-red hover:text-accent-red-2 mb-4 transition-colors"
        >
          <FaArrowLeft />
          <span>Назад к рынку</span>
        </Link>
        <h1 className="text-4xl font-bold mb-4 text-text-100">{item.title}</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card p-6">
          <div className="aspect-square bg-bg-800 rounded-lg flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img
                src={`/api/img?url=${encodeURIComponent(item.image)}`}
                srcSet={`/api/img?url=${encodeURIComponent(item.image)} 1x, /api/img?url=${encodeURIComponent(item.image)} 2x`}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x600/1f2632/666?text=No+Image';
                }}
              />
            ) : (
              <div className="text-8xl text-text-300">🎨</div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4 text-text-100">Информация</h2>
            
            <div className="space-y-4">
              {/* Price */}
              {item.price && (
                <div className="flex justify-between items-center">
                  <span className="text-text-300">Цена</span>
                  <span className="text-2xl font-bold text-accent-red">{item.price} TON</span>
                </div>
              )}

              {/* Status */}
              <div className="flex justify-between items-center">
                <span className="text-text-300">Статус</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.isForSale 
                    ? 'bg-green-900/20 text-green-400 border border-green-700' 
                    : 'bg-gray-900/20 text-gray-400 border border-gray-700'
                }`}>
                  {item.isForSale ? 'В продаже' : 'Не продается'}
                </span>
              </div>

              {/* Rarity */}
              {item.rarity && (
                <div className="flex justify-between items-center">
                  <span className="text-text-300">Редкость</span>
                  <span className="text-text-100 font-medium">{item.rarity}</span>
                </div>
              )}

              {/* Last Sale */}
              {item.lastSale && (
                <div className="flex justify-between items-center">
                  <span className="text-text-300">Последняя продажа</span>
                  <span className="text-text-100 font-medium">{item.lastSale} TON</span>
                </div>
              )}

              {/* Owner */}
              {item.owner && (
                <div className="flex justify-between items-center">
                  <span className="text-text-300">Владелец</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-text-100 font-mono text-sm">
                      {item.owner.slice(0, 6)}...{item.owner.slice(-4)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.owner!)}
                      className="text-text-300 hover:text-accent-red transition-colors"
                      aria-label="Копировать адрес владельца"
                    >
                      <FaCopy size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="flex justify-between items-center">
                <span className="text-text-300">Адрес</span>
                <div className="flex items-center space-x-2">
                  <span className="text-text-100 font-mono text-sm">
                    {item.address.slice(0, 6)}...{item.address.slice(-4)}
                  </span>
                                      <button
                      onClick={() => copyToClipboard(item.address)}
                      className="text-text-300 hover:text-accent-red transition-colors"
                      aria-label="Копировать адрес предмета"
                    >
                      <FaCopy size={14} />
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4 text-text-100">Действия</h2>
            
            <div className="space-y-3">
              {item.isForSale && (
                <button className="btn-primary w-full py-3">
                  Купить за {item.price} TON
                </button>
              )}
              
              <button className="w-full py-3 px-4 border border-line-700 rounded-lg text-text-100 hover:bg-surface-800 transition-colors">
                Предложить цену
              </button>
              
              <button className="w-full py-3 px-4 border border-line-700 rounded-lg text-text-100 hover:bg-surface-800 transition-colors">
                Добавить в избранное
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes */}
      {item.traits && Object.keys(item.traits).length > 0 && (
        <div className="mt-8">
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4 text-text-100">Атрибуты</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(item.traits).map(([trait, value]) => (
                <div key={trait} className="bg-surface-800 rounded-lg p-4 border border-line-700">
                  <div className="text-sm text-text-300 mb-1">{trait}</div>
                  <div className="text-text-100 font-medium">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Similar Items */}
      <div className="mt-8">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4 text-text-100">Похожие предметы</h2>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-text-300">Похожие предметы будут показаны здесь</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
