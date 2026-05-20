'use client';

import { useEffect, useRef } from 'react';
import './hero.css';

export default function GradientHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

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
      precision mediump float;
      uniform float uTime;
      uniform vec2 uResolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;

        vec3 c1 = vec3(0.086, 0.145, 0.294);
        vec3 c2 = vec3(0.137, 0.255, 0.541);
        vec3 c3 = vec3(0.667, 0.875, 0.851);
        vec3 c4 = vec3(0.902, 0.310, 0.059);

        float t = uTime * 0.18;
        float n1 = sin(uv.x * 2.5 + t) * cos(uv.y * 1.8 - t * 0.7) * 0.5 + 0.5;
        float n2 = sin(uv.x * 1.3 - t * 0.5) * cos(uv.y * 2.8 + t * 0.9) * 0.5 + 0.5;
        float n3 = sin((uv.x + uv.y) * 2.1 + t * 1.1) * 0.5 + 0.5;

        vec3 col = mix(c1, c2, n1);
        col = mix(col, c3, n2 * 0.45);
        col = mix(col, c4, n3 * 0.25);

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

    let t = 0;
    const render = () => {
      t += 0.01;
      gl!.uniform1f(uTimeLoc, t);
      gl!.uniform2f(uResLoc, canvas.width, canvas.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <section className="pixi-intro">
      {/* WebGL canvas */}
      <canvas ref={canvasRef} className="pixi-intro-canvas" />

      {/* Content */}
      <div className="pixi-intro-inner container">
        <div className="pixi-intro-center">
          <h1 className="pixi-intro-title t-h1">
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

        <div className="pixi-intro-foot">
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
              <svg viewBox="0 0 17 52" width="17" height="52" fill="none">
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
