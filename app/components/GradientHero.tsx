'use client';

import { useEffect, useRef, useState } from 'react';
import Navigation from './Navigation';
import './hero.css';

interface CoffeeBean {
  x: number;
  y: number;
  rotation: number;
  speed: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  sway: number;
  swaySpeed: number;
}

export default function GradientHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beansCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const beansRafRef = useRef<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const currentMousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });
  const beansRef = useRef<CoffeeBean[]>([]);

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
        
        // Enhanced color mixing
        vec3 col = c1;
        col = mix(col, c2, smoothstep(0.15, 0.45, diagonal + n1 * 0.4));
        col = mix(col, c3, smoothstep(0.45, 0.85, diagonal + n2 * 0.4));
        col = mix(col, accent, n3 * 0.3 * bubble);
        
        // Chromatic aberration on hover
        if (bubble > 0.1) {
          vec2 offset = normalize(toMouse) * bubble * 0.02;
          float r = mix(c1.r, c2.r, smoothstep(0.15, 0.45, diagonal + n1 * 0.4 + offset.x));
          r = mix(r, c3.r, smoothstep(0.45, 0.85, diagonal + n2 * 0.4 + offset.x));
          
          float b = mix(c1.b, c2.b, smoothstep(0.15, 0.45, diagonal + n1 * 0.4 - offset.x));
          b = mix(b, c3.b, smoothstep(0.45, 0.85, diagonal + n2 * 0.4 - offset.x));
          
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

    // Text hover detection
    if (title) {
      const handleTextEnter = () => setIsHoveringText(true);
      const handleTextLeave = () => setIsHoveringText(false);
      
      title.addEventListener('mouseenter', handleTextEnter);
      title.addEventListener('mouseleave', handleTextLeave);

      return () => {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseenter', handleMouseEnter);
        section.removeEventListener('mouseleave', handleMouseLeave);
        title.removeEventListener('mouseenter', handleTextEnter);
        title.removeEventListener('mouseleave', handleTextLeave);
      };
    }

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

  // Coffee beans animation
  useEffect(() => {
    const canvas = beansCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize beans
    const createBean = (fromLeft: boolean): CoffeeBean => ({
      x: fromLeft ? Math.random() * (canvas.width * 0.15) : canvas.width - Math.random() * (canvas.width * 0.15),
      y: -20,
      rotation: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      size: 8 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.4,
      sway: Math.random() * 40 - 20,
      swaySpeed: 0.02 + Math.random() * 0.03,
    });

    // Add beans periodically
    const addBeans = () => {
      if (beansRef.current.length < 50) {
        beansRef.current.push(createBean(Math.random() > 0.5));
      }
    };

    const beanInterval = setInterval(addBeans, 300);

    // Draw coffee bean shape
    const drawBean = (bean: CoffeeBean) => {
      ctx.save();
      ctx.translate(bean.x, bean.y);
      ctx.rotate(bean.rotation);
      ctx.globalAlpha = bean.opacity;

      // Very dark, almost black coffee bean colors
      const darkBrown = '#1a0f08';
      const mediumBrown = '#2d1810';
      const lightBrown = '#3d2415';

      // Bean body (more elongated oval for realistic shape)
      ctx.fillStyle = '#0f0805';
      ctx.beginPath();
      ctx.ellipse(0, 0, bean.size * 0.7, bean.size * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Add gradient for 3D effect
      const gradient = ctx.createRadialGradient(
        -bean.size * 0.2, -bean.size * 0.3, 0,
        0, 0, bean.size * 1.2
      );
      gradient.addColorStop(0, mediumBrown);
      gradient.addColorStop(0.6, darkBrown);
      gradient.addColorStop(1, '#0a0503');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, bean.size * 0.7, bean.size * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bean crack (center line) - very dark
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = bean.size * 0.12;
      ctx.lineCap = 'round';
      ctx.beginPath();
      // S-shaped crack
      ctx.moveTo(0, -bean.size * 0.7);
      ctx.quadraticCurveTo(bean.size * 0.15, -bean.size * 0.2, 0, bean.size * 0.1);
      ctx.quadraticCurveTo(-bean.size * 0.15, bean.size * 0.4, 0, bean.size * 0.8);
      ctx.stroke();

      // Very subtle highlight for shine
      ctx.fillStyle = 'rgba(61, 36, 21, 0.2)';
      ctx.beginPath();
      ctx.ellipse(-bean.size * 0.25, -bean.size * 0.4, bean.size * 0.3, bean.size * 0.5, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // Edge shadow for depth - very dark
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = bean.size * 0.08;
      ctx.beginPath();
      ctx.ellipse(0, 0, bean.size * 0.65, bean.size * 1.15, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      beansRef.current = beansRef.current.filter(bean => {
        // Update position
        bean.y += bean.speed;
        bean.x += Math.sin(bean.y * bean.swaySpeed) * 0.5;
        bean.rotation += bean.rotationSpeed;

        // Remove if off screen
        if (bean.y > canvas.height + 50) {
          return false;
        }

        drawBean(bean);
        return true;
      });

      beansRafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(beansRafRef.current);
      clearInterval(beanInterval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="pixi-intro" ref={sectionRef}>
      {/* Navigation - part of hero */}
      <Navigation />
      
      {/* WebGL canvas */}
      <canvas ref={canvasRef} className="pixi-intro-canvas" />

      {/* Coffee beans canvas */}
      <canvas ref={beansCanvasRef} className="coffee-beans-canvas" />

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
          <h1 
            ref={titleRef}
            className="pixi-intro-title t-h1"
            style={{
              transform: `scale(${1 + scrollProgress * 0.5})`,
              opacity: 1 - scrollProgress,
              filter: isHoveringText ? 'blur(3px)' : 'blur(0px)',
              transition: 'filter 0.3s ease-out',
            }}
            role="heading"
            aria-level={1}
          >
            <span className="pixi-intro-line pixi-intro-line--1">
              We are a brand
            </span>
            <span className="pixi-intro-line pixi-intro-line--2">
              of c<i>o</i>llective
            </span>
            <span className="pixi-intro-line pixi-intro-line--3">
              creat<i>i</i>v<i>i</i>ty
            </span>
          </h1>
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
                <circle cx="9" cy="9" r="8.5" stroke="white" strokeOpacity="0.5" />
                <circle cx="27" cy="9" r="8.5" stroke="white" strokeOpacity="0.5" />
                <circle cx="45" cy="9" r="8.5" stroke="white" strokeOpacity="0.5" />
              </svg>
            </div>

            <div className="pixi-intro-foot-items">
              <div className="pixi-intro-foot-item t-text-lg">
                <strong>Based in London</strong>
                <span className="pixi-intro-foot-sub">Born in Tokyo</span>
              </div>
              <div className="pixi-intro-foot-item t-text-lg">
                <strong>Design-driven</strong>
                <span className="pixi-intro-foot-sub">creative agency</span>
              </div>
              <div className="pixi-intro-foot-item t-text-lg">
                <strong>Branding, digital</strong>
                <span className="pixi-intro-foot-sub">and communications</span>
              </div>
            </div>

            <div className="pixi-intro-scroll-wrap">
              <svg viewBox="0 0 17 52" width="17" height="52" fill="none" aria-label="Scroll down indicator">
                <line x1="8.5" y1="0" x2="8.5" y2="42" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
                <path d="M2 38 L8.5 52 L15 38" stroke="white" strokeOpacity="0.5" strokeWidth="1" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
