import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dropsApi } from '../services/api';
import { FaGift, FaUsers, FaClock, FaRocket } from 'react-icons/fa';

interface Drop {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_ton: number;
  max_participants?: number;
  start_date: Date;
  end_date: Date;
  status: 'upcoming' | 'active' | 'ended';
  participants_count: number;
}

const Drops: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [currentDrop, setCurrentDrop] = useState<Drop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        if (id) {
          // Fetch specific drop
          const response = await dropsApi.getDrop(id);
          if (response.data.success) {
            setCurrentDrop(response.data.data);
          }
        } else {
          // Fetch all drops
          const response = await dropsApi.getDrops();
          if (response.data.success) {
            setDrops(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching drops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrops();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (id && currentDrop) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              {currentDrop.image_url ? (
                <img
                  src={currentDrop.image_url}
                  alt={currentDrop.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-8xl text-gray-400">🎁</div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">{currentDrop.name}</h1>
                <p className="text-gray-400 mb-6">{currentDrop.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Цена</div>
                  <div className="text-blue-400 font-semibold text-xl">
                    {currentDrop.price_ton} TON
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Участники</div>
                  <div className="text-white font-semibold text-xl">
                    {currentDrop.participants_count}
                    {currentDrop.max_participants && ` / ${currentDrop.max_participants}`}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-400">
                  <FaClock />
                  <span>Начало: {new Date(currentDrop.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <FaClock />
                  <span>Конец: {new Date(currentDrop.end_date).toLocaleDateString()}</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                Участвовать в дропе
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">NFT Drops</h1>
        <p className="text-gray-400">Участвуйте в эксклюзивных NFT дропах</p>
      </div>

      {/* Drops Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drops.map((drop) => (
          <div key={drop.id} className="card p-6">
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
              {drop.image_url ? (
                <img
                  src={drop.image_url}
                  alt={drop.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-6xl text-gray-400">🎁</div>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-white">{drop.name}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {drop.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-gray-400 text-sm">Цена</div>
                <div className="text-blue-400 font-semibold">
                  {drop.price_ton} TON
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Участники</div>
                <div className="text-white font-semibold">
                  {drop.participants_count}
                  {drop.max_participants && ` / ${drop.max_participants}`}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                drop.status === 'active' ? 'bg-green-500/20 text-green-400' :
                drop.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {drop.status === 'active' ? 'Активен' :
                 drop.status === 'upcoming' ? 'Скоро' : 'Завершен'}
              </span>
              
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                Участвовать
              </button>
            </div>
          </div>
        ))}
      </div>

      {drops.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-xl font-semibold mb-2">Дропы не найдены</h3>
          <p className="text-gray-400">Скоро появятся новые эксклюзивные дропы</p>
        </div>
      )}
    </div>
  );
};

export default Drops;
