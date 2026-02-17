"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, ArrowLeftRight, ChevronsLeftRight, MousePointer2 } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue, useSpring, useInView } from 'framer-motion';

const policies = [
  { name: "Term Life 20", imageUrl: "https://images.unsplash.com/photo-1611926520333-8a0a5d2a4c6?auto=format&fit=crop&q=80&w=800", id: "AZ-2026-LIFE-1000" },
  { name: "Whole Life Secure", imageUrl: "https://images.unsplash.com/photo-1559526324-c1f275fbfa32?auto=format&fit=crop&q=80&w=800", id: "AZ-2026-LIFE-1001" },
  { name: "Universal Life Flex", imageUrl: "https://images.unsplash.com/photo-1600880292210-f79a4a7a7a5e?auto=format&fit=crop&q=80&w=800", id: "AZ-2026-LIFE-1002" },
  { name: "Variable Life Growth", imageUrl: "https://images.unsplash.com/photo-1554224155-8d044b4045f8?auto=format&fit=crop&q=80&w=800", id: "AZ-2026-LIFE-1003" },
  { name: "Final Expense Shield", imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059ee212?auto=format&fit=crop&q=80&w=800", id: "AZ-2026-LIFE-1004" },
];

const generateCode = (width: number, height: number, policyName: string) => {
  const library = [
    `// POLICY_MODULE: ${policyName.toUpperCase().replace(/\s/g, '_')}`,
    "const COVERAGE_AMT = 500000;",
    "const PREMIUM_FREQ = 'MONTHLY';",
    "const UNDERWRITING_CLASS = 'PREFERRED';",
    "function calculateCashValue(premiums, interest) { return premiums * (1 + interest); }",
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
    const singleSetWidth = cardWidth * policies.length;
    
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
      
      <motion.div
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-12 z-30 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="flex items-center gap-4">
          <ChevronsLeftRight className="h-6 w-6 text-primary/50" />
        </div>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/50">
          Hover & Swipe to Explore Policy Types
        </p>
        <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-2"/>
      </motion.div>
      
      <div ref={inViewRef} className="absolute h-full w-full" />

      <motion.div className="flex items-center gap-[60px] will-change-transform" style={{ x }}>
        {[...policies, ...policies, ...policies].map((policy, i) => (
          <a href="#questions" key={i} className="card-wrapper group/card">
            <div className="card card-normal">
              <img src={policy.imageUrl} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" alt={policy.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xl font-black uppercase tracking-tighter">{policy.name}</p>
                <p className="font-mono text-xs tracking-widest opacity-60">{policy.id}</p>
              </div>
            </div>
            <div className="card card-ascii">
              <div className="ascii-text">
                {generateCode(60, 20, policy.name)}
              </div>
            </div>
          </a>
        ))}
      </motion.div>
    </div>
  );
};
