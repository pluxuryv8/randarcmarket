import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

const PatternBackground: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let effect: any = null;
    if (ref.current) {
      effect = NET({
        el: ref.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        backgroundColor: 0x000000,
        color: 0xFF0000,
        points: 8.0,
        maxDistance: 35.0,
        spacing: 30.0,
        showDots: false,
        scale: 1.0,
      });
    }
    return () => effect && effect.destroy();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',    /* ключевой эффект */
      }}
    />
  );
};

export default PatternBackground;
