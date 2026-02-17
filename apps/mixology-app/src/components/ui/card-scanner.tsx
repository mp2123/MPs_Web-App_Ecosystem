"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, ArrowLeftRight, ChevronsLeftRight, MousePointer2 } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue, useSpring, useInView } from 'framer-motion';

const recipes = [
  {
    name: "Paper Plane",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    id: "MIX-2026-DRINK-1002"
  },
  {
    name: "Negroni",
    imageUrl: "https://images.unsplash.com/photo-1536935338213-d2c1238f91c6?auto=format&fit=crop&q=80&w=800",
    id: "MIX-2026-DRINK-1001"
  },
  {
    name: "Last Word",
    imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800",
    id: "MIX-2026-DRINK-1003"
  },
  {
    name: "Old Fashioned",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    id: "MIX-2026-DRINK-1000"
  },
  {
    name: "Margarita",
    imageUrl: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800",
    id: "MIX-2026-DRINK-1004"
  },
];

const generateCode = (width: number, height: number, recipeName: string) => {
  const library = [
    `// RECIPE_MODULE: ${recipeName.toUpperCase().replace(/\s/g, '_')}`,
    "const SERVE_IMMEDIATELY = true;",
    "const CHILL_GLASS = 'coupe';",
    "const STIR_DURATION_MS = 20000;",
    "function calculateDilution(ice, stirTime) { return ice.quality * stirTime; }",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(null);
  const isInView = useInView(inViewRef, { once: false, margin: "-40%" });
  
  const x = useMotionValue(0);
  
  const stateRef = useRef({
    baseVelocity: 80,
    currentVelocity: 80,
    targetVelocity: 80,
    direction: -1,
    isHovering: false,
    scanningActive: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useAnimationFrame((time, delta) => {
    if (!mounted) return;

    stateRef.current.currentVelocity += (stateRef.current.targetVelocity - stateRef.current.currentVelocity) * 0.1;
    
    if (!stateRef.current.isHovering && stateRef.current.currentVelocity > stateRef.current.baseVelocity) {
        stateRef.current.targetVelocity *= 0.98;
    }

    const moveBy = (stateRef.current.currentVelocity * (delta / 1000)) * stateRef.current.direction;
    const cardWidth = 400 + 60;
    const singleSetWidth = cardWidth * recipes.length;
    
    let nextX = x.get() + moveBy;

    if (stateRef.current.direction === -1 && nextX < -singleSetWidth) {
      nextX += singleSetWidth;
    } else if (stateRef.current.direction === 1 && nextX > 0) {
      nextX -= singleSetWidth;
    }

    x.set(nextX);
    
    const scannerX = window.innerWidth / 2;
    let anyActive = false;
    const cards = containerRef.current?.querySelectorAll('.card-wrapper');
    
    cards?.forEach((card: any) => {
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

  if (!mounted) return <div className="h-[500px] w-full bg-black" />;

  return (
    <div 
        className="relative w-full h-[500px] bg-black overflow-hidden flex flex-col items-center justify-center group cursor-crosshair" 
        ref={containerRef}
        onMouseEnter={() => stateRef.current.isHovering = true}
        onMouseLeave={() => stateRef.current.isHovering = false}
        onMouseMove={(e) => {
            if (stateRef.current.isHovering) {
                const speed = Math.abs(e.movementX);
                stateRef.current.targetVelocity = Math.min(speed * 20 + 20, 800);
            }
        }}
    >
      <style>{`
        .card-wrapper { position: relative; width: 400px; height: 250px; flex-shrink: 0; perspective: 1000px; }
        .card { position: absolute; inset: 0; border-radius: 20px; overflow: hidden; }
        .card-normal { z-index: 2; clip-path: inset(0 0 0 var(--clip-right, 0%)); border: 1px solid rgba(255,255,255,0.1); }
        .card-ascii { z-index: 1; clip-path: inset(0 calc(100% - var(--clip-left, 0%)) 0 0); background: #050505; border: 1px solid #0ff; }
        .ascii-text { font-family: monospace; font-size: 10px; line-height: 1; color: #0ff; opacity: 0.7; white-space: pre; padding: 10px; }
      `}</style>
      
      {/* Swipe Arrow Indicator */}
      <motion.div
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-12 z-30 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="flex items-center gap-4">
          <ChevronsLeftRight className="h-6 w-6 text-primary/50" />
        </div>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/50">
          Hover & Swipe to Explore Recipes
        </p>
        <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-2"/>
      </motion.div>
      
      <div ref={inViewRef} className="absolute h-full w-full" />

      <motion.div className="flex items-center gap-[60px] will-change-transform" style={{ x }}>
        {[...recipes, ...recipes, ...recipes].map((recipe, i) => (
          <a href="#recipes" key={i} className="card-wrapper group/card">
            <div className="card card-normal">
              <img src={recipe.imageUrl} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" alt={recipe.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xl font-black uppercase tracking-tighter">{recipe.name}</p>
                <p className="font-mono text-xs tracking-widest opacity-60">{recipe.id}</p>
              </div>
            </div>
            <div className="card card-ascii">
              <div className="ascii-text">
                {generateCode(60, 20, recipe.name)}
              </div>
            </div>
          </a>
        ))}
      </motion.div>
    </div>
  );
};
