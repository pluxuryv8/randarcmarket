import React, { useState, useEffect } from 'react';
import { marketApi } from '../services/api';

interface MarketItem {
  address: string;
  title: string;
  image: string;
  price?: number;
  isForSale: boolean;
  traits: Record<string, string>;
  collectionId: string;
  rarity?: number;
  lastSale?: number;
  owner?: string;
}

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Загрузка данных из API
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      setLoadingError(null);
      
      try {
        console.log('🔄 Загрузка данных из API...');
        
        const response = await marketApi.getItems({ 
          forSale: true, 
          limit: 24 
        });
        
        if (response.data.success) {
          console.log('✅ Загружено товаров:', response.data.data.items.length);
          setItems(response.data.data.items);
          setFilteredItems(response.data.data.items);
        } else {
          throw new Error(response.data.error || 'Ошибка загрузки данных');
        }
        
      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        setLoadingError('Не удалось загрузить данные. Попробуйте обновить страницу.');
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  // Фильтрация по поиску
  useEffect(() => {
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchQuery]);

  return (
    <div className="marketplace max-w-7xl mx-auto px-4 py-8">
      <div className="header mb-8">
        <h1 className="text-4xl font-bold mb-2">RANDAR MARKETPLACE</h1>
        <p className="text-text-300">Telegram Gifts: {filteredItems.length}</p>
      </div>
      
      <div className="search mb-6">
        <input
          type="text"
          placeholder="Поиск Telegram Gifts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field w-full max-w-md"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
            <p className="text-text-300">Загрузка данных...</p>
          </div>
        </div>
      )}

      {loadingError && !isLoading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold mb-2">Ошибка загрузки</h3>
          <p className="text-text-300 mb-4">{loadingError}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Попробовать снова
          </button>
        </div>
      )}

      {!isLoading && !loadingError && (
        <div className="items-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.address} className="card p-4">
              <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text-100">{item.title}</h3>
              {item.price && <p className="text-accent-red font-semibold mb-1">{item.price} TON</p>}
              {item.rarity && <p className="text-text-300 text-sm mb-1">Редкость: {item.rarity}</p>}
              <p className="text-text-300 text-sm mb-3">
                {item.isForSale ? 'В продаже' : 'Не продается'}
              </p>
              {item.owner && (
                <p className="text-text-300 text-xs mb-3">
                  Владелец: {item.owner.slice(0, 6)}...{item.owner.slice(-4)}
                </p>
              )}
              <button className="btn-primary w-full">Подробнее</button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !loadingError && filteredItems.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Telegram Gifts не найдены</h3>
          <p className="text-text-300">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;