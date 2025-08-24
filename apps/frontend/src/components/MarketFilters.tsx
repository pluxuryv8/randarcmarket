import React, { useState, useEffect } from 'react';
import { MarketFilters as MarketFiltersType, marketService, Collection, TraitBucket } from '../services/market';

interface MarketFiltersProps {
  filters: MarketFiltersType;
  onFiltersChange: (filters: MarketFiltersType) => void;
  collectionId?: string;
}

const MarketFilters: React.FC<MarketFiltersProps> = ({ filters, onFiltersChange, collectionId }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [traits, setTraits] = useState<TraitBucket[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка коллекций
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await marketService.getCollections({ type: 'gifts', limit: 50 });
        setCollections(data);
      } catch (error) {
        console.error('Error loading collections:', error);
      }
    };
    loadCollections();
  }, []);

  // Загрузка трейтов для конкретной коллекции
  useEffect(() => {
    if (collectionId) {
      const loadTraits = async () => {
        setIsLoading(true);
        try {
          const data = await marketService.getCollectionTraits(collectionId);
          setTraits(data);
        } catch (error) {
          console.error('Error loading traits:', error);
          setTraits([]);
        } finally {
          setIsLoading(false);
        }
      };
      loadTraits();
    } else {
      setTraits([]);
    }
  }, [collectionId]);

  const handleFilterChange = (key: keyof MarketFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleTraitChange = (trait: string, value: string, checked: boolean) => {
    const currentTraits = filters.traits || {};
    let newTraits = { ...currentTraits };
    
    if (checked) {
      newTraits[trait] = value;
    } else {
      delete newTraits[trait];
    }
    
    handleFilterChange('traits', Object.keys(newTraits).length > 0 ? newTraits : undefined);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      limit: filters.limit,
      cursor: filters.cursor
    });
  };

  const hasActiveFilters = () => {
    return filters.collectionId || 
           filters.forSale !== undefined || 
           filters.minPrice !== undefined || 
           filters.maxPrice !== undefined || 
           (filters.traits && Object.keys(filters.traits).length > 0) ||
           filters.search;
  };

  return (
    <div className="market-filters bg-surface-800 rounded-xl p-6 border border-line-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-100">Фильтры</h3>
        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-accent-red hover:text-accent-red-2 transition-colors"
          >
            Очистить все
          </button>
        )}
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-300 mb-2">
          Поиск
        </label>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
          className="input-field w-full"
        />
      </div>

      {/* Коллекция */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-300 mb-2">
          Коллекция
        </label>
        <select
          value={filters.collectionId || ''}
          onChange={(e) => handleFilterChange('collectionId', e.target.value || undefined)}
          className="input-field w-full"
          aria-label="Выберите коллекцию"
        >
          <option value="">Все коллекции</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.title}
            </option>
          ))}
        </select>
      </div>

      {/* Статус продажи */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-300 mb-2">
          Статус
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.forSale === true}
              onChange={(e) => handleFilterChange('forSale', e.target.checked ? true : undefined)}
              className="mr-2"
            />
            <span className="text-text-100">В продаже</span>
          </label>
        </div>
      </div>

      {/* Цена */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-300 mb-2">
          Цена (TON)
        </label>
        <div className="space-y-3">
          <div>
            <input
              type="number"
              placeholder="От"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="input-field w-full"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="До"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="input-field w-full"
            />
          </div>
        </div>
      </div>

      {/* Сортировка */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-300 mb-2">
          Сортировка
        </label>
        <select
          value={`${filters.sort || 'price'}-${filters.order || 'desc'}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            handleFilterChange('sort', sort);
            handleFilterChange('order', order);
          }}
          className="input-field w-full"
          aria-label="Выберите сортировку"
        >
          <option value="price-desc">Цена (высокая → низкая)</option>
          <option value="price-asc">Цена (низкая → высокая)</option>
          <option value="recently_listed-desc">Недавно выставленные</option>
          <option value="recently_sold-desc">Недавно проданные</option>
          <option value="volume_24h-desc">Объем 24ч</option>
        </select>
      </div>

      {/* Трейты */}
      {collectionId && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-300 mb-2">
            Атрибуты
          </label>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-red mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {traits.map((trait) => (
                <div key={`${trait.trait}-${trait.value}`} className="border-b border-line-700 pb-2">
                  <div className="text-sm font-medium text-text-100 mb-1">
                    {trait.trait}
                  </div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-text-300">{trait.value}</span>
                    <div className="flex items-center">
                      <span className="text-xs text-text-300 mr-2">({trait.count})</span>
                      <input
                        type="checkbox"
                        checked={filters.traits?.[trait.trait] === trait.value}
                        onChange={(e) => handleTraitChange(trait.trait, trait.value, e.target.checked)}
                        className="ml-2"
                      />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Активные фильтры */}
      {hasActiveFilters() && (
        <div className="mt-6 pt-4 border-t border-line-700">
          <h4 className="text-sm font-medium text-text-300 mb-3">Активные фильтры:</h4>
          <div className="space-y-2">
            {filters.collectionId && (
              <div className="flex items-center justify-between bg-bg-800 rounded px-2 py-1">
                <span className="text-xs text-text-100">Коллекция</span>
                <button
                  onClick={() => handleFilterChange('collectionId', undefined)}
                  className="text-xs text-accent-red hover:text-accent-red-2"
                >
                  ✕
                </button>
              </div>
            )}
            {filters.forSale && (
              <div className="flex items-center justify-between bg-bg-800 rounded px-2 py-1">
                <span className="text-xs text-text-100">В продаже</span>
                <button
                  onClick={() => handleFilterChange('forSale', undefined)}
                  className="text-xs text-accent-red hover:text-accent-red-2"
                >
                  ✕
                </button>
              </div>
            )}
            {filters.traits && Object.entries(filters.traits).map(([trait, value]) => (
              <div key={trait} className="flex items-center justify-between bg-bg-800 rounded px-2 py-1">
                <span className="text-xs text-text-100">{trait}: {value}</span>
                <button
                  onClick={() => handleTraitChange(trait, value, false)}
                  className="text-xs text-accent-red hover:text-accent-red-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketFilters;
