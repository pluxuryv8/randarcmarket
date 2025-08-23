import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marketApi } from '../services/api';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface Collection {
  address: string;
  name: string;
  description?: string;
  image_url?: string;
  floor_price?: number;
  volume_24h?: number;
  items_count?: number;
  owners_count?: number;
}

const Market: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await marketApi.getCollections();
        if (response.data.success) {
          setCollections(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-4xl font-bold mb-4">NFT Market</h1>
        <p className="text-gray-400">Исследуйте коллекции и находите редкие NFT</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск коллекций..."
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

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCollections.map((collection) => (
          <Link
            key={collection.address}
            to={`/collection/${collection.address}`}
            className="card p-6 hover:transform hover:scale-105 transition-all duration-300"
          >
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
              {collection.image_url ? (
                <img
                  src={collection.image_url}
                  alt={collection.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-4xl text-gray-400">🎨</div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-2 text-white">{collection.name}</h3>
            
            {collection.description && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {collection.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Floor</div>
                <div className="text-white font-semibold">
                  {collection.floor_price ? `${collection.floor_price} TON` : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-400">24h Volume</div>
                <div className="text-white font-semibold">
                  {collection.volume_24h ? `${collection.volume_24h} TON` : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Items</div>
                <div className="text-white font-semibold">
                  {collection.items_count?.toLocaleString() || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Owners</div>
                <div className="text-white font-semibold">
                  {collection.owners_count?.toLocaleString() || 'N/A'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCollections.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Коллекции не найдены</h3>
          <p className="text-gray-400">Попробуйте изменить поисковый запрос</p>
        </div>
      )}
    </div>
  );
};

export default Market;
