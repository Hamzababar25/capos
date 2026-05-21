'use client';

import { useEffect, useRef, useState } from 'react';
import './about.css';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Ethically Sourced',
    subtitle: 'From Farm to Cup',
    description: 'We work directly with farmers across the globe, ensuring fair trade practices and sustainable farming methods. Every bean tells a story of dedication and care.',
    image: '/capos1.PNG',
  },
  {
    id: 2,
    title: 'Small Batch Roasting',
    subtitle: 'Crafted with Precision',
    description: 'Our master roasters carefully develop each batch to bring out unique flavor profiles. Temperature, timing, and technique combine to create perfection in every cup.',
    image: '/capos2.PNG',
  },
  {
    id: 3,
    title: 'Artisanal Excellence',
    subtitle: '15+ Years of Expertise',
    description: 'Passion meets expertise in every roast. Our team brings decades of experience, constantly innovating while honoring traditional coffee craftsmanship.',
    image: '/capos3.PNG',
  },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Animated gradient canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.offsetHeight;
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
      uniform float uProgress;

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
        for(int i = 0; i < 6; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        
        float t = uTime * 0.1;
        
        vec3 color1 = vec3(0.12, 0.06, 0.03);
        vec3 color2 = vec3(0.28, 0.16, 0.10);
        vec3 color3 = vec3(0.55, 0.32, 0.18);
        vec3 color4 = vec3(0.75, 0.55, 0.40);
        vec3 color5 = vec3(0.92, 0.82, 0.68);
        
        float n1 = fbm(uv * 2.5 + vec2(t * 0.2, -t * 0.15));
        float n2 = fbm(uv * 3.2 + vec2(-t * 0.25, t * 0.2));
        float n3 = fbm(uv * 1.8 + vec2(t * 0.15, t * 0.18));
        
        float diagonal = (uv.x + uv.y) * 0.5;
        diagonal += sin(uv.x * 2.5 + t * 0.8) * 0.08;
        diagonal += cos(uv.y * 2.0 - t * 0.6) * 0.08;
        
        vec3 col = mix(color1, color2, smoothstep(0.0, 0.35, diagonal + n1 * 0.35));
        col = mix(col, color3, smoothstep(0.25, 0.55, diagonal + n2 * 0.3));
        col = mix(col, color4, smoothstep(0.45, 0.75, diagonal + n3 * 0.25));
        col = mix(col, color5, smoothstep(0.65, 1.0, n1 * 0.4 + n2 * 0.3));
        
        float shimmer = sin(uv.x * 8.0 + t * 1.5) * cos(uv.y * 8.0 - t * 1.2);
        col += vec3(shimmer * 0.015);
        
        float vignette = smoothstep(1.2, 0.2, length(uv - 0.5));
        col *= 0.65 + vignette * 0.35;
        
        float fadeTop = smoothstep(0.0, 0.15, uv.y);
        col *= fadeTop;
        
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
    const uProgressLoc = gl.getUniformLocation(prog, 'uProgress');

    let time = 0;
    const render = () => {
      time += 0.01;
      gl!.uniform1f(uTimeLoc, time);
      gl!.uniform2f(uResLoc, canvas.width, canvas.height);
      gl!.uniform1f(uProgressLoc, scrollProgress);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
    };
  }, [scrollProgress]);

  return (
    <section id="about" className="c-about" ref={ref}>
      <canvas ref={canvasRef} className="c-about-canvas" />
      
      <div className="c-about-slider">
        {/* Left side - Text content */}
        <div className="c-about-content">
          <p className="c-about-label t-h6">ABOUT CAPOS</p>
          
          <div className="c-about-text-wrapper">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`c-about-slide-text ${
                  index === currentSlide ? 'active' : ''
                } ${index < currentSlide ? 'prev' : ''} ${index > currentSlide ? 'next' : ''}`}
              >
                <h2 className="c-about-slide-title t-h2">{slide.title}</h2>
                <p className="c-about-slide-subtitle t-h6">{slide.subtitle}</p>
                <p className="c-about-slide-description t-text-lg">{slide.description}</p>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="c-about-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`c-about-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="c-about-arrows">
            <button className="c-about-arrow" onClick={prevSlide} aria-label="Previous slide">
              ←
            </button>
            <button className="c-about-arrow" onClick={nextSlide} aria-label="Next slide">
              →
            </button>
          </div>
        </div>

        {/* Right side - Images */}
        <div className="c-about-images">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`c-about-slide-image ${
                index === currentSlide ? 'active' : ''
              } ${index < currentSlide ? 'prev' : ''} ${index > currentSlide ? 'next' : ''}`}
            >
              <img src={slide.image} alt={slide.title} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
