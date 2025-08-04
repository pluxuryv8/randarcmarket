import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './Inventory.css';
import {
  Box, Typography, TextField, InputAdornment,
  Button, CircularProgress, Card, CardContent,
  CardMedia, Chip, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Item {
  id: string;
  name: string;
  float: number;
  imageUrl: string;
  steamPrice: number;
  marketPrice: number;
  rarity?: string;
  wear?: string;
}

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Демо-данные с изображениями оружий CS:GO
    const demoWeapons = [
      {
        id: 'ak47-1',
        name: 'AK-47 | Redline',
        float: 0.15,
        imageUrl: 'https://via.placeholder.com/300x200/8B0000/FFFFFF?text=AK-47+Redline',
        steamPrice: 1250.50,
        marketPrice: 1100.00,
        rarity: 'rare',
        wear: 'Field-Tested'
      },
      {
        id: 'm4a4-1',
        name: 'M4A4 | Desolate Space',
        float: 0.08,
        imageUrl: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=M4A4+Desolate',
        steamPrice: 890.75,
        marketPrice: 750.25,
        rarity: 'legendary',
        wear: 'Minimal Wear'
      },
      {
        id: 'awp-1',
        name: 'AWP | Dragon Lore',
        float: 0.02,
        imageUrl: 'https://via.placeholder.com/300x200/FFD700/000000?text=AWP+Dragon+Lore',
        steamPrice: 45000.00,
        marketPrice: 42000.00,
        rarity: 'mythical',
        wear: 'Factory New'
      },
      {
        id: 'glock-1',
        name: 'Glock-18 | Fade',
        float: 0.12,
        imageUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Glock+Fade',
        steamPrice: 3200.00,
        marketPrice: 2800.00,
        rarity: 'epic',
        wear: 'Well-Worn'
      },
      {
        id: 'usp-1',
        name: 'USP-S | Kill Confirmed',
        float: 0.06,
        imageUrl: 'https://via.placeholder.com/300x200/2C3E50/FFFFFF?text=USP-S+Kill+Confirmed',
        steamPrice: 1800.50,
        marketPrice: 1650.00,
        rarity: 'rare',
        wear: 'Minimal Wear'
      },
      {
        id: 'deagle-1',
        name: 'Desert Eagle | Golden Koi',
        float: 0.03,
        imageUrl: 'https://via.placeholder.com/300x200/FFA500/000000?text=Deagle+Golden+Koi',
        steamPrice: 8500.00,
        marketPrice: 7800.00,
        rarity: 'legendary',
        wear: 'Factory New'
      },
      {
        id: 'knife-1',
        name: 'Karambit | Fade',
        float: 0.01,
        imageUrl: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Karambit+Fade',
        steamPrice: 25000.00,
        marketPrice: 23000.00,
        rarity: 'mythical',
        wear: 'Factory New'
      },
      {
        id: 'm4a1s-1',
        name: 'M4A1-S | Hyper Beast',
        float: 0.09,
        imageUrl: 'https://via.placeholder.com/300x200/27AE60/FFFFFF?text=M4A1-S+Hyper+Beast',
        steamPrice: 950.25,
        marketPrice: 820.00,
        rarity: 'epic',
        wear: 'Field-Tested'
      }
    ];

    // Имитируем загрузку данных
    setTimeout(() => {
      setItems(demoWeapons);
      setLoading(false);
    }, 1000);
  }, []);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythical': return '#FFD700';
      case 'legendary': return '#FF6B6B';
      case 'epic': return '#9B59B6';
      case 'rare': return '#3498DB';
      default: return '#95A5A6';
    }
  };

  const getWearColor = (wear: string) => {
    switch (wear) {
      case 'Factory New': return '#27AE60';
      case 'Minimal Wear': return '#F39C12';
      case 'Field-Tested': return '#E67E22';
      case 'Well-Worn': return '#E74C3C';
      case 'Battle-Scarred': return '#8B0000';
      default: return '#95A5A6';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Hero Section */}
        <div className="relative z-10 pt-8 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl animate-fadeInUp">
                Мой Инвентарь
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto drop-shadow-lg animate-fadeInUp delay-200">
                Управляйте своими цифровыми ценностями и отслеживайте их стоимость в реальном времени
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8 animate-fadeInUp delay-300">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <TextField
                    fullWidth
                    placeholder="Поиск оружия..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#888' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#8B0000',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#888',
                        opacity: 1,
                      },
                    }}
                  />
                </div>
                
                <div className="flex gap-2">
                  {['all', 'rare', 'epic', 'legendary', 'mythical'].map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? "contained" : "outlined"}
                      onClick={() => setSelectedFilter(filter)}
                      sx={{
                        backgroundColor: selectedFilter === filter ? '#8B0000' : 'transparent',
                        borderColor: selectedFilter === filter ? '#8B0000' : 'rgba(255,255,255,0.2)',
                        color: selectedFilter === filter ? '#fff' : '#888',
                        '&:hover': {
                          backgroundColor: selectedFilter === filter ? '#6B0000' : 'rgba(255,255,255,0.1)',
                          borderColor: selectedFilter === filter ? '#6B0000' : 'rgba(255,255,255,0.3)',
                        },
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                      }}
                    >
                      {filter === 'all' ? 'Все' : 
                       filter === 'rare' ? 'Редкие' :
                       filter === 'epic' ? 'Эпические' :
                       filter === 'legendary' ? 'Легендарные' : 'Мифические'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center animate-fadeInUp delay-400">
                <div className="text-3xl font-bold text-white mb-2">{filtered.length}</div>
                <div className="text-gray-400 text-sm">Всего предметов</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center animate-fadeInUp delay-500">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {formatPrice(filtered.reduce((sum, item) => sum + item.steamPrice, 0))}
                </div>
                <div className="text-gray-400 text-sm">Общая стоимость Steam</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center animate-fadeInUp delay-600">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {formatPrice(filtered.reduce((sum, item) => sum + item.marketPrice, 0))}
                </div>
                <div className="text-gray-400 text-sm">Общая стоимость Market</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center animate-fadeInUp delay-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {filtered.filter(item => item.rarity === 'mythical').length}
                </div>
                <div className="text-gray-400 text-sm">Мифические предметы</div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="relative z-10 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <CircularProgress sx={{ color: '#8B0000' }} size={60} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((item, index) => (
                  <Card
                    key={item.id}
                    className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: `${800 + index * 100}ms` }}
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
                          e.currentTarget.src = 'https://via.placeholder.com/300x200/333/666?text=Weapon';
                        }}
                      />
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
                      <div className="absolute top-3 right-3">
                        <IconButton
                          size="small"
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
                            {item.steamPrice > item.marketPrice ? (
                              <TrendingDownIcon sx={{ color: '#E74C3C', fontSize: '1rem' }} />
                            ) : (
                              <TrendingUpIcon sx={{ color: '#27AE60', fontSize: '1rem' }} />
                            )}
                            <span className={`font-bold text-sm ${
                              item.steamPrice > item.marketPrice ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {formatPrice(Math.abs(item.steamPrice - item.marketPrice))}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
