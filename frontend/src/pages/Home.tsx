// src/components/Hero.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, Chip, Typography, Card, CardContent, Box, Avatar, Skeleton, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import NET from 'vanta/dist/vanta.net.min';
import WAVES from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';
import './Home.css';
import { fetchCollections, fetchMarketItems, fetchDrops } from '../services/nft';
import { NFTCollection, NFTItem } from '../types/nft';
import NFTCard from '../components/ui/NFTCard';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [topCols, setTopCols] = useState<NFTCollection[]>([]);
  const [recent, setRecent] = useState<NFTItem[]>([]);
  const [loadingCols, setLoadingCols] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [heroQuery, setHeroQuery] = useState('');
  const [drops, setDrops] = useState<Array<{ id: string; title: string; imageUrl: string; startAt: number; endAt: number; supply?: number; minted?: number }>>([]);
  const [loadingDrops, setLoadingDrops] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!vantaEffect && backgroundRef.current) {
      const VANTA_CONFIG = {
        el: backgroundRef.current,
        THREE: THREE,
        color: 0x8B0000,
        backgroundColor: 0x000000,
        points: 12,
        maxDistance: 25,
        spacing: 25,
        showLines: true,
        lineColor: 0x8B0000,
        lineWidth: 1.2,
        scale: 1.0,
        scaleMobile: 1.0,
        showDots: true,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        animationSpeed: 0.4,
        transitionDuration: 2000
      };

      try {
        const effect = NET(VANTA_CONFIG);
        setVantaEffect(effect);
        setVantaLoaded(true);
      } catch (error) {
        try {
          const wavesConfig = {
            ...VANTA_CONFIG,
            shininess: 27,
            waveHeight: 30,
            waveSpeed: 0.5,
            zoom: 0.65
          };
          const effect = WAVES(wavesConfig);
          setVantaEffect(effect);
          setVantaLoaded(true);
        } catch (wavesError) {
          setVantaLoaded(false);
        }
      }
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  useEffect(() => {
    setLoadingCols(true);
    setLoadingRecent(true);
    fetchCollections().then((cols) => {
      setTopCols(cols.slice(0, 4));
      setLoadingCols(false);
    });
    fetchMarketItems({ page: 1, pageSize: 8, sort: 'price_desc' }).then((items) => {
      setRecent(items);
      setLoadingRecent(false);
    });
    fetchDrops().then((d) => {
      setDrops(d);
      setLoadingDrops(false);
    });
  }, []);

  return (
    <div className="home-page">
      {/* Анимированный фон */}
      <div 
        ref={backgroundRef}
        className="home-page-background"
      />
      
      {/* Индикатор загрузки */}
      {!vantaLoaded && (
        <div className="loading-indicator">
          Загрузка...
        </div>
      )}
      
      {/* Hero */}
      <section className="hero-section">
        <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="hero-content"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="hero-badge"
          >
            <Chip 
              label="БЕТА 2025" 
              sx={{
                background: 'linear-gradient(135deg, #8B0000, #DC2626)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '2px',
                boxShadow: '0 8px 32px rgba(139, 0, 0, 0.4)'
              }}
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6 }}
            className="hero-title"
          >
            <span className="title-accent">RANDAR</span>
            <span className="title-main">NFT</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.9 }}
            className="hero-subtitle"
          >
            Маркет Telegram/TON NFT: коллекции, активность и быстрые сделки
          </motion.p>

          {/* Поиск */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="hero-search"
          >
            <TextField
              fullWidth
              placeholder="Поиск по NFT и коллекциям"
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/market?q=${encodeURIComponent(heroQuery)}`);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            <Button
              onClick={() => navigate(`/market?q=${encodeURIComponent(heroQuery)}`)}
              className="hero-search-btn"
              variant="contained"
            >
              Найти
            </Button>
          </motion.div>
          
          {/* Быстрые ссылки */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.1 }}
            className="hero-actions"
          >
            <Button
              variant="contained"
              size="large"
              className="cta-button primary"
              href="/market"
              sx={{
                fontSize: '1.05rem',
                padding: '14px 32px',
                borderRadius: '15px',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #8B0000, #DC2626)',
                color: '#ffffff',
                boxShadow: '0 12px 40px rgba(139, 0, 0, 0.5)',
                fontWeight: 700,
                letterSpacing: '1px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #DC2626, #8B0000)',
                  boxShadow: '0 16px 50px rgba(139, 0, 0, 0.7)',
                  transform: 'translateY(-3px)'
                }
              }}
            >
              🚀 Маркетплейс
            </Button>
            <Button variant="outlined" size="large" className="link-chip" href="/collections">Коллекции</Button>
            <Button variant="outlined" size="large" className="link-chip" href="/drops">Дропы</Button>
            <Button variant="outlined" size="large" className="link-chip" href="/activity">Активность</Button>
          </motion.div>
        </motion.div>
        </div>
      </section>

      {/* Трендящие коллекции */}
      <section className="section home-collections">
        <div className="container">
          <div className="section-header">
            <Typography className="section-title">Трендящие коллекции</Typography>
            <Typography className="section-subtitle">Актуальные и проверенные</Typography>
          </div>

          <div className="scroll-row">
            {loadingCols
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="skeleton-card" />
                ))
              : topCols.map((col) => (
                  <a key={col.id} href={`/collection/${col.id}`} className="collection-card">
                    <div className="banner"><img src={col.bannerUrl} alt={col.name} /></div>
                    <div className="row">
                      <Avatar src={col.avatarUrl} alt={col.name} />
                      <div className="info">
                        <div className="name">{col.name}</div>
                        <div className="meta">Floor {col.floorPriceTon} • Vol {col.volumeTon}</div>
                      </div>
                    </div>
                  </a>
                ))}
          </div>
        </div>
      </section>

      {/* Дропы */}
      <section className="section home-drops">
        <div className="container">
          <div className="section-header">
            <Typography className="section-title">Дропы</Typography>
            <Typography className="section-subtitle">Не пропусти новые минта и продажи</Typography>
          </div>
          <div className="scroll-row">
            {loadingDrops
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="skeleton-drop" />
                ))
              : drops.map((drop) => (
                  <a key={drop.id} href={`/drops`} className="drop-card">
                    <div className="image"><img src={drop.imageUrl} alt={drop.title} /></div>
                    <div className="body">
                      <div className="title">{drop.title}</div>
                      <div className="meta">{new Date(drop.startAt).toLocaleDateString('ru-RU')}</div>
                    </div>
                  </a>
                ))}
          </div>
        </div>
      </section>

      {/* Активность / Новые лоты */}
      <section className="section home-activity">
        <div className="container">
          <div className="section-header">
            <Typography className="section-title">Лайв активность</Typography>
            <Typography className="section-subtitle">Свежие сделки из маркета</Typography>
          </div>

          {loadingRecent ? (
            <div className="activity-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
              ))}
            </div>
          ) : (
            <Box sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              }
            }}>
              {recent.map((nft) => (
                <NFTCard key={nft.id} item={nft} />
              ))}
            </Box>
          )}
        </div>
      </section>

      {/* убрали лишние секции для чистого вида */}

      {/* Футер */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <Typography variant="h4" className="footer-title">RandarNFT</Typography>
            <Typography variant="body1" className="footer-desc">
              Элитная платформа для профессиональной торговли цифровыми активами
            </Typography>
          </div>
          <div className="footer-section">
            <Typography variant="h6" className="footer-subtitle">Продукты</Typography>
            <a href="/market">Маркет</a>
            <a href="/collections">Коллекции</a>
            <a href="/activity">Активность</a>
          </div>
          <div className="footer-section">
            <Typography variant="h6" className="footer-subtitle">Поддержка</Typography>
            <a href="/help">Помощь</a>
            <a href="/contact">Контакты</a>
          </div>
        </div>
        <div className="footer-bottom">
          <Typography variant="body2">
            © 2025 RANDARNFT. Все права защищены.
          </Typography>
        </div>
      </footer>
    </div>
  );
}