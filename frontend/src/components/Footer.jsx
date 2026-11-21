import React from 'react';
import { Scan, ShieldAlert, Cpu, Heart, ExternalLink } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-[#080B0A] border-t border-[#76B900]/20 text-gray-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-[#76B900]" />
              <span className="font-extrabold text-base text-white tracking-wider">ROAD SENSE AI</span>
              <span className="bg-[#76B900]/20 text-[#76B900] text-[10px] px-2 py-0.5 rounded border border-[#76B900]/40">v1.0</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-md">
              Automatic road surface distress recognition system powered by deep convolutional neural networks.
              Standardized on IEEE Road Damage Detection Challenge taxonomy for automated civil infrastructure maintenance.
            </p>
            <p className="text-[#76B900] font-semibold text-xs tracking-wider">
              Tagline: Detect. Analyze. Prioritize. Repair.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Platform Navigation</div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setActivePage('inspector')} className="hover:text-[#76B900] transition-colors">
                  → Live AI Inspector
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('results')} className="hover:text-[#76B900] transition-colors">
                  → Inspection Results
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('pipeline')} className="hover:text-[#76B900] transition-colors">
                  → Deep Learning Workflow
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('analytics')} className="hover:text-[#76B900] transition-colors">
                  → Performance Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Integrity */}
          <div className="space-y-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Research & Integrity</div>
            <div className="p-3 rounded bg-[#131713] border border-[#76B900]/20 text-[11px] space-y-1 text-gray-300">
              <div className="flex items-center gap-1.5 text-[#76B900] font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Ethical AI Disclosure</span>
              </div>
              <p className="text-[10px] text-gray-400">
                Evaluation metrics and hardware stats are genuine. Repair urgency recommendations are experimental heuristics.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} ROAD SENSE AI. Academic & Engineering Demonstration Project.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#76B900]" />
              <span>Ultralytics YOLO • PyTorch • FastAPI • React</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
