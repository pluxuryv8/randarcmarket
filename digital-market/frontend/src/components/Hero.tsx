// src/components/Hero.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import NET, { VantaEffect } from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

export default function Hero() {
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (backgroundRef.current && !vantaEffect) {
      const effect = NET({
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
      }) as VantaEffect;
      setVantaEffect(effect);
    }
    return () => {
      vantaEffect?.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={backgroundRef} className="relative min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-white text-center mb-4 z-10">
        Торгуйте скинами и подарками без забот
      </h1>
      <Button
        variant="contained"
        color="error"
        className="z-10"
        href="/radar"
      >
        Запустить радар
      </Button>
    </div>
  );
}
