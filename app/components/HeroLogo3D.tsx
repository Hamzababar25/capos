'use client';

import { useEffect, useRef } from 'react';
import '@google/model-viewer';

export default function HeroLogo3D() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Nudge the auto-rotate into an interesting angle instead of the
    // default head-on framing once the model has finished loading.
    const onLoad = () => el.setAttribute('camera-orbit', '10deg 78deg 105%');
    el.addEventListener('load', onLoad);
    return () => el.removeEventListener('load', onLoad);
  }, []);

  return (
    <model-viewer
      ref={ref}
      className="hero-logo-3d"
      src="/models/capos-logo.glb"
      alt="CAPO'S, a crimson rose growing through two stacked serif C's"
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
      camera-orbit="0deg 78deg 105%"
      loading="eager"
      reveal="auto"
    />
  );
}
