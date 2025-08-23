import React, { useState, useEffect, useRef } from 'react';



interface MarketItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  condition: 'factory-new' | 'minimal-wear' | 'field-tested' | 'well-worn' | 'battle-scarred';
  seller: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  category: string;
  views: number;
  likes: number;
  isHot: boolean;
  discount?: number;
  tags: string[];
  float?: number;
  stickers?: string[];
  market_hash_name?: string;
  collection?: string;
}

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Загрузка мок данных
  useEffect(() => {
    const loadMockItems = async () => {
      setIsLoading(true);
      setLoadingError(null);
      
      try {
        console.log('🔄 Загрузка мок данных...');
        
        // Мок данные для маркетплейса
        const mockItems: MarketItem[] = [
          {
            id: 'mock_1',
            name: 'AK-47 | Redline',
            price: 750,
            originalPrice: 890,
            image: 'https://via.placeholder.com/330x192/DC2626/FFFFFF?text=AK-47+Redline',
            rarity: 'epic',
            condition: 'minimal-wear',
            seller: { name: 'ProTrader', avatar: '', rating: 4.9, verified: true },
            category: 'rifles',
            views: 1250,
            likes: 89,
            isHot: true,
            discount: 16,
            tags: ['популярное', 'редкое'],
            float: 0.12,
            market_hash_name: 'AK-47 | Redline (Minimal Wear)'
          },
          {
            id: 'mock_2',
            name: 'M4A4 | Howl',
            price: 2500,
            image: 'https://via.placeholder.com/330x192/FFD700/FFFFFF?text=M4A4+Howl',
            rarity: 'legendary',
            condition: 'factory-new',
            seller: { name: 'SkinKing', avatar: '', rating: 4.8, verified: true },
            category: 'rifles',
            views: 3200,
            likes: 156,
            isHot: true,
            tags: ['легендарное', 'коллекционное'],
            float: 0.01,
            market_hash_name: 'M4A4 | Howl (Factory New)'
          }
        ];
        
        console.log('✅ Загружено мок товаров:', mockItems.length);
        setItems(mockItems);
        setFilteredItems(mockItems);
        
      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        setLoadingError('Не удалось загрузить данные. Попробуйте обновить страницу.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMockItems();
  }, []);

  // Простая фильтрация по поиску
  useEffect(() => {
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchQuery]);

  return (
    <div className="marketplace">
      <div className="header">
        <h1>RANDAR MARKETPLACE</h1>
        <p>Товаров: {filteredItems.length}</p>
      </div>
      
      <div className="search">
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="loading">
          <p>Загрузка данных...</p>
        </div>
      )}

      {loadingError && !isLoading && (
        <div className="error">
          <h3>Ошибка загрузки</h3>
          <p>{loadingError}</p>
          <button onClick={() => window.location.reload()}>
            Попробовать снова
          </button>
        </div>
      )}

      {!isLoading && !loadingError && (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>Цена: ₽{item.price.toLocaleString()}</p>
              <p>Редкость: {item.rarity}</p>
              <p>Состояние: {item.condition}</p>
              <p>Продавец: {item.seller.name}</p>
              <button>Добавить в корзину</button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !loadingError && filteredItems.length === 0 && (
        <div className="no-items">
          <h3>Товары не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;