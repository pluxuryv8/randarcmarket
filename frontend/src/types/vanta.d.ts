// frontend/src/types/vanta.d.ts
declare module 'vanta/dist/vanta.net.min' {
  type VantaEffect = {
    destroy: () => void;
    [key: string]: any;
  };
  interface VantaOptions {
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    backgroundColor?: number;
    color?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
    showDots?: boolean;
    lineColor?: number;
    strokeColor?: number;
    connectionColor?: number;
    animationSpeed?: number;
    fadeInSpeed?: number;
    fadeOutSpeed?: number;
    lineWidth?: number;
    strokeWidth?: number;
    thickness?: number;
    lineThickness?: number;
    strokeThickness?: number;
    [key: string]: any;
  }
  export default function NET(options: VantaOptions): VantaEffect;
}

declare module 'vanta/dist/vanta.waves.min' {
  type VantaEffect = {
    destroy: () => void;
    [key: string]: any;
  };
  interface VantaOptions {
    el: HTMLElement;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    backgroundColor?: number;
    color?: number;
    shininess?: number;
    waveHeight?: number;
    waveSpeed?: number;
    [key: string]: any;
  }
  export default function WAVES(options: VantaOptions): VantaEffect;
}
