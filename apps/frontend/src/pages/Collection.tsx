import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { giftsApi } from '../services/giftsLocal';
import { GiftCollection as CollectionType, GiftItem as Item } from '../types/domain';
import { GiftCard } from '../components/GiftCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Chip } from '../components/ui/Chip';
import { useQueryState, useArrayQueryState, useNumberQueryState, useBooleanQueryState } from '../lib/useQueryState';

const CollectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // URL состояние
  const [search, setSearch] = useQueryState('search', '');
  const [forSale, setForSale] = useBooleanQueryState('forSale', true);
  const [minPrice, setMinPrice] = useNumberQueryState('minPrice', 0);
  const [maxPrice, setMaxPrice] = useNumberQueryState('maxPrice', 0);
  const [sort, setSort] = useQueryState('sort', 'price');
  const [order, setOrder] = useQueryState('order', 'desc');
  const [selectedTraits, setSelectedTraits] = useArrayQueryState('traits', []);

  // Состояние
  const [collection, setCollection] = useState<CollectionType | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  // Загрузка данных коллекции
  useEffect(() => {
    const loadCollection = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        const data = await giftsApi.getCollectionById(id);
        setCollection(data);
      } catch (error) {
        console.error('Error loading collection:', error);
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
        const params = {
          collectionId: id,
          forSale: forSale,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          traits: selectedTraits.length > 0 ? { 'Rarity': selectedTraits } : undefined,
          search: search || undefined,
          sort: sort as any,
          order: order as 'asc' | 'desc',
          limit: 24,
          cursor: null
        };
        
        const response = await giftsApi.getItems(params);
        setItems(response.items);
        setHasMore(!!response.nextCursor);
        setCursor(response.nextCursor || null);
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };

    loadItems();
  }, [id, forSale, minPrice, maxPrice, selectedTraits, search, sort, order]);

  // Загрузка дополнительных предметов
  const loadMore = async () => {
    if (!cursor || isLoading || !id) return;
    
    try {
      const params = {
        collectionId: id,
        forSale: forSale,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        traits: selectedTraits.length > 0 ? { 'Rarity': selectedTraits } : undefined,
        search: search || undefined,
        sort: sort as any,
        order: order as 'asc' | 'desc',
        limit: 24,
        cursor: cursor
      };
      
      const response = await giftsApi.getItems(params);
      setItems(prev => [...prev, ...response.items]);
      setHasMore(!!response.nextCursor);
      setCursor(response.nextCursor || null);
    } catch (error) {
      console.error('Error loading more items:', error);
    }
  };

  // Очистка фильтров
  const clearFilters = () => {
    setSearch('');
    setForSale(true);
    setMinPrice(0);
    setMaxPrice(0);
    setSelectedTraits([]);
    setSort('price');
    setOrder('desc');
  };

  // Обработка трейтов
  const handleTraitToggle = (trait: string) => {
    setSelectedTraits((prev: string[]) => 
      prev.includes(trait) 
        ? prev.filter((t: string) => t !== trait)
        : [...prev, trait]
    );
  };

  const removeTrait = (trait: string) => {
    setSelectedTraits((prev: string[]) => prev.filter((t: string) => t !== trait));
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-900 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
          <p className="text-text-300">Загрузка коллекции...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-bg-900 flex justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold mb-2 text-text-100">Коллекция не найдена</h3>
          <p className="text-text-300 mb-4">Попробуйте проверить URL</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Хедер коллекции */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden">
              <img 
                src={collection.cover} 
                alt={collection.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/96x96/1f2632/666?text=No+Image';
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-100 mb-2">{collection.title}</h1>
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
              {(search || selectedTraits.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {search && (
                    <Chip
                      label={`Поиск: ${search}`}
                      onRemove={() => setSearch('')}
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
            {items.length > 0 ? (
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

export default CollectionPage;


