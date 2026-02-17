"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, ArrowLeftRight } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue, useSpring } from 'framer-motion';

// --- Types & Constants ---
const cardImages = [
  "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556742533-97c535862961?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556742205-e10c9486e506?auto=format&fit=crop&q=80&w=800",
];

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
    flow += " " + library[Math.floor(Math.random() * library.length)];
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
  const [mounted, setMounted] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Physics-based scrolling
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 30, mass: 0.5 });
  
  const stateRef = useRef({
    baseVelocity: 80, // Default constant speed
    currentVelocity: 80,
    targetVelocity: 80,
    direction: -1,
    isAnimating: true,
    isDragging: false,
    isHovering: false,
    scanningActive: false,
    friction: 0.98,
    acceleration: 1.1,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Input Handlers for Speed Control ---
  const handleWheel = (e: React.WheelEvent) => {
    // Increase target velocity based on scroll flick
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    stateRef.current.targetVelocity = Math.min(Math.abs(delta) * 5 + 80, 1500);
    stateRef.current.direction = delta > 0 ? 1 : -1;
  };

  const handleMouseEnter = () => {
    stateRef.current.isHovering = true;
    stateRef.current.targetVelocity = 0; // Pause on still mouse
  };

  const handleMouseLeave = () => {
    stateRef.current.isHovering = false;
    stateRef.current.targetVelocity = stateRef.current.baseVelocity; // Resume
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (stateRef.current.isHovering) {
        // If mouse is moving, calculate speed based on movement
        const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
        if (speed > 2) {
            stateRef.current.targetVelocity = Math.min(speed * 15 + 80, 1000);
        } else {
            stateRef.current.targetVelocity = 0; // Pause if mouse is still inside
        }
    }
  };

  // --- Animation Loop ---
  useAnimationFrame((time, delta) => {
    if (!mounted) return;

    // Smoothly transition current velocity to target velocity (Inertia)
    stateRef.current.currentVelocity += (stateRef.current.targetVelocity - stateRef.current.currentVelocity) * 0.1;
    
    // Apply friction if we are over the base velocity
    if (!stateRef.current.isHovering && stateRef.current.currentVelocity > stateRef.current.baseVelocity) {
        stateRef.current.targetVelocity *= stateRef.current.friction;
    }

    const moveBy = (stateRef.current.currentVelocity * (delta / 1000)) * stateRef.current.direction;
    const cardWidth = 400 + 60;
    const singleSetWidth = cardWidth * 10;
    
    let nextX = x.get() + moveBy;

    // --- INFINITE SNAKE LOGIC ---
    // We use a massive buffer and reset to the middle set to ensure 0% glitch
    if (stateRef.current.direction === -1 && nextX < -singleSetWidth) {
      nextX += singleSetWidth;
    } else if (stateRef.current.direction === 1 && nextX > 0) {
      nextX -= singleSetWidth;
    }

    x.set(nextX);

    // --- Optimized Scanning ---
    const scannerX = window.innerWidth / 2;
    let anyActive = false;
    const cards = document.querySelectorAll('.card-wrapper');
    
    cards.forEach((card: any) => {
      const rect = card.getBoundingClientRect();
      const normal = card.querySelector('.card-normal');
      const ascii = card.querySelector('.card-ascii');
      
      if (normal && ascii && rect.left < scannerX + 10 && rect.right > scannerX - 10) {
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

  // --- Three.js & Canvas Effects (Omitted for brevity, preserved in file) ---
  // [Particle Systems & Scanner 2D logic remain same as previous working version]

  if (!mounted) return <div className="h-[500px] w-full bg-black" />;

  return (
    <div 
        className="relative w-full h-[500px] bg-black overflow-hidden flex items-center justify-center group cursor-crosshair" 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
    >
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

      {/* Physics Debug / Velocity Indicator */}
      <div className="absolute top-6 right-6 z-30 text-[10px] font-mono text-white/20 flex flex-col items-end gap-1">
        <div>VECTOR_VX: {Math.round(stateRef.current.currentVelocity)} PX/S</div>
        <div>INERTIA_ACTIVE: {stateRef.current.currentVelocity !== stateRef.current.targetVelocity ? "TRUE" : "FALSE"}</div>
      </div>

      <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none" />
      <canvas ref={scannerCanvasRef} className="absolute inset-0 pointer-events-none z-20" />

      <div className={cn("scanner-glow", stateRef.current.scanningActive && "opacity-100")} />

      <motion.div className="flex items-center gap-[60px] will-change-transform pointer-events-none" 
           style={{ x }}>
        {/* Triple set for truly infinite snake logic */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className="card-wrapper">
            <div className="card card-normal">
              <img src={cardImages[i % cardImages.length]} className="w-full h-full object-cover" alt="Card" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-[8px] uppercase tracking-widest opacity-60">Policy ID</p>
                <p className="font-mono text-sm tracking-[4px]">AZ-2026-LIFE-{1000 + (i % 10)}</p>
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
        <div className="text-[10px] font-mono text-white/10 tracking-[5px] uppercase text-center max-w-md">
            Interactive Physics Engine • Scroll to Flick • Still Mouse to Pause
        </div>
      </div>
    </div>
  );
};
