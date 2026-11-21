import React, { useState } from 'react';
import { DAMAGE_CLASSES } from '../utils/constants';

export default function BoundingBoxViewer({ 
  imageSrc, 
  detections = [], 
  hoveredDetectionId, 
  setHoveredDetectionId,
  imageDimensions = { width: 800, height: 600 }
}) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const imgW = imageDimensions.width || 800;
  const imgH = imageDimensions.height || 600;

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black border border-[#76B900]/30 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
      {/* Base Road Image (w-full h-auto ensures natural aspect ratio without letterboxing) */}
      <img
        src={imageSrc}
        alt="Road Surface Inspection"
        className="w-full h-auto block select-none pointer-events-none"
      />

      {/* SVG Interactive Overlay Pixel-Locked to Original Image Coordinates */}
      <svg
        viewBox={`0 0 ${imgW} ${imgH}`}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {detections.map((det) => {
          const isHovered = hoveredDetectionId === det.id;
          const bbox = det.bbox || [0, 0, 0, 0];
          const x = Math.max(0, bbox[0]);
          const y = Math.max(0, bbox[1]);
          const w = Math.max(1, bbox[2] - bbox[0]);
          const h = Math.max(1, bbox[3] - bbox[1]);

          const classInfo = DAMAGE_CLASSES[det.class_code] || {
            color: '#EF4444',
            title: det.class_name || 'Damage'
          };
          const color = classInfo.color;

          // Corner bracket size proportional to bounding box
          const cornerLen = Math.min(22, Math.max(8, Math.round(w * 0.18)));

          // Tag dimensions
          const confText = `${Math.round((det.confidence || 0) * 100)}%`;
          const labelText = `${det.class_code} • ${confText}`;
          const tagW = Math.min(w, Math.max(80, labelText.length * 9));
          const tagH = 22;
          const tagY = y >= tagH + 2 ? y - tagH : y + 2;

          return (
            <g
              key={det.id}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => {
                setHoveredDetectionId?.(det.id);
                setActiveTooltip({
                  ...det,
                  screenX: x + w / 2,
                  screenY: y,
                });
              }}
              onMouseLeave={() => {
                setHoveredDetectionId?.(null);
                setActiveTooltip(null);
              }}
            >
              {/* Semi-transparent highlight fill */}
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={color}
                fillOpacity={isHovered ? 0.35 : 0.15}
                stroke={color}
                strokeWidth={isHovered ? 3.5 : 2}
                className="transition-all duration-200"
              />

              {/* Glowing Corner Accents */}
              <path
                d={`M ${x} ${y + cornerLen} L ${x} ${y} L ${x + cornerLen} ${y}`}
                fill="none"
                stroke={isHovered ? '#FFFFFF' : color}
                strokeWidth={isHovered ? 3.5 : 2.5}
              />
              <path
                d={`M ${x + w - cornerLen} ${y} L ${x + w} ${y} L ${x + w} ${y + cornerLen}`}
                fill="none"
                stroke={isHovered ? '#FFFFFF' : color}
                strokeWidth={isHovered ? 3.5 : 2.5}
              />
              <path
                d={`M ${x} ${y + h - cornerLen} L ${x} ${y + h} L ${x + cornerLen} ${y + h}`}
                fill="none"
                stroke={isHovered ? '#FFFFFF' : color}
                strokeWidth={isHovered ? 3.5 : 2.5}
              />
              <path
                d={`M ${x + w - cornerLen} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - cornerLen}`}
                fill="none"
                stroke={isHovered ? '#FFFFFF' : color}
                strokeWidth={isHovered ? 3.5 : 2.5}
              />

              {/* Tag Header */}
              <g transform={`translate(${x}, ${tagY})`}>
                <rect
                  x="0"
                  y="0"
                  width={tagW}
                  height={tagH}
                  fill="#080B0A"
                  fillOpacity="0.92"
                  stroke={color}
                  strokeWidth="1.2"
                  rx="3"
                />
                {/* Indicator chip */}
                <rect x="0" y="0" width="4" height={tagH} fill={color} rx="1" />
                <text
                  x="10"
                  y="15"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {labelText}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Floating HUD Tooltip when hovered */}
      {activeTooltip && (
        <div 
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ 
            left: `${(activeTooltip.screenX / imgW) * 100}%`,
            top: `${(activeTooltip.screenY / imgH) * 100}%`
          }}
        >
          <div className="bg-[#080B0A]/95 border border-[#76B900] p-2.5 rounded-lg shadow-[0_0_20px_rgba(118,185,0,0.5)] font-mono text-xs space-y-1 text-white">
            <div className="flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: DAMAGE_CLASSES[activeTooltip.class_code]?.color || '#EF4444' }} 
              />
              <span className="font-bold text-[#76B900]">
                {activeTooltip.class_code} — {activeTooltip.class_name}
              </span>
            </div>
            <div className="text-[11px] text-gray-300">
              Confidence: <span className="font-bold text-white">{Math.round((activeTooltip.confidence || 0) * 100)}%</span>
            </div>
            <div className="text-[10px] text-gray-400">
              Coordinates: [{activeTooltip.bbox?.join(', ')}]
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
