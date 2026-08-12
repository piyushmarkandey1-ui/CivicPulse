"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      handleMove(e.clientX);
    },
    [isResizing, handleMove]
  );

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
    <div className="rounded-2xl overflow-hidden bg-white border border-[#DED8CD] shadow-[0_4px_20px_rgba(36,34,34,0.06)]">
      <div className="p-4 border-b border-[#DED8CD] flex items-center justify-between bg-[#F7F4ED]">
        <div>
          <h4 className="font-bold text-[#242222] text-xs">{data.title}</h4>
          <p className="text-[11px] text-[#625E59] mt-0.5">{data.ward}</p>
        </div>
        <Badge label="Verified Municipal Fix" variant="success" />
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
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-[#242222]/80 text-white text-[10px] font-bold">
            AFTER REPAIR
          </div>
        </div>

        {/* Before Image (Foreground, clipped) */}
        <div
          className="absolute inset-0 h-full bg-cover bg-center border-r-2 border-[#8B2635] transition-none"
          style={{
            backgroundImage: `url(${data.beforeImg})`,
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#242222]/80 text-white text-[10px] font-bold">
            BEFORE (INCIDENT)
          </div>
        </div>

        {/* Draggable Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#8B2635] cursor-col-resize z-10"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#8B2635] text-white border-2 border-white flex items-center justify-center shadow-md">
            <MoveHorizontal className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
