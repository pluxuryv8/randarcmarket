// src/components/Hero.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import NET, { VantaEffect } from 'vanta/dist/vanta.net.min';
import WAVES from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';
import './Home.css';

export default function Hero() {
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (backgroundRef.current && !vantaEffect) {
      console.log('Инициализация Vanta эффекта...');
      
      const vantaConfig = {
        el: backgroundRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xFF0000,
        backgroundColor: 0x000000,
        showDots: false,
        points: 8.0,
        maxDistance: 35.0,
        spacing: 30.0,
      };
      
      console.log('Настройки Vanta:', vantaConfig);
      
      // Попробуем сначала NET, если не получится - WAVES
      let effect;
      try {
        effect = NET(vantaConfig) as VantaEffect;
        console.log('Используем NET эффект');
      } catch (error) {
        console.log('NET не работает, пробуем WAVES');
        effect = WAVES({
          el: backgroundRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: window.innerHeight,
          minWidth: window.innerWidth,
          scale: 0.1,
          scaleMobile: 0.1,
          color: 0xFF0000,
          backgroundColor: 0x000000,
          shininess: 27,
          waveHeight: 15.5,
          waveSpeed: 0.25,
        }) as VantaEffect;
      }
      setVantaEffect(effect);
      
      console.log('Vanta эффект создан');
    }
    return () => {
      vantaEffect?.destroy();
    };
  }, [vantaEffect]);

  return (
    <div className="home-page">
      <div 
        ref={backgroundRef} 
        className="fixed inset-0 w-full h-full home-page-background"
      />
      
      {/* Основной контент */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-7xl md:text-8xl font-bold mb-8 drop-shadow-2xl bg-black/30 backdrop-blur-sm px-12 py-6 rounded-lg border border-white/10">
          <span className="text-[#8B0000]">RANDAR</span>
          <span className="text-white"> MARKET</span>
        </h1>
        <p className="text-2xl md:text-3xl text-white mb-12 max-w-4xl drop-shadow-lg bg-black/20 backdrop-blur-sm px-8 py-4 rounded-lg animate-fade-in-darkness delay-300">
          Безопасная платформа для торговли цифровыми товарами
        </p>
        <div className="flex flex-col sm:flex-row gap-8 z-10">
          <div className="flex flex-col items-center">
            <p className="text-lg text-white mb-4 text-center drop-shadow-lg bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg animate-fade-in-darkness delay-400">
              Торгуйте скинами CS:GO
            </p>
            <Button
              variant="contained"
              size="large"
              className="text-lg px-8 py-3 animate-fade-in-darkness delay-600"
              href="/auth/steam"
              sx={{
                fontSize: '1.125rem',
                padding: '12px 32px',
                borderRadius: '8px',
                textTransform: 'none',
                backgroundColor: '#374151',
                color: '#ffffff',
                boxShadow: '0 4px 14px 0 rgba(55, 65, 81, 0.4)',
                '&:hover': {
                  backgroundColor: '#4b5563',
                  boxShadow: '0 6px 20px 0 rgba(55, 65, 81, 0.6)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Войти через Steam
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg text-white mb-4 text-center drop-shadow-lg bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg animate-fade-in-darkness delay-500">
              Торгуйте NFT
            </p>
            <Button
              variant="contained"
              size="large"
              className="text-lg px-8 py-3 animate-fade-in-darkness delay-800"
              href="/auth/telegram"
              sx={{
                fontSize: '1.125rem',
                padding: '12px 32px',
                borderRadius: '8px',
                textTransform: 'none',
                backgroundColor: '#1e40af',
                color: '#ffffff',
                boxShadow: '0 4px 14px 0 rgba(30, 64, 175, 0.4)',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                  boxShadow: '0 6px 20px 0 rgba(30, 64, 175, 0.6)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Войти через Telegram
            </Button>
          </div>
        </div>
        
        {/* Информационные плашки */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center hover:bg-black/80 transition-all duration-300 shadow-lg animate-slide-in-left delay-1000">
            <div className="text-gray-300 text-4xl mb-4 drop-shadow-lg">🚀</div>
            <h3 className="text-lg font-bold text-gray-200 mb-3 drop-shadow-lg">Новая эра торговли</h3>
            <p className="text-gray-400 text-sm drop-shadow-md">
              Инновационная платформа для торговли цифровыми ценностями с передовыми технологиями
            </p>
          </div>
          
          <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center hover:bg-black/80 transition-all duration-300 shadow-lg animate-slide-in-left delay-1000">
            <div className="text-gray-300 text-4xl mb-4 drop-shadow-lg">⚡</div>
            <h3 className="text-lg font-bold text-gray-200 mb-3 drop-shadow-lg">Быстро и безопасно</h3>
            <p className="text-gray-400 text-sm drop-shadow-md">
              Мгновенные сделки с минимальной комиссией и максимальной защитой ваших активов
            </p>
          </div>
          
          <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center hover:bg-black/80 transition-all duration-300 shadow-lg animate-slide-in-left delay-1000">
            <div className="text-gray-300 text-4xl mb-4 drop-shadow-lg">💰</div>
            <h3 className="text-lg font-bold text-gray-200 mb-3 drop-shadow-lg">Радар выгоды</h3>
            <p className="text-gray-400 text-sm drop-shadow-md">
              Зарабатывайте через Telegram бота без специальных знаний и с минимальными вложениями
            </p>
          </div>
          
          <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center hover:bg-black/80 transition-all duration-300 shadow-lg animate-slide-in-left delay-1000">
            <div className="text-gray-300 text-4xl mb-4 drop-shadow-lg">🎯</div>
            <h3 className="text-lg font-bold text-gray-200 mb-3 drop-shadow-lg">Покупай и продавай</h3>
            <p className="text-gray-400 text-sm drop-shadow-md">
              Легко продавайте свои цифровые ценности и покупайте новые по лучшим ценам
            </p>
          </div>
        </div>
      </div>
      
      {/* Дополнительный контент для скролла */}
      <div className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-2xl">
            Дополнительная информация
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto drop-shadow-lg">
            Узнайте больше о возможностях нашей платформы и начните торговлю уже сегодня
          </p>
          
          {/* Дополнительные карточки */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-[#220000]/40 backdrop-blur-sm border border-[#440000]/30 rounded-lg p-8 text-center hover:bg-[#220000]/60 transition-all duration-300">
              <div className="text-gray-300 text-5xl mb-6 drop-shadow-lg">🔒</div>
              <h3 className="text-xl font-bold text-gray-200 mb-4 drop-shadow-lg">Безопасность</h3>
              <p className="text-gray-400 drop-shadow-md">
                Ваши активы защищены современными технологиями шифрования
              </p>
            </div>
            
            <div className="bg-[#220000]/40 backdrop-blur-sm border border-[#440000]/30 rounded-lg p-8 text-center hover:bg-[#220000]/60 transition-all duration-300">
              <div className="text-gray-300 text-5xl mb-6 drop-shadow-lg">⚡</div>
              <h3 className="text-xl font-bold text-gray-200 mb-4 drop-shadow-lg">Скорость</h3>
              <p className="text-gray-400 drop-shadow-md">
                Мгновенные транзакции и быстрая обработка всех операций
              </p>
            </div>
            
            <div className="bg-[#220000]/40 backdrop-blur-sm border border-[#440000]/30 rounded-lg p-8 text-center hover:bg-[#220000]/60 transition-all duration-300">
              <div className="text-gray-300 text-5xl mb-6 drop-shadow-lg">💎</div>
              <h3 className="text-xl font-bold text-gray-200 mb-4 drop-shadow-lg">Качество</h3>
              <p className="text-gray-400 drop-shadow-md">
                Только проверенные товары и надежные партнеры
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Еще больше контента для гарантированного скролла */}
      <div className="relative z-10 py-32">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 drop-shadow-2xl">
            Статистика платформы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            <div className="bg-[#220000]/30 backdrop-blur-sm border border-[#440000]/20 rounded-lg p-6 text-center">
              <div className="text-gray-300 text-4xl mb-4 drop-shadow-lg">10K+</div>
              <h3 className="text-lg font-bold text-gray-200 mb-2 drop-shadow-lg">Пользователей</h3>
              <p className="text-gray-400 text-sm drop-shadow-md">Активных трейдеров</p>
            </div>
            
            <div className="bg-[#220000]/30 backdrop-blur-sm border border-[#440000]/20 rounded-lg p-6 text-center">
              <div className="text-gray-300 text-4xl mb-4 drop-shadow-lg">$2M+</div>
              <h3 className="text-lg font-bold text-gray-200 mb-2 drop-shadow-lg">Объем торгов</h3>
              <p className="text-gray-400 text-sm drop-shadow-md">Ежемесячно</p>
            </div>
            
            <div className="bg-[#220000]/30 backdrop-blur-sm border border-[#440000]/20 rounded-lg p-6 text-center">
              <div className="text-gray-300 text-4xl mb-4 drop-shadow-lg">99.9%</div>
              <h3 className="text-lg font-bold text-gray-200 mb-2 drop-shadow-lg">Время работы</h3>
              <p className="text-gray-400 text-sm drop-shadow-md">Стабильность</p>
            </div>
            
            <div className="bg-[#220000]/30 backdrop-blur-sm border border-[#440000]/20 rounded-lg p-6 text-center">
              <div className="text-gray-300 text-4xl mb-4 drop-shadow-lg">24/7</div>
              <h3 className="text-lg font-bold text-gray-200 mb-2 drop-shadow-lg">Поддержка</h3>
              <p className="text-gray-400 text-sm drop-shadow-md">Всегда на связи</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Компактный футер */}
      <footer className="relative z-20 bg-black/90 backdrop-blur-sm border-t border-white/10 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">© 2025 Randar Market</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="/inventory" className="text-gray-400 hover:text-white transition-colors text-sm">Инвентарь</a>
              <a href="/radar" className="text-gray-400 hover:text-white transition-colors text-sm">Радар</a>
              <a href="/profile" className="text-gray-400 hover:text-white transition-colors text-sm">Профиль</a>
              <a href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Поддержка</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}