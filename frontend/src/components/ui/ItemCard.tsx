import React from 'react';
import {
  Card, CardContent, CardMedia, Chip, IconButton,
  Typography, Button
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatPrice, getRarityColor, getWearColor } from '../../utils/helpers';
import { Item } from '../../types';

interface ItemCardProps {
  item: Item;
  index: number;
  onView?: (item: Item) => void;
  onSell?: (item: Item) => void;
  onTrade?: (item: Item) => void;
  viewMode?: 'grid' | 'list';
}

// Функция для создания fallback изображения (если понадобится)
const createFallbackImage = (weaponName: string) => {
  const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="200" fill="#333"/>
    <text x="150" y="100" font-family="Arial" font-size="16" fill="#666" text-anchor="middle" dy=".3em">${weaponName}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export default function ItemCard({ item, index, onView, onSell, onTrade, viewMode = 'grid' }: ItemCardProps) {
  const priceDifference = item.steamPrice - item.marketPrice;
  const isPriceUp = item.steamPrice < item.marketPrice;

  if (viewMode === 'list') {
    return (
      <Card
        className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:scale-102 transition-all duration-300 animate-fadeInUp"
        style={{ animationDelay: `${index * 0.1}s` }}
        sx={{
          '&:hover': {
            boxShadow: '0 20px 40px rgba(139, 0, 0, 0.3)',
            borderColor: 'rgba(139, 0, 0, 0.5)',
          },
        }}
      >
        <div className="flex">
          <div className="relative w-48 h-32 flex-shrink-0">
            <CardMedia
              component="img"
              height="128"
              width="192"
              image={item.imageUrl}
              alt={item.name}
              sx={{ objectFit: 'cover' }}
              onError={(e) => {
                const target = e.currentTarget;
                console.log(`Failed to load image: ${target.src}`);
                
                if (target.src.includes('data:image/svg+xml')) {
                  // Если уже placeholder, показываем дефолтное изображение с названием оружия
                  const weaponName = item.weapon || 'Weapon';
                  target.src = createFallbackImage(weaponName);
                } else {
                  // Пробуем альтернативные URL
                  const currentSrc = target.src;
                  if (currentSrc.includes('_light_large.png')) {
                    target.src = currentSrc.replace('_light_large.png', '_light.png');
                  } else if (currentSrc.includes('_light.png')) {
                    const weaponName = item.weapon || 'Weapon';
                    target.src = createFallbackImage(weaponName);
                  }
                }
              }}
            />
            
            {/* Wear Chip */}
            <div className="absolute top-2 left-2">
              <Chip
                label={item.wear}
                size="small"
                sx={{
                  backgroundColor: getWearColor(item.wear || ''),
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                }}
              />
            </div>
            
            {/* Float Chip */}
            <div className="absolute bottom-2 left-2">
              <Chip
                label={`Float: ${item.float.toFixed(3)}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                }}
              />
            </div>
          </div>
          
          <CardContent sx={{ p: 3, flex: 1 }}>
            <div className="flex items-start justify-between mb-3">
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                }}
              >
                {item.name}
              </Typography>
              <div className="flex items-center gap-2">
                <StarIcon
                  sx={{
                    color: getRarityColor(item.rarity || ''),
                    fontSize: '1.2rem',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => onView?.(item)}
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'rgba(139,0,0,0.8)',
                    },
                  }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-gray-400 text-sm">Steam</div>
                <div className="text-green-400 font-bold text-lg">
                  {formatPrice(item.steamPrice)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">Market</div>
                <div className="text-blue-400 font-bold text-lg">
                  {formatPrice(item.marketPrice)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">Разница</div>
                <div className="flex items-center justify-center gap-1">
                  {isPriceUp ? (
                    <TrendingUpIcon sx={{ color: '#27AE60', fontSize: '1rem' }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: '#E74C3C', fontSize: '1rem' }} />
                  )}
                  <span className={`font-bold text-lg ${
                    isPriceUp ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatPrice(Math.abs(priceDifference))}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outlined"
                size="small"
                onClick={() => onSell?.(item)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  '&:hover': {
                    borderColor: '#8B0000',
                    backgroundColor: 'rgba(139,0,0,0.1)',
                  },
                }}
              >
                Продать
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => onTrade?.(item)}
                sx={{
                  backgroundColor: '#8B0000',
                  '&:hover': {
                    backgroundColor: '#6B0000',
                  },
                }}
              >
                Торговать
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 animate-fadeInUp"
      style={{ animationDelay: `${index * 0.1}s` }}
      sx={{
        '&:hover': {
          boxShadow: '0 20px 40px rgba(139, 0, 0, 0.3)',
          borderColor: 'rgba(139, 0, 0, 0.5)',
        },
      }}
    >
      <div className="relative">
        <CardMedia
          component="img"
          height="200"
          image={item.imageUrl}
          alt={item.name}
          sx={{ objectFit: 'cover' }}
          onError={(e) => {
            const target = e.currentTarget;
            console.log(`Failed to load image: ${target.src}`);
            
            if (target.src.includes('data:image/svg+xml')) {
              // Если уже placeholder, показываем дефолтное изображение с названием оружия
              const weaponName = item.weapon || 'Weapon';
              target.src = createFallbackImage(weaponName);
            } else {
              // Пробуем альтернативные URL
              const currentSrc = target.src;
              if (currentSrc.includes('_light_large.png')) {
                target.src = currentSrc.replace('_light_large.png', '_light.png');
              } else if (currentSrc.includes('_light.png')) {
                const weaponName = item.weapon || 'Weapon';
                target.src = createFallbackImage(weaponName);
              }
            }
          }}
        />
        
        {/* Wear Chip */}
        <div className="absolute top-3 left-3">
          <Chip
            label={item.wear}
            size="small"
            sx={{
              backgroundColor: getWearColor(item.wear || ''),
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          />
        </div>
        
        {/* View Button */}
        <div className="absolute top-3 right-3">
          <IconButton
            size="small"
            onClick={() => onView?.(item)}
            sx={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(139,0,0,0.8)',
              },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </div>
        
        {/* Float Chip */}
        <div className="absolute bottom-3 left-3">
          <Chip
            label={`Float: ${item.float.toFixed(3)}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          />
        </div>
      </div>
      
      <CardContent sx={{ p: 3 }}>
        {/* Item Name and Rarity */}
        <div className="flex items-start justify-between mb-3">
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
              lineHeight: 1.2,
            }}
          >
            {item.name}
          </Typography>
          <div className="flex items-center">
            <StarIcon
              sx={{
                color: getRarityColor(item.rarity || ''),
                fontSize: '1.2rem',
              }}
            />
          </div>
        </div>
        
        {/* Price Information */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Steam:</span>
            <span className="text-green-400 font-bold">
              {formatPrice(item.steamPrice)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Market:</span>
            <span className="text-blue-400 font-bold">
              {formatPrice(item.marketPrice)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Разница:</span>
            <div className="flex items-center gap-1">
              {isPriceUp ? (
                <TrendingUpIcon sx={{ color: '#27AE60', fontSize: '1rem' }} />
              ) : (
                <TrendingDownIcon sx={{ color: '#E74C3C', fontSize: '1rem' }} />
              )}
              <span className={`font-bold text-sm ${
                isPriceUp ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPrice(Math.abs(priceDifference))}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => onSell?.(item)}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#fff',
              '&:hover': {
                borderColor: '#8B0000',
                backgroundColor: 'rgba(139,0,0,0.1)',
              },
            }}
          >
            Продать
          </Button>
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={() => onTrade?.(item)}
            sx={{
              backgroundColor: '#8B0000',
              '&:hover': {
                backgroundColor: '#6B0000',
              },
            }}
          >
            Торговать
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 