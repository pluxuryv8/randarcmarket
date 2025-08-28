import React from 'react';
import { Link } from 'react-router-dom';
import { GiftItem } from '../types/domain';

interface GiftCardProps {
  item: GiftItem;
}

const FALLBACK = '/images/nft-fallback.png';

export const GiftCard: React.FC<GiftCardProps> = ({ item }) => {
  const src = item.image ?? FALLBACK;

  return (
    <Link to={`/item/${item.address}`} className="block">
      <div className="card p-4 hover:shadow-medium transition-all duration-200 group">
        {/* Изображение */}
        <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-surface-800">
          <img 
            src={src}
            alt={item.title} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = '1';
                target.src = FALLBACK;
              }
            }}
          />
        </div>
        
        {/* Информация */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-100 truncate group-hover:text-accent-red-2 transition-colors">
            {item.title}
          </h3>
          
          {/* Цена */}
          {item.priceTon && item.forSale ? (
            <p className="text-accent-red font-semibold text-lg">
              {item.priceTon} TON
            </p>
          ) : (
            <p className="text-text-300 text-sm">
              {item.forSale ? 'Цена не указана' : 'Не продается'}
            </p>
          )}
          
          {/* Редкость */}
          {item.rarity && (
            <div className="flex items-center gap-2">
              <span className="text-text-300 text-sm">Редкость:</span>
              <span className={`text-sm font-medium ${
                item.rarity === 'Legendary' ? 'text-yellow-400' :
                item.rarity === 'Rare' ? 'text-blue-400' :
                'text-text-300'
              }`}>
                {item.rarity}
              </span>
            </div>
          )}
          
          {/* Последняя продажа */}
          {item.lastSaleTon && (
            <p className="text-text-300 text-sm">
              Последняя продажа: {item.lastSaleTon} TON
            </p>
          )}
          
          {/* Трейты */}
          {item.traits.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.traits.slice(0, 2).map((trait, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-surface-800 border border-line-700 rounded text-xs text-text-300"
                >
                  {trait.name}: {trait.value}
                </span>
              ))}
              {item.traits.length > 2 && (
                <span className="px-2 py-1 bg-surface-800 border border-line-700 rounded text-xs text-text-300">
                  +{item.traits.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
