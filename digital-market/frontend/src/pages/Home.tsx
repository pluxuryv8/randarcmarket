// src/components/Hero.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, Chip, Typography, Card, CardContent } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import NET from 'vanta/dist/vanta.net.min';
import WAVES from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';
import './Home.css';

export default function Hero() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const features = [
    { icon: '⚡', title: 'Мгновенные сделки', desc: 'Выполнение за миллисекунды' },
    { icon: '🔒', title: 'Максимальная безопасность', desc: 'Военная криптография' },
    { icon: '💰', title: 'Минимальные комиссии', desc: 'Всего 0.5% за сделку' },
    { icon: '🤖', title: 'AI Радар', desc: 'Искусственный интеллект' },
    { icon: '📊', title: 'Аналитика в реальном времени', desc: 'Профессиональные инструменты' },
    { icon: '🌐', title: 'Глобальная сеть', desc: 'Доступ из любой точки мира' }
  ];

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
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

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
      
      {/* Главный герой */}
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="hero-content"
        >
          {/* Премиальный бейдж */}
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
          
          {/* Главный заголовок */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="hero-title"
          >
            <span className="title-accent">RANDAR</span>
            <span className="title-main"> MARKET</span>
          </motion.h1>
          
          {/* Подзаголовок */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="hero-subtitle"
          >
            Инновационная платформа для торговли цифровыми активами нового поколения
          </motion.p>
          
          {/* Анимированные фичи */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.6 }}
            className="hero-features"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="feature-item"
              >
                <div className="feature-icon">{features[currentFeature].icon}</div>
                <div className="feature-text">
                  <div className="feature-title">{features[currentFeature].title}</div>
                  <div className="feature-desc">{features[currentFeature].desc}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          {/* Премиальные кнопки */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 2.0 }}
            className="hero-actions"
          >
            <Button
              variant="contained"
              size="large"
              className="cta-button primary"
              href="/auth/steam"
              sx={{
                fontSize: '1.2rem',
                padding: '18px 50px',
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
              🚀 ПОПРОБОВАТЬ БЕТА
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              className="cta-button secondary"
              href="/about"
              sx={{
                fontSize: '1.1rem',
                padding: '16px 40px',
                borderRadius: '15px',
                textTransform: 'none',
                borderColor: 'rgba(139, 0, 0, 0.5)',
                color: '#DC2626',
                borderWidth: '2px',
                fontWeight: 600,
                letterSpacing: '1px',
                '&:hover': {
                  borderColor: '#8B0000',
                  background: 'rgba(139, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(139, 0, 0, 0.3)'
                }
              }}
            >
              📖 О ПРОЕКТЕ
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Премиальный индикатор прокрутки */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="scroll-indicator"
        >
          <div className="scroll-text">Прокрутите вниз</div>
          <motion.div 
            className="scroll-arrow"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* Премиальная статистика */}
      <section className="stats-section">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="stats-container"
        >
          <div className="stats-grid">
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h3" className="stat-number">BETA</Typography>
                <Typography variant="h6" className="stat-label">Статус проекта</Typography>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h3" className="stat-number">24/7</Typography>
                <Typography variant="h6" className="stat-label">Мониторинг рынка</Typography>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h3" className="stat-number">100%</Typography>
                <Typography variant="h6" className="stat-label">Безопасность</Typography>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h3" className="stat-number">0.5%</Typography>
                <Typography variant="h6" className="stat-label">Комиссия</Typography>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Премиальные преимущества */}
      <section className="features-section">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <Typography variant="h2" className="section-title">
            ПОЧЕМУ ВЫБИРАЮТ RANDAR MARKET?
          </Typography>
          <Typography variant="h5" className="section-subtitle">
            Инновационные технологии и превосходный пользовательский опыт
          </Typography>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <Card className="premium-card">
                <CardContent>
                  <Typography variant="h1" className="feature-icon-large">
                    {feature.icon}
                  </Typography>
                  <Typography variant="h4" className="feature-title">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" className="feature-desc">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Премиальный футер */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <Typography variant="h4" className="footer-title">RANDAR MARKET</Typography>
            <Typography variant="body1" className="footer-desc">
              Элитная платформа для профессиональной торговли цифровыми активами
            </Typography>
          </div>
          <div className="footer-section">
            <Typography variant="h6" className="footer-subtitle">Продукты</Typography>
            <a href="/inventory">Инвентарь</a>
            <a href="/radar">Радар</a>
            <a href="/profile">Профиль</a>
          </div>
          <div className="footer-section">
            <Typography variant="h6" className="footer-subtitle">Поддержка</Typography>
            <a href="/help">Помощь</a>
            <a href="/contact">Контакты</a>
          </div>
        </div>
        <div className="footer-bottom">
          <Typography variant="body2">
            © 2025 RANDAR MARKET. Все права защищены.
          </Typography>
        </div>
      </footer>
    </div>
  );
}