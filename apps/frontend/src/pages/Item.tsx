import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marketApi } from '../services/api';
import { FaArrowLeft, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';

interface NFTItem {
  address: string;
  collection_address: string;
  name: string;
  description?: string;
  image_url?: string;
  attributes?: Record<string, any>;
  price?: number;
  owner?: string;
  last_sale?: number;
  rarity_score?: number;
}

const Item: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [item, setItem] = useState<NFTItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!address) return;
      
      try {
        const response = await marketApi.getItem(address);
        if (response.data.success) {
          setItem(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [address]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Скопировано в буфер обмена!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">Предмет не найден</h3>
        <p className="text-gray-400">Попробуйте другой адрес</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/market"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <FaArrowLeft />
          <span>Назад к рынку</span>
        </Link>
        <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card p-6">
          <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-8xl text-gray-400">🎨</div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">Информация</h2>
            
            {item.description && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Описание</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-sm">Адрес</div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono text-sm">
                    {item.address.slice(0, 8)}...{item.address.slice(-6)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(item.address)}
                    className="text-blue-400 hover:text-blue-300"
                    title="Копировать адрес"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>

              {item.price && (
                <div>
                  <div className="text-gray-400 text-sm">Цена</div>
                  <div className="text-blue-400 font-semibold text-lg">
                    {item.price} TON
                  </div>
                </div>
              )}

              {item.rarity_score && (
                <div>
                  <div className="text-gray-400 text-sm">Редкость</div>
                  <div className="text-white font-semibold">
                    {item.rarity_score.toFixed(2)}
                  </div>
                </div>
              )}

              {item.last_sale && (
                <div>
                  <div className="text-gray-400 text-sm">Последняя продажа</div>
                  <div className="text-white font-semibold">
                    {item.last_sale} TON
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attributes */}
          {item.attributes && Object.keys(item.attributes).length > 0 && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Атрибуты</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(item.attributes).map(([key, value]) => (
                  <div key={key} className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400 text-sm">{key}</div>
                    <div className="text-white font-semibold">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">Действия</h2>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                Купить за {item.price || 'N/A'} TON
              </button>
              <button className="w-full border border-blue-500 text-blue-400 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all">
                Предложить цену
              </button>
              <button className="w-full border border-gray-500 text-gray-400 py-3 rounded-lg font-semibold hover:bg-gray-500 hover:text-white transition-all">
                Добавить в избранное
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
