'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export default function GradientHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create PIXI Application
    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio,
    });

    containerRef.current.appendChild(app.canvas);
    appRef.current = app;

    // Create gradient display object using filters
    const graphics = new PIXI.Graphics();
    graphics.rect(0, 0, width, height);
    graphics.fill(0xffffff);
    app.stage.addChild(graphics);

    // Create custom shader for gradient animation
    const fragmentShader = `
      varying vec2 vTextureCoord;
      uniform float uTime;
      uniform vec2 uResolution;

      void main(void) {
        vec2 uv = vTextureCoord;
        
        // Create animated gradient
        vec3 color = vec3(0.1, 0.2, 0.4);
        color += vec3(0.35, 0.55, 0.85) * sin(uv.x * 3.0 + uTime * 0.5) * 0.5;
        color += vec3(0.67, 0.85, 0.9) * cos(uv.y * 2.0 + uTime * 0.3) * 0.3;
        color += vec3(0.8, 0.2, 0.1) * sin((uv.x + uv.y) * 2.0 + uTime * 0.7) * 0.2;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const filter = new PIXI.Filter(undefined, fragmentShader);
    graphics.filters = [filter];

    // Animation loop
    const animate = () => {
      timeRef.current += 0.01;
      if (filter.uniforms.uTime !== undefined) {
        filter.uniforms.uTime = timeRef.current;
      }
    };

    app.ticker.add(animate);

    // Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      app.renderer.resize(newWidth, newHeight);
      graphics.clear();
      graphics.rect(0, 0, newWidth, newHeight);
      graphics.fill(0xffffff);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      app.destroy(true);
    };
  }, []);

  return (
    <div className="hero-container">
      <div ref={containerRef} className="hero-canvas" />
      <div className="hero-content">
        <h1 className="hero-title">
          We are a brand<br />
          of collective<br />
          creativity
        </h1>
        <p className="hero-subtitle">
          Tokyo-born design-driven creative agency
        </p>
      </div>
    </div>
  );
}
