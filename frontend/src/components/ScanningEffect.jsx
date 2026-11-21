import React from 'react';

export default function ScanningEffect({ isScanning = false }) {
  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-xl">
      {/* Moving green laser line */}
      <div className="absolute left-0 right-0 h-1 bg-[#76B900] shadow-[0_0_20px_#76B900,0_0_40px_#76B900] animate-hud-scan opacity-90" />
      
      {/* Subtle laser sheen gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#76B900]/10 via-transparent to-[#76B900]/5 animate-pulse" />

      {/* Futuristic HUD Corner Reticles */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#76B900]" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#76B900]" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#76B900]" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#76B900]" />

      {/* Telemetry Scanning Banner */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#080B0A]/90 border border-[#76B900] text-[#76B900] font-mono text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(118,185,0,0.5)]">
        <span className="w-2 h-2 rounded-full bg-[#76B900] animate-ping" />
        <span>NEURAL INFERENCE ACTIVE • SCANNING ROAD SURFACE...</span>
      </div>
    </div>
  );
}
