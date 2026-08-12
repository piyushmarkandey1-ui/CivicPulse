"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface BeforeAfterExample {
  id: string;
  title: string;
  ward: string;
  beforeImg: string;
  afterImg: string;
}

export default function BeforeAfterSlider({ data }: { data: BeforeAfterExample }) {
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isResizing) return;
    e.preventDefault();
    handleMove(e.clientX);
  }, [isResizing, handleMove]);

  const handlePointerUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isResizing, handlePointerMove, handlePointerUp]);

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/[0.08]" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
      <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white text-sm">{data.title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{data.ward}</p>
        </div>
        <Badge label="Verified Fix" variant="green" />
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-64 select-none touch-none overflow-hidden cursor-crosshair"
        onPointerDown={(e) => {
          setIsResizing(true);
          handleMove(e.clientX);
        }}
      >
        {/* After Image (Background) */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${data.afterImg})` }}
        >
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 text-white text-xs font-bold backdrop-blur-md">
            AFTER
          </div>
        </div>

        {/* Before Image (Foreground, clipped) */}
        <div 
          className="absolute inset-0 h-full bg-cover bg-center border-r-2 border-teal transition-none"
          style={{ 
            backgroundImage: `url(${data.beforeImg})`,
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
        >
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 text-white text-xs font-bold backdrop-blur-md">
            BEFORE
          </div>
        </div>

        {/* Draggable Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-teal cursor-col-resize z-10 hover:bg-teal-light active:bg-teal-light transition-colors"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-navy border-2 border-teal flex items-center justify-center shadow-lg" style={{ boxShadow: "0 0 15px rgba(20,184,166,0.6)" }}>
            <MoveHorizontal className="h-4 w-4 text-teal" />
          </div>
        </div>
      </div>
    </div>
  );
}
