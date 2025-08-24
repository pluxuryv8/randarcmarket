import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { marketService, Collection as CollectionType, Item, MarketFilters as MarketFiltersType } from '../services/market';
import MarketFilters from '../components/MarketFilters';

const CollectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<CollectionType | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketFiltersType>({
    collectionId: id,
    limit: 24,
    sort: 'price',
    order: 'desc'
  });

  // Загрузка данных коллекции
  useEffect(() => {
    const loadCollection = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setLoadingError(null);
      
      try {
        const data = await marketService.getCollectionById(id);
        setCollection(data);
      } catch (error) {
        console.error('Error loading collection:', error);
        setLoadingError('Коллекция не найдена');
      } finally {
        setIsLoading(false);
      }
    };

    loadCollection();
  }, [id]);

  // Загрузка предметов коллекции
  useEffect(() => {
    const loadItems = async () => {
      if (!id) return;
      
      try {
        const response = await marketService.getItems({ ...filters, collectionId: id });
        setItems(response.items);
        setTotalItems(response.total);
      } catch (error) {
        console.error('Error loading items:', error);
        setLoadingError('Не удалось загрузить предметы');
      }
    };

    loadItems();
  }, [filters, id]);

  const handleFiltersChange = (newFilters: MarketFiltersType) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
          <p className="text-text-300">Загрузка коллекции...</p>
        </div>
      </div>
    );
  }

  if (loadingError || !collection) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2 text-text-100">Ошибка загрузки</h3>
        <p className="text-text-300 mb-4">{loadingError || 'Коллекция не найдена'}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="collection-page max-w-7xl mx-auto px-4 py-8">
      {/* Хедер коллекции */}
      <div className="collection-header mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-xl overflow-hidden">
            <img 
              src={collection.image} 
              alt={collection.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/96x96/1f2632/666?text=No+Image';
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-100 mb-2">{collection.title}</h1>
            {collection.description && (
              <p className="text-text-300 max-w-2xl">{collection.description}</p>
            )}
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-800 rounded-lg p-4 border border-line-700">
            <div className="text-sm text-text-300 mb-1">Floor Price</div>
            <div className="text-xl font-semibold text-accent-red">{collection.floor} TON</div>
          </div>
          <div className="bg-surface-800 rounded-lg p-4 border border-line-700">
            <div className="text-sm text-text-300 mb-1">Volume 24h</div>
            <div className="text-xl font-semibold text-text-100">{collection.volume24h} TON</div>
          </div>
          <div className="bg-surface-800 rounded-lg p-4 border border-line-700">
            <div className="text-sm text-text-300 mb-1">Supply</div>
            <div className="text-xl font-semibold text-text-100">{collection.supply}</div>
          </div>
          <div className="bg-surface-800 rounded-lg p-4 border border-line-700">
            <div className="text-sm text-text-300 mb-1">Owners</div>
            <div className="text-xl font-semibold text-text-100">{collection.owners}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Сайдбар с фильтрами */}
        <div className="w-80 flex-shrink-0">
          <MarketFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            collectionId={id}
          />
        </div>

        {/* Основной контент */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-100">
              Предметы ({totalItems})
            </h2>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-text-100">Предметы не найдены</h3>
              <p className="text-text-300">Попробуйте изменить параметры фильтрации</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;


