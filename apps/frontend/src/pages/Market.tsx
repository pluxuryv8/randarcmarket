import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { marketService, MarketFilters as MarketFiltersType, Item } from '../services/market';
import MarketFilters from '../components/MarketFilters';

const Marketplace: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<MarketFiltersType>({
    limit: 24,
    sort: 'price',
    order: 'desc'
  });

  // Синхронизация с URL
  useEffect(() => {
    const urlFilters = marketService.buildFiltersFromURL(searchParams);
    setFilters(prev => ({ ...prev, ...urlFilters }));
  }, [searchParams]);

  // Обновление URL при изменении фильтров
  const updateURL = useCallback((newFilters: MarketFiltersType) => {
    const params = marketService.buildURLFromFilters(newFilters);
    setSearchParams(params);
  }, [setSearchParams]);

  // Обработка изменения фильтров
  const handleFiltersChange = useCallback((newFilters: MarketFiltersType) => {
    setFilters(newFilters);
    updateURL(newFilters);
    setItems([]);
    setHasMore(true);
  }, [updateURL]);

  // Загрузка данных
  const loadItems = useCallback(async (reset = false) => {
    if (reset) {
      setIsLoading(true);
      setItems([]);
      setHasMore(true);
    }

    setLoadingError(null);
    
    try {
      console.log('🔄 Загрузка данных с фильтрами:', filters);
      
      const response = await marketService.getItems(filters);
      
      console.log('✅ Загружено товаров:', response.items.length, 'из', response.total);
      
      if (reset) {
        setItems(response.items);
      } else {
        setItems(prev => [...prev, ...response.items]);
      }
      
      setTotalItems(response.total);
      setHasMore(response.items.length === filters.limit && response.cursor);
      
    } catch (error) {
      console.error('❌ Ошибка загрузки данных:', error);
      setLoadingError('Не удалось загрузить данные. Попробуйте обновить страницу.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Первоначальная загрузка
  useEffect(() => {
    loadItems(true);
  }, [loadItems]);

  // Загрузка следующей страницы
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextFilters = { ...filters, cursor: items[items.length - 1]?.address };
      setFilters(nextFilters);
    }
  }, [isLoading, hasMore, filters, items]);

  // Debounced поиск
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== undefined) {
        loadItems(true);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [filters.search, loadItems]);

  return (
    <div className="marketplace max-w-7xl mx-auto px-4 py-8">
      <div className="header mb-8">
        <h1 className="text-4xl font-bold mb-2 text-text-100">RANDAR MARKETPLACE</h1>
        <p className="text-text-300">Telegram Gifts: {totalItems}</p>
      </div>
      
      <div className="flex gap-8">
        {/* Сайдбар с фильтрами */}
        <div className="w-80 flex-shrink-0">
          <MarketFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Основной контент */}
        <div className="flex-1">
          {isLoading && items.length === 0 && (
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
              <h3 className="text-xl font-semibold mb-2 text-text-100">Ошибка загрузки</h3>
              <p className="text-text-300 mb-4">{loadingError}</p>
              <button onClick={() => loadItems(true)} className="btn-primary">
                Попробовать снова
              </button>
            </div>
          )}

          {!isLoading && !loadingError && items.length > 0 && (
            <>
              <div className="items-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.address} className="card p-4 hover:shadow-medium transition-shadow">
                    <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x300/1f2632/666?text=No+Image';
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-text-100 truncate">{item.title}</h3>
                    {item.price && (
                      <p className="text-accent-red font-semibold mb-1">{item.price} TON</p>
                    )}
                    {item.rarity && (
                      <p className="text-text-300 text-sm mb-1">Редкость: {item.rarity}</p>
                    )}
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

              {/* Кнопка "Загрузить еще" */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="btn-primary px-8 py-3"
                  >
                    {isLoading ? 'Загрузка...' : 'Загрузить еще'}
                  </button>
                </div>
              )}
            </>
          )}

          {!isLoading && !loadingError && items.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-text-100">Telegram Gifts не найдены</h3>
              <p className="text-text-300">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;