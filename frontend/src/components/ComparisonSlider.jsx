import React, { useState, useRef, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function ComparisonSlider({ originalImage, annotatedImage, height = 480 }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative select-none rounded-xl overflow-hidden border border-[#76B900]/30 shadow-[0_0_25px_rgba(0,0,0,0.6)] bg-black">
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden cursor-ew-resize"
        style={{ height: `${height}px` }}
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={(e) => handleMove(e.clientX)}
      >
        {/* Layer 1: AI Annotated Image (Underneath, full width) */}
        <img
          src={annotatedImage}
          alt="AI Annotated Road Defect Detection"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Top-Right Label (AI Annotated) */}
        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded bg-[#080B0A]/80 border border-[#76B900]/50 text-[#76B900] font-mono text-[11px] font-bold shadow-md">
          AI DETECTED OVERLAY
        </div>

        {/* Layer 2: Original Image (Clipped by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalImage}
            alt="Original Road Surface"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%', maxWidth: 'none' }}
          />

          {/* Top-Left Label (Original) */}
          <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-[#080B0A]/80 border border-gray-600 text-gray-200 font-mono text-[11px] font-bold shadow-md">
            ORIGINAL ROAD SURFACE
          </div>
        </div>

        {/* Draggable Vertical Splitter Line */}
        <div
          className="absolute top-0 bottom-0 z-20 w-0.5 bg-[#76B900] shadow-[0_0_12px_#76B900] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Centered Handle Pill */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#080B0A] border-2 border-[#76B900] shadow-[0_0_15px_rgba(118,185,0,0.8)] flex items-center justify-center text-[#76B900]">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Slider controls footer */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#131713] border-t border-[#76B900]/20 text-xs font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Left: Raw Input Image</span>
        </div>
        <div className="text-[11px] text-[#76B900] hidden sm:block">
          ◄ Drag Splitter to Inspect Defect Boundaries ►
        </div>
        <div className="flex items-center gap-2">
          <span>Right: YOLO Detections</span>
          <span className="w-2 h-2 rounded-full bg-[#76B900]" />
        </div>
      </div>
    </div>
  );
}
