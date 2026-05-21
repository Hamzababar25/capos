'use client';

import { useEffect, useRef, useState } from 'react';
import './about.css';

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      
      // Calculate how much of the section is visible
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        
        // Smooth transition based on scroll progress
        float t = uTime * 0.1;
        
        // Coffee gradient colors matching hero theme
        vec3 color1 = vec3(0.12, 0.06, 0.03);    // Deep espresso (hero dark)
        vec3 color2 = vec3(0.28, 0.16, 0.10);    // Dark roasted
        vec3 color3 = vec3(0.55, 0.32, 0.18);    // Rich coffee brown (hero medium)
        vec3 color4 = vec3(0.75, 0.55, 0.40);    // Caramel
        vec3 color5 = vec3(0.92, 0.82, 0.68);    // Creamy latte (hero light)
        
        // Create flowing organic patterns
        float n1 = fbm(uv * 2.5 + vec2(t * 0.2, -t * 0.15));
        float n2 = fbm(uv * 3.2 + vec2(-t * 0.25, t * 0.2));
        float n3 = fbm(uv * 1.8 + vec2(t * 0.15, t * 0.18));
        
        // Diagonal flow (matching hero direction)
        float diagonal = (uv.x + uv.y) * 0.5;
        diagonal += sin(uv.x * 2.5 + t * 0.8) * 0.08;
        diagonal += cos(uv.y * 2.0 - t * 0.6) * 0.08;
        
        // Mix colors with noise (similar to hero but evolved)
        vec3 col = mix(color1, color2, smoothstep(0.0, 0.35, diagonal + n1 * 0.35));
        col = mix(col, color3, smoothstep(0.25, 0.55, diagonal + n2 * 0.3));
        col = mix(col, color4, smoothstep(0.45, 0.75, diagonal + n3 * 0.25));
        col = mix(col, color5, smoothstep(0.65, 1.0, n1 * 0.4 + n2 * 0.3));
        
        // Add subtle shimmer
        float shimmer = sin(uv.x * 8.0 + t * 1.5) * cos(uv.y * 8.0 - t * 1.2);
        col += vec3(shimmer * 0.015);
        
        // Gentle vignette
        float vignette = smoothstep(1.2, 0.2, length(uv - 0.5));
        col *= 0.65 + vignette * 0.35;
        
        // Fade in from top (blend with hero)
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
      {/* Animated gradient background */}
      <canvas ref={canvasRef} className="c-about-canvas" />
      
      <div className="c-about-inner container">
        <div className="c-about-head">
          <p className="c-about-label t-h6">About CAPOS</p>
        </div>

        <div className="c-about-body">
          <h2 className="c-about-title t-h1">
            Crafted<br />
            with pass<i>i</i><i>o</i>n
          </h2>

          <div className="c-about-text">
            <div className="c-about-text-inner">
              <p className="t-text-lg">
                At CAPOS, we believe exceptional coffee begins with deep respect for the craft.
                Every bean is carefully selected from sustainable farms around the world.
              </p>
              <p className="t-text-lg" style={{ marginTop: '24px' }}>
                Our roasters work in small batches to ensure perfect development,
                bringing out the unique characteristics of each origin.
                From farm to cup, quality is our commitment.
              </p>
              <div className="c-about-values">
                <div className="c-about-value">
                  <span className="c-about-value-num">01</span>
                  <div>
                    <h4 className="t-h6">Sustainable</h4>
                    <p className="t-text" style={{ color: '#8b7355', marginTop: '8px' }}>100% ethically sourced</p>
                  </div>
                </div>
                <div className="c-about-value">
                  <span className="c-about-value-num">02</span>
                  <div>
                    <h4 className="t-h6">Small Batch</h4>
                    <p className="t-text" style={{ color: '#8b7355', marginTop: '8px' }}>Roasted for peak flavor</p>
                  </div>
                </div>
                <div className="c-about-value">
                  <span className="c-about-value-num">03</span>
                  <div>
                    <h4 className="t-h6">Artisanal</h4>
                    <p className="t-text" style={{ color: '#8b7355', marginTop: '8px' }}>15+ years of expertise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
