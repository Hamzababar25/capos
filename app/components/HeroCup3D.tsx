'use client';

import { useEffect, useRef } from 'react';
import '@google/model-viewer';

export default function HeroCup3D() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Nudge the auto-rotate into an interesting angle instead of the
    // default head-on framing once the model has finished loading.
    const onLoad = () => el.setAttribute('camera-orbit', '-12deg 82deg 105%');
    el.addEventListener('load', onLoad);
    return () => el.removeEventListener('load', onLoad);
  }, []);

  return (
    <model-viewer
      ref={ref}
      className="hero-logo-3d"
      src="/models/capos-cup.glb"
      alt="CAPO'S iced rose latte, garnished with dried rose petals"
      camera-controls
      disable-zoom
      disable-pan
      auto-rotate
      auto-rotate-delay={0}
      rotation-per-second="14deg"
      interaction-prompt="none"
      exposure="1.05"
      shadow-intensity="0.9"
      shadow-softness="0.8"
      field-of-view="28deg"
      camera-orbit="0deg 82deg 105%"
      min-camera-orbit="auto 35deg auto"
      max-camera-orbit="auto 100deg auto"
      loading="eager"
      reveal="auto"
    />
  );
}
