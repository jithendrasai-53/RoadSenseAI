import React from 'react';
import { Cpu, CheckCircle, AlertCircle, Database } from 'lucide-react';

export default function StatusBadge({ isDemoMode, statusBadge, deviceUsed }) {
  if (isDemoMode) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-950/40 border border-sky-500/40 text-sky-400 font-mono text-xs shadow-[0_0_12px_rgba(56,189,248,0.2)]">
        <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="font-bold tracking-wide">
          {statusBadge || 'BENCHMARK DEMO MODE'}
        </span>
        <span className="text-[10px] text-sky-300/70 border-l border-sky-500/30 pl-2">
          Ground-Truth Reference
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#76B900]/10 border border-[#76B900]/40 text-[#76B900] font-mono text-xs shadow-[0_0_12px_rgba(118,185,0,0.2)]">
      <Cpu className="w-3.5 h-3.5 text-[#76B900] shrink-0" />
      <span className="font-bold tracking-wide">
        {statusBadge || 'LIVE YOLO INFERENCE'}
      </span>
      {deviceUsed && (
        <span className="text-[10px] text-gray-400 border-l border-[#76B900]/30 pl-2">
          {deviceUsed}
        </span>
      )}
    </div>
  );
}
