"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, ArrowLeftRight } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

// --- Types & Constants ---
const cardImages = [
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1536935338213-d2c1238f91c6?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800",
];

// --- Helper Functions ---
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateCode = (width: number, height: number) => {
  const library = [
    "// compiled preview • scanner demo",
    "const SCAN_WIDTH = 8;",
    "const FADE_ZONE = 35;",
    "const MAX_PARTICLES = 2500;",
    "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
    "const now = () => performance.now();",
    "class Particle { constructor(x, y) { this.x = x; this.y = y; } }",
    "const state = { intensity: 1.2, particles: 2500 };",
    "if (state.intensity > 1) { scanner.glow += 0.01; }",
    "ctx.globalCompositeOperation = 'lighter';",
  ];

  let flow = library.join(" ").replace(/\s+/g, " ").trim();
  const totalChars = width * height;
  while (flow.length < totalChars + width) {
    flow += " " + library[randInt(0, library.length - 1)];
  }

  let out = "";
  let offset = 0;
  for (let row = 0; row < height; row++) {
    out += flow.slice(offset, offset + width) + (row < height - 1 ? "\n" : "");
    offset += width;
  }
  return out;
};

// --- Main Component ---
export const CardScanner = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [direction, setDirection] = useState(-1);
  const [velocity, setVelocity] = useState(120);
  const [mounted, setMounted] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const x = useMotionValue(0);
  
  const stateRef = useRef({
    velocity: 120,
    direction: -1,
    isAnimating: true,
    isDragging: false,
    scanningActive: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    stateRef.current.isAnimating = isAnimating;
    stateRef.current.direction = direction;
    stateRef.current.velocity = velocity;
  }, [isAnimating, direction, velocity]);

  // ASCII Glitch Loop
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      if (stateRef.current.scanningActive) {
        setGlitchTrigger(prev => prev + 1);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [mounted]);

  // --- Smooth Scroll Loop ---
  useAnimationFrame((time, delta) => {
    if (!mounted || !stateRef.current.isAnimating || stateRef.current.isDragging) return;

    const cardWidth = 400 + 60;
    const singleSetWidth = cardWidth * 10;
    
    const moveBy = (stateRef.current.velocity * (delta / 1000)) * stateRef.current.direction;
    let nextX = x.get() + moveBy;

    if (stateRef.current.direction === -1 && nextX < -singleSetWidth) {
      nextX += singleSetWidth;
    } else if (stateRef.current.direction === 1 && nextX > 0) {
      nextX -= singleSetWidth;
    }

    x.set(nextX);

    const scannerX = window.innerWidth / 2;
    let anyActive = false;
    const cards = document.querySelectorAll('.card-wrapper');
    
    cards.forEach((card: any) => {
      const rect = card.getBoundingClientRect();
      const normal = card.querySelector('.card-normal');
      const ascii = card.querySelector('.card-ascii');
      
      if (normal && ascii && rect.left < scannerX + 4 && rect.right > scannerX - 4) {
          anyActive = true;
          const intersect = ((scannerX - rect.left) / rect.width) * 100;
          normal.style.setProperty('--clip-right', `${intersect}%`);
          ascii.style.setProperty('--clip-left', `${intersect}%`);
      } else if (normal && ascii) {
          if (rect.right < scannerX) {
              normal.style.setProperty('--clip-right', '100%');
              ascii.style.setProperty('--clip-left', '100%');
          } else {
              normal.style.setProperty('--clip-right', '0%');
              ascii.style.setProperty('--clip-left', '0%');
          }
      }
    });
    stateRef.current.scanningActive = anyActive;
  });

  // --- Particle Systems ---
  useEffect(() => {
    if (!mounted || !particleCanvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2, window.innerWidth / 2,
      125, -125, 1, 1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
      canvas: particleCanvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, 250);

    const count = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const vels = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      alphas[i] = Math.random();
      vels[i] = Math.random() * 60 + 30;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.0;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(0.5, 0.7, 1.0, vAlpha * 0.5);
        }
      `
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frame: number;
    const animate = () => {
      const posAttr = geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        posAttr.array[i * 3] += vels[i] * 0.016;
        if (posAttr.array[i * 3] > window.innerWidth / 2 + 100) {
          posAttr.array[i * 3] = -window.innerWidth / 2 - 100;
        }
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      renderer.dispose();
    };
  }, [mounted]);

  // --- Scanner 2D Logic ---
  useEffect(() => {
    if (!mounted || !scannerCanvasRef.current) return;
    const canvas = scannerCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    let w = window.innerWidth;
    let h = 300;
    canvas.width = w;
    canvas.height = h;

    interface Particle {
        x: number; y: number; vx: number; vy: number; radius: number; alpha: number; life: number; decay: number;
    }
    let particles: Particle[] = [];
    
    const createParticle = (scanning: boolean): Particle => ({
      x: w / 2 + (Math.random() - 0.5) * 4,
      y: Math.random() * h,
      vx: (Math.random() * 0.8 + 0.2) * (scanning ? 2 : 1),
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.2,
      alpha: Math.random() * 0.5 + 0.5,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.005
    });

    let frame: number;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      
      const grad = ctx.createLinearGradient(w/2-2, 0, w/2+2, 0);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, stateRef.current.scanningActive ? '#0ff' : '#444');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(w/2-2, 0, 4, h);

      if (Math.random() < (stateRef.current.scanningActive ? 0.9 : 0.2)) {
        particles.push(createParticle(stateRef.current.scanningActive));
      }

      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) return false;
        ctx.globalAlpha = p.alpha * p.life;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fill();
        return p.x < w + 10;
      });

      frame = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(frame);
  }, [mounted]);

  if (!mounted) return <div className="h-[500px] w-full bg-black" />;

  return (
    <div className="relative w-full h-[500px] bg-black overflow-hidden flex items-center justify-center group" ref={containerRef}>
      <style>{`
        .card-wrapper { position: relative; width: 400px; height: 250px; flex-shrink: 0; perspective: 1000px; }
        .card { position: absolute; inset: 0; border-radius: 20px; overflow: hidden; transition: transform 0.3s ease; }
        .card-normal { z-index: 2; clip-path: inset(0 0 0 var(--clip-right, 0%)); border: 1px solid rgba(255,255,255,0.1); }
        .card-ascii { z-index: 1; clip-path: inset(0 calc(100% - var(--clip-left, 0%)) 0 0); background: #050505; border: 1px solid #0ff; }
        .ascii-text { font-family: monospace; font-size: 10px; line-height: 1; color: #0ff; opacity: 0.7; white-space: pre; padding: 10px; }
        .scanner-glow { 
            position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
            width: 2px; height: 320px; background: #0ff; 
            box-shadow: 0 0 20px #0ff, 0 0 40px #0ff; z-index: 20;
            opacity: 0; transition: opacity 0.3s;
        }
        .scanning .scanner-glow { opacity: 1; }
      `}</style>

      {/* Controls */}
      <div className="absolute top-6 left-6 z-30 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="outline" size="sm" className="rounded-full bg-white/10 backdrop-blur-md border-white/20" 
            onClick={() => {
                stateRef.current.isAnimating = !stateRef.current.isAnimating;
                setIsAnimating(stateRef.current.isAnimating);
            }}>
          {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-white/10 backdrop-blur-md border-white/20"
            onClick={() => {
                x.set(0);
            }}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-white/10 backdrop-blur-md border-white/20"
            onClick={() => {
                stateRef.current.direction *= -1;
                setDirection(stateRef.current.direction);
            }}>
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-6 right-6 z-30 text-xs font-mono text-white/40">
        SCAN_VELOCITY: {Math.round(velocity)} PX/S
      </div>

      <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none" />
      <canvas ref={scannerCanvasRef} className="absolute inset-0 pointer-events-none z-20" />

      <div className={cn("scanner-glow", stateRef.current.scanningActive && "opacity-100")} />

      <motion.div className="flex items-center gap-[60px] will-change-transform pointer-events-none" 
           style={{ x }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="card-wrapper">
            <div className="card card-normal">
              <img src={cardImages[i % cardImages.length]} className="w-full h-full object-cover" alt="Card" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-[8px] uppercase tracking-widest opacity-60">Recipe ID</p>
                <p className="font-mono text-sm tracking-[4px]">MIX-2026-DRINK-{1000 + (i % 10)}</p>
              </div>
            </div>
            <div className="card card-ascii">
              <div className="ascii-text">
                {generateCode(60, 20)}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="absolute bottom-6 flex flex-col items-center gap-2 z-30">
        <div className="text-[10px] font-mono text-white/20 tracking-[5px] uppercase text-center max-w-md leading-relaxed px-4">
            Forged in the furnace of high-velocity service and refined by an obsession with analytical precision.
        </div>
        <div className="text-[8px] font-mono text-white/10 uppercase mt-2">
            Inspired by <a href="https://evervault.com/" target="_blank" className="hover:text-primary transition-colors">@evervault.com</a>
        </div>
      </div>
    </div>
  );
};
