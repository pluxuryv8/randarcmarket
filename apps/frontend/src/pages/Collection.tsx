import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marketApi } from '../services/api';
import { FaArrowLeft, FaSearch, FaFilter } from 'react-icons/fa';

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

const Collection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      if (!id) return;
      
      try {
        const response = await marketApi.getCollectionItems(id);
        if (response.data.success) {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching collection items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [id]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/market"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <FaArrowLeft />
          <span>Назад к рынку</span>
        </Link>
        <h1 className="text-4xl font-bold mb-4">Коллекция #{id?.slice(0, 8)}...</h1>
        <p className="text-gray-400">{items.length} предметов</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск предметов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button className="flex items-center space-x-2 bg-white/5 border border-white/10 px-6 py-3 rounded-lg text-white hover:bg-white/10 transition-colors">
          <FaFilter />
          <span>Фильтры</span>
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Link
            key={item.address}
            to={`/item/${item.address}`}
            className="card p-4 hover:transform hover:scale-105 transition-all duration-300"
          >
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-4xl text-gray-400">🎨</div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-2 text-white">{item.name}</h3>
            
            {item.price && (
              <div className="text-blue-400 font-semibold mb-2">
                {item.price} TON
              </div>
            )}

            {item.rarity_score && (
              <div className="text-sm text-gray-400">
                Редкость: {item.rarity_score.toFixed(2)}
              </div>
            )}
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Предметы не найдены</h3>
          <p className="text-gray-400">Попробуйте изменить поисковый запрос</p>
        </div>
      )}
    </div>
  );
};

export default Collection;
