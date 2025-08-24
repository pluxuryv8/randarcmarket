import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { marketApi } from '../services/market';
import { giftsApi } from '../services/giftsLocal';
import { GiftItem, GiftCollection } from '../types/domain';
import canonicalCollections from '../mock/gift_collections.canonical.json';
import { GiftCard } from '../components/GiftCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Chip } from '../components/ui/Chip';
import { useQueryState, useArrayQueryState, useNumberQueryState, useBooleanQueryState } from '../lib/useQueryState';

const MarketPage: React.FC = () => {
  // URL состояние
  const [search, setSearch] = useQueryState('search', '');
  const [collectionId, setCollectionId] = useQueryState('collection', '');
  const [forSale, setForSale] = useBooleanQueryState('forSale', true);
  const [minPrice, setMinPrice] = useNumberQueryState('minPrice', 0);
  const [maxPrice, setMaxPrice] = useNumberQueryState('maxPrice', 0);
  const [sort, setSort] = useQueryState('sort', 'price');
  const [order, setOrder] = useQueryState('order', 'desc');
  const [selectedTraits, setSelectedTraits] = useArrayQueryState('traits', []);

  // Состояние
  const [items, setItems] = useState<GiftItem[]>([]);
  const [collections, setCollections] = useState<GiftCollection[]>([]);
  const [collectionsStats, setCollectionsStats] = useState<{
    totalCollections: number;
    totalItems: number;
  }>({ totalCollections: 0, totalItems: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  // Стабильные параметры для useEffect
  const traitsKey = useMemo(() => JSON.stringify(selectedTraits), [selectedTraits]);
  
  const params = useMemo(() => ({
    collectionId: collectionId || undefined,
    forSale: forSale,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sort: sort as any,
    order: order as 'asc' | 'desc',
    traitsKey
  }), [collectionId, forSale, minPrice, maxPrice, sort, order, traitsKey]);

  // Загрузка коллекций
  useEffect(() => {
    const loadCollections = async () => {
      setIsLoadingCollections(true);
      try {
        // Пробуем загрузить из нового API
        const result = await marketApi.getCollections();
        if (result.collections && result.collections.length > 0) {
          setCollections(result.collections);
          setCollectionsStats({
            totalCollections: result.totalCollections,
            totalItems: result.totalItems
          });
        } else {
          throw new Error('No collections from API');
        }
      } catch (error) {
        console.log('Using local fallback for collections');
        // Fallback: используем локальный API
        try {
          const result = await giftsApi.getCollections();
          setCollections(result.collections);
          setCollectionsStats({
            totalCollections: result.totalItems,
            totalItems: result.totalItems
          });
        } catch (fallbackError) {
          // Final fallback: создаем коллекции из канонического списка
          const fallbackCollections = canonicalCollections.map((title) => ({
            id: title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
            title,
            supply: undefined
          }));
          setCollections(fallbackCollections);
          setCollectionsStats({
            totalCollections: canonicalCollections.length,
            totalItems: 0
          });
        }
      } finally {
        setIsLoadingCollections(false);
      }
    };
    loadCollections();
  }, []);

  // Загрузка предметов
  useEffect(() => {
    let alive = true;
    
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const requestParams = {
          collectionId: params.collectionId,
          forSale: params.forSale,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          traits: selectedTraits.length > 0 ? { 'Rarity': selectedTraits } : undefined,
          search: search || undefined,
          sort: params.sort,
          order: params.order,
          limit: 24,
          cursor: null
        };
        
        // Пробуем загрузить из нового API
        const response = await marketApi.getItems(requestParams);
        if (response.items && response.items.length > 0) {
          if (alive) {
            setItems(response.items);
            setHasMore(!!response.nextCursor);
            setCursor(response.nextCursor || null);
          }
        } else {
          throw new Error('No items from API');
        }
      } catch (error) {
        console.log('Using local fallback for items');
        // Fallback: используем локальный API
        try {
          const response = await giftsApi.getItems({
            collectionId: params.collectionId,
            forSale: params.forSale,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            traits: selectedTraits.length > 0 ? { 'Rarity': selectedTraits } : undefined,
            search: search || undefined,
            sort: params.sort,
            order: params.order,
            limit: 24,
            cursor: null
          });
          if (alive) {
            setItems(response.items);
            setHasMore(!!response.nextCursor);
            setCursor(response.nextCursor || null);
          }
        } catch (fallbackError) {
          if (alive) {
            setItems([]);
            setHasMore(false);
          }
        }
      } finally {
        if (alive) {
          setIsLoading(false);
        }
      }
    };
    
    loadItems();
    
    return () => {
      alive = false;
    };
  }, [params.collectionId, params.forSale, params.minPrice, params.maxPrice, params.sort, params.order, params.traitsKey, search]);

  // Загрузка дополнительных предметов
  const loadMore = async () => {
    if (!cursor || isLoading) return;
    
    try {
      const requestParams = {
        collectionId: params.collectionId,
        forSale: params.forSale,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        traits: selectedTraits.length > 0 ? { 'Rarity': selectedTraits } : undefined,
        search: search || undefined,
        sort: params.sort,
        order: params.order,
        limit: 24,
        cursor: cursor
      };
      
      // Пробуем загрузить из нового API
      const response = await marketApi.getItems(requestParams);
      if (response.items && response.items.length > 0) {
        setItems(prev => [...prev, ...response.items]);
        setHasMore(!!response.nextCursor);
        setCursor(response.nextCursor || null);
      } else {
        throw new Error('No items from API');
      }
    } catch (error) {
      console.log('Using local fallback for loadMore');
      // Fallback: используем локальный API
      try {
        const response = await giftsApi.getItems({
          collectionId: params.collectionId,
          forSale: params.forSale,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          traits: selectedTraits.length > 0 ? { 'Rarity': selectedTraits } : undefined,
          search: search || undefined,
          sort: params.sort,
          order: params.order,
          limit: 24,
          cursor: cursor
        });
        setItems(prev => [...prev, ...response.items]);
        setHasMore(!!response.nextCursor);
        setCursor(response.nextCursor || null);
      } catch (fallbackError) {
        // Игнорируем ошибки при загрузке дополнительных предметов
      }
    }
  };

  // Очистка фильтров
  const clearFilters = () => {
    setSearch('');
    setCollectionId('');
    setForSale(true);
    setMinPrice(0);
    setMaxPrice(0);
    setSelectedTraits([]);
    setSort('price');
    setOrder('desc');
  };

  // Обработка трейтов
  const handleTraitToggle = (trait: string) => {
    const newTraits = selectedTraits.includes(trait) 
      ? selectedTraits.filter((t: string) => t !== trait)
      : [...selectedTraits, trait];
    setSelectedTraits(newTraits);
  };

  const removeTrait = (trait: string) => {
    const newTraits = selectedTraits.filter((t: string) => t !== trait);
    setSelectedTraits(newTraits);
  };

  const sortOptions = [
    { value: 'price', label: 'Цена' },
    { value: 'listed_at', label: 'Недавно выставлены' },
    { value: 'sold_at', label: 'Недавно проданы' },
    { value: 'volume_24h', label: 'Объем 24ч' }
  ];

  const orderOptions = [
    { value: 'desc', label: 'По убыванию' },
    { value: 'asc', label: 'По возрастанию' }
  ];

  return (
    <div className="min-h-screen bg-bg-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Статистика */}
        <div className="mb-6 p-4 bg-surface-800 rounded-lg border border-line-700">
          <p className="text-text-300">
            Коллекций отрисовано: <span className="text-text-100 font-semibold">{collectionsStats.totalCollections}</span> | 
            All Collections: <span className="text-text-100 font-semibold">{collectionsStats.totalItems.toLocaleString()}</span>
          </p>
        </div>
        
        <div className="flex gap-8">
          {/* Сайдбар фильтров */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-surface-800 rounded-lg p-6 border border-line-700">
              <h2 className="text-xl font-semibold text-text-100 mb-6">Фильтры</h2>
              
              {/* Поиск */}
              <div className="mb-6">
                <Input
                  label="Поиск"
                  placeholder="Название предмета..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Коллекция */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-300">Collection</h3>
                  <span className="text-xs text-text-300">{collectionsStats.totalCollections}</span>
                </div>
                
                {/* All Collections */}
                <div 
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    !collectionId ? 'bg-accent-red/20 text-accent-red' : 'hover:bg-surface-700'
                  }`}
                  onClick={() => setCollectionId('')}
                >
                  <span className="text-sm font-medium">All Collections</span>
                  <span className="text-sm text-text-300">
                    {collectionsStats.totalItems.toLocaleString()}
                  </span>
                </div>
                
                {/* Список коллекций */}
                <div className="max-h-64 overflow-y-auto space-y-1 mt-2">
                  {isLoadingCollections ? (
                    <div className="space-y-2">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-2">
                          <div className="h-4 bg-surface-700 rounded animate-pulse flex-1 mr-2"></div>
                          <div className="h-4 bg-surface-700 rounded w-8 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    collections.map((collection) => (
                      <div
                        key={collection.id}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          collectionId === collection.id ? 'bg-accent-red/20 text-accent-red' : 'hover:bg-surface-700'
                        }`}
                        onClick={() => setCollectionId(collection.id)}
                      >
                        <span className="text-sm truncate flex-1">{collection.title}</span>
                        <span className="text-sm text-text-300 ml-2 min-w-[3rem] text-right">
                          {collection.supply ? collection.supply.toLocaleString() : '—'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Статус продажи */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={forSale}
                    onChange={(e) => setForSale(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-text-100">Только в продаже</span>
                </label>
              </div>

              {/* Ценовой диапазон */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-text-300 mb-3">Цена (TON)</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="От"
                    type="number"
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    placeholder="До"
                    type="number"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Трейты */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-text-300 mb-3">Редкость</h3>
                <div className="space-y-2">
                  {['Common', 'Rare', 'Legendary'].map((trait) => (
                    <Chip
                      key={trait}
                      label={trait}
                      active={selectedTraits.includes(trait)}
                      onClick={() => handleTraitToggle(trait)}
                    />
                  ))}
                </div>
              </div>

              {/* Очистить фильтры */}
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                Очистить все
              </Button>
            </div>
          </div>

          {/* Основной контент */}
          <div className="flex-1">
            {/* Тулбар */}
            <div className="bg-surface-800 rounded-lg p-4 border border-line-700 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Select
                    options={sortOptions}
                    value={sort}
                    onChange={setSort}
                  />
                  <Select
                    options={orderOptions}
                    value={order}
                    onChange={setOrder}
                  />
                </div>
                <span className="text-text-300">
                  {items.length} предметов
                </span>
              </div>

              {/* Активные фильтры */}
              {(search || collectionId || selectedTraits.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {search && (
                    <Chip
                      label={`Поиск: ${search}`}
                      onRemove={() => setSearch('')}
                    />
                  )}
                  {collectionId && (
                    <Chip
                      label={`Коллекция: ${collections.find(c => c.id === collectionId)?.title}`}
                      onRemove={() => setCollectionId('')}
                    />
                  )}
                  {selectedTraits.map(trait => (
                    <Chip
                      key={trait}
                      label={`Редкость: ${trait}`}
                      onRemove={() => removeTrait(trait)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Сетка предметов */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="aspect-square bg-surface-800 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-surface-800 rounded"></div>
                      <div className="h-6 bg-surface-800 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <GiftCard key={item.id} item={item} />
                  ))}
                </div>
                
                {hasMore && (
                  <div className="text-center mt-8">
                    <Button onClick={loadMore} disabled={isLoading}>
                      Загрузить еще
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2 text-text-100">
                  Предметы не найдены
                </h3>
                <p className="text-text-300 mb-4">
                  Попробуйте изменить параметры фильтрации
                </p>
                <Button onClick={clearFilters}>
                  Очистить фильтры
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;