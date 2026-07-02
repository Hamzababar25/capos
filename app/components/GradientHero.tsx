'use client';

import { useEffect, useRef, useState } from 'react';
import Navigation from './Navigation';
import './hero.css';
import gsap from 'gsap';


export default function GradientHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const currentMousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uHover;

      // Enhanced noise function
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 5; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      // Liquid distortion
      vec2 liquify(vec2 uv, vec2 center, float strength) {
        vec2 delta = uv - center;
        float dist = length(delta);
        float influence = smoothstep(0.5, 0.0, dist) * strength;
        
        float angle = atan(delta.y, delta.x);
        float spiral = sin(dist * 15.0 - uTime * 3.0) * influence;
        
        return uv + vec2(
          cos(angle + spiral) * influence * 0.1,
          sin(angle + spiral) * influence * 0.1
        );
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        
        // Mouse interaction
        float dist = distance(uv, uMouse);
        float bubble = smoothstep(0.35, 0.0, dist) * uHover;
        
        // Liquid distortion on hover (reduced intensity)
        vec2 distortedUV = liquify(uv, uMouse, bubble * 1.2);
        
        // Add swirling vortex effect
        vec2 toMouse = distortedUV - uMouse;
        float angle = atan(toMouse.y, toMouse.x);
        float radius = length(toMouse);
        
        // Rotate around mouse (reduced rotation)
        float rotation = bubble * sin(uTime * 2.0) * 4.0;
        float cosA = cos(rotation * radius * 2.0);
        float sinA = sin(rotation * radius * 2.0);
        
        vec2 rotatedUV = distortedUV;
        if (bubble > 0.01) {
          vec2 centered = distortedUV - uMouse;
          rotatedUV = vec2(
            centered.x * cosA - centered.y * sinA,
            centered.x * sinA + centered.y * cosA
          ) + uMouse;
        }
        
        // Enhanced coffee colors - more vibrant and rich
        vec3 c1 = vec3(0.12, 0.06, 0.03);      // Deep espresso
        vec3 c2 = vec3(0.55, 0.32, 0.18);      // Rich coffee brown
        vec3 c3 = vec3(0.92, 0.82, 0.68);      // Creamy latte
        vec3 accent = vec3(0.85, 0.45, 0.20);  // Caramel accent
        
        float t = uTime * 0.12;
        
        // Multi-layer noise for depth
        float n1 = fbm(rotatedUV * 2.5 + vec2(t, -t * 0.5));
        float n2 = fbm(rotatedUV * 3.5 + vec2(-t * 0.7, t * 0.9));
        float n3 = fbm(rotatedUV * 1.8 + vec2(t * 1.3, -t * 0.6));
        
        // Diagonal gradient (bottom-left to top-right)
        float diagonal = (rotatedUV.x + rotatedUV.y) * 0.5;
        
        // Add bubble chaos (reduced)
        float chaos = sin(angle * 8.0 + uTime * 4.0) * cos(radius * 20.0 - uTime * 5.0);
        diagonal += chaos * bubble * 0.3;
        
        // Enhanced color mixing — dark zone extended to cover center text area
        vec3 col = c1;
        col = mix(col, c2, smoothstep(0.35, 0.62, diagonal + n1 * 0.4));
        col = mix(col, c3, smoothstep(0.62, 1.05, diagonal + n2 * 0.4));
        col = mix(col, accent, n3 * 0.3 * bubble);
        
        // Chromatic aberration on hover
        if (bubble > 0.1) {
          vec2 offset = normalize(toMouse) * bubble * 0.02;
          float r = mix(c1.r, c2.r, smoothstep(0.35, 0.62, diagonal + n1 * 0.4 + offset.x));
          r = mix(r, c3.r, smoothstep(0.62, 1.05, diagonal + n2 * 0.4 + offset.x));
          
          float b = mix(c1.b, c2.b, smoothstep(0.35, 0.62, diagonal + n1 * 0.4 - offset.x));
          b = mix(b, c3.b, smoothstep(0.62, 1.05, diagonal + n2 * 0.4 - offset.x));
          
          col.r = mix(col.r, r, bubble * 0.7);
          col.b = mix(col.b, b, bubble * 0.7);
        }
        
        // Intense glow around mouse (reduced)
        float glow = exp(-dist * 4.0) * bubble;
        col += vec3(glow * 0.25, glow * 0.15, glow * 0.1);
        
        // Pulsing energy (reduced)
        float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
        float energy = bubble * pulse;
        col += vec3(energy * 0.12, energy * 0.08, energy * 0.05);
        
        // Sparkle effect
        float sparkle = smoothstep(0.98, 1.0, noise(rotatedUV * 50.0 + uTime));
        col += vec3(sparkle * bubble * 0.5);
        
        // Vignette for depth
        float vignette = smoothstep(0.8, 0.2, length(uv - 0.5));
        col *= 0.7 + vignette * 0.3;
        
        // Contrast boost
        col = pow(col, vec3(0.9));
        col *= 1.15;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(prog, 'uTime');
    const uResLoc = gl.getUniformLocation(prog, 'uResolution');
    const uMouseLoc = gl.getUniformLocation(prog, 'uMouse');
    const uHoverLoc = gl.getUniformLocation(prog, 'uHover');

    let t = 0;
    let hoverAmount = 0;
    
    const render = () => {
      t += 0.01;
      
      // Smooth lerp for mouse position
      currentMousePos.current.x += (targetMousePos.current.x - currentMousePos.current.x) * 0.1;
      currentMousePos.current.y += (targetMousePos.current.y - currentMousePos.current.y) * 0.1;
      
      // Smooth hover transition
      const targetHover = isHovering ? 1.0 : 0.0;
      hoverAmount += (targetHover - hoverAmount) * 0.1;
      
      gl!.uniform1f(uTimeLoc, t);
      gl!.uniform2f(uResLoc, canvas.width, canvas.height);
      gl!.uniform2f(uMouseLoc, currentMousePos.current.x, 1.0 - currentMousePos.current.y);
      gl!.uniform1f(uHoverLoc, hoverAmount);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
    };
  }, [isHovering]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetMousePos.current = { x, y };
      setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseenter', handleMouseEnter);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseenter', handleMouseEnter);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Calculate scroll progress (0 to 1) based on first viewport
      const progress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // GSAP cinematic text reveal on mount
  useEffect(() => {
    const lines    = document.querySelectorAll('.pixi-intro-line');
    const eyebrow  = document.querySelector('.pixi-intro-eyebrow');
    const sub      = document.querySelector('.pixi-intro-sub');
    const cta      = document.querySelector('.pixi-intro-cta');
    const foot     = document.querySelector('.pixi-intro-foot');
    const nav      = document.querySelector('.c-header');

    gsap.set(nav,     { y: -20, opacity: 0 });
    gsap.set(eyebrow, { y: 20, opacity: 0 });
    gsap.set(lines,   { y: 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
    gsap.set(sub,     { y: 20, opacity: 0 });
    gsap.set(cta,     { y: 20, opacity: 0 });
    gsap.set(foot,    { y: 30, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(nav, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' })
      .to(eyebrow, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .to(lines,   {
        y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)',
        duration: 1.1, stagger: 0.11, ease: 'expo.out',
      }, '-=0.35')
      .to(sub,  { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.5')
      .to(cta,  { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .to(foot, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.55');
  }, []);


  return (
    <section className="pixi-intro" ref={sectionRef}>
      {/* Navigation - part of hero */}
      <Navigation />
      
      {/* WebGL canvas */}
      <canvas ref={canvasRef} className="pixi-intro-canvas" />

      {/* Floating circles */}
      <div className="hero-circles" aria-hidden="true">
        {/* Left side */}
        <span className="hero-circle hero-circle--a" style={{ width: 280, height: 280, left: -60,   top: '15%',  animationDuration: '38s', animationDelay: '0s'   }} />
        <span className="hero-circle hero-circle--b" style={{ width: 130, height: 130, left: 60,    top: '55%',  animationDuration: '27s', animationDelay: '-8s'  }} />
        <span className="hero-circle hero-circle--a" style={{ width: 72,  height: 72,  left: 160,   top: '28%',  animationDuration: '21s', animationDelay: '-14s' }} />
        {/* Right side */}
        <span className="hero-circle hero-circle--b" style={{ width: 320, height: 320, right: -80,  top: '22%',  animationDuration: '45s', animationDelay: '-20s' }} />
        <span className="hero-circle hero-circle--a" style={{ width: 95,  height: 95,  right: 80,   top: '60%',  animationDuration: '31s', animationDelay: '-5s'  }} />
        <span className="hero-circle hero-circle--b" style={{ width: 180, height: 180, right: 120,  top: '8%',   animationDuration: '34s', animationDelay: '-17s' }} />
        {/* Bottom accent */}
        <span className="hero-circle hero-circle--a" style={{ width: 50,  height: 50,  left: '38%', top: '82%',  animationDuration: '24s', animationDelay: '-6s'  }} />
        <span className="hero-circle hero-circle--b" style={{ width: 110, height: 110, right: '30%', top: '70%', animationDuration: '30s', animationDelay: '-12s' }} />
      </div>

      {/* Interactive cursor circle */}
      <div 
        className="cursor-circle"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* Content */}
      <div 
        className="pixi-intro-inner"
        style={{
          transform: `translateY(${scrollProgress * 100}px)`,
          opacity: 1 - scrollProgress * 0.5,
        }}
      >
        <div className="pixi-intro-center">
          <div className="pixi-intro-eyebrow t-h6">
            Coffee Cart · Tri-State Area · Est. 2025
          </div>
          <h1
            ref={titleRef}
            className="pixi-intro-title t-h1"
            style={{
              transform: `scale(${1 + scrollProgress * 0.4})`,
              opacity: 1 - scrollProgress,
            }}
            role="heading"
            aria-level={1}
          >
            {/* Line 1 — hover reveals: WELCOME */}
            <span className="pixi-intro-line pixi-intro-line--1">
              <span className="hero-flip">
                <span className="hero-flip-default">CAPO'S</span>
                <span className="hero-flip-hover hero-flip-hover--en" aria-hidden="true">
                  WELCOME
                </span>
              </span>
            </span>

            {/* Line 2 — hover reveals: مرحباً (Arabic) */}
            <span className="pixi-intro-line pixi-intro-line--2">
              <span className="hero-flip">
                <span className="hero-flip-default">COFFEE</span>
                <span className="hero-flip-hover hero-flip-hover--ar" lang="ar" dir="rtl" aria-hidden="true">
                  مرحباً
                </span>
              </span>
            </span>

            {/* Line 3 — hover reveals: BENVENUTO (Italian) */}
            <span className="pixi-intro-line pixi-intro-line--3">
              <span className="hero-flip">
                <span className="hero-flip-default">EST. 2025</span>
                <span className="hero-flip-hover hero-flip-hover--it" lang="it" aria-hidden="true">
                  BENVENUTO
                </span>
              </span>
            </span>
          </h1>
          <p className="pixi-intro-sub t-text-lg">
          HANDCRAFTED ESPRESSO EXPERIENCES,  
            <br />

           TAILORED TO EVERY OCCASION          
          </p>
          <a
            href="#booking"
            className="pixi-intro-cta btn-primary pointer-events-auto px-7 py-3.5 text-xs tracking-[0.12em] opacity-0"
          >
            Book Your Event →
          </a>
        </div>

        <div 
          className="pixi-intro-foot"
          style={{
            opacity: 1 - scrollProgress * 1.5,
            transform: `translateY(${scrollProgress * 50}px)`,
          }}
        >
          <div className="pixi-intro-foot-row">
            <div className="pixi-intro-foot-circles">
              <svg viewBox="0 0 54 18" width="54" height="18" fill="none">
                <circle cx="9" cy="9" r="8.5" stroke="white" strokeOpacity="0.3" />
                <circle cx="27" cy="9" r="8.5" stroke="white" strokeOpacity="0.3" />
                <circle cx="45" cy="9" r="8.5" stroke="white" strokeOpacity="0.3" />
              </svg>
            </div>

            <div className="pixi-intro-foot-items">
              <div className="pixi-intro-foot-item t-text-lg">
                <strong>New Jersey</strong>
                <span className="pixi-intro-foot-sub">40.7375° N, 0.1278° W</span>
              </div>
              <div className="pixi-intro-foot-item t-text-lg">
                <strong>Sumatran Beans</strong>
                <span className="pixi-intro-foot-sub">ethically sourced</span>
              </div>
              <div className="pixi-intro-foot-item t-text-lg">
                <strong>Italian Touch</strong>
                <span className="pixi-intro-foot-sub">roasted to order</span>
              </div>
            </div>

            <div className="pixi-intro-scroll-wrap">
              <svg viewBox="0 0 17 52" width="17" height="52" fill="none" aria-label="Scroll down indicator">
                <line x1="8.5" y1="0" x2="8.5" y2="42" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
                <path d="M2 38 L8.5 52 L15 38" stroke="white" strokeOpacity="0.4" strokeWidth="1" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
