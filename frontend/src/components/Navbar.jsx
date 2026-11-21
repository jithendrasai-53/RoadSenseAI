import React, { useState } from 'react';
import { 
  Scan, 
  Cpu, 
  BarChart2, 
  GitBranch, 
  Info, 
  Layers, 
  FileCheck, 
  Menu, 
  X,
  Activity
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, systemStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Overview', icon: Layers },
    { id: 'inspector', label: 'Live AI Inspector', icon: Scan, isPrimary: true },
    { id: 'results', label: 'Inspection Results', icon: FileCheck },
    { id: 'pipeline', label: 'AI Workflow', icon: GitBranch },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart2 },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isModelLoaded = systemStatus?.model_loaded;
  const deviceName = systemStatus?.hardware?.device_type?.toUpperCase() || 'CPU';

  return (
    <header className="sticky top-0 z-50 bg-[#080B0A]/90 backdrop-blur-md border-b border-[#76B900]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-lg bg-[#131713] border border-[#76B900]/40 flex items-center justify-center group-hover:border-[#76B900] group-hover:shadow-[0_0_15px_rgba(118,185,0,0.4)] transition-all">
              <Scan className="w-5 h-5 text-[#76B900]" />
              <div className="absolute inset-0 rounded-lg border border-[#76B900]/20 animate-pulse pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white font-mono">ROAD SENSE</span>
                <span className="bg-[#76B900] text-black font-extrabold text-xs px-1.5 py-0.5 rounded font-mono">AI</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono tracking-tight hidden sm:block">
                DEEP LEARNING PAVEMENT INSPECTION
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono transition-all ${
                    isActive
                      ? 'bg-[#76B900]/15 text-[#76B900] border border-[#76B900]/40 shadow-[0_0_12px_rgba(118,185,0,0.2)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#76B900]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status & CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* System Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131713] border border-[#76B900]/25 text-[11px] font-mono">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isModelLoaded ? 'bg-[#76B900]' : 'bg-amber-400'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isModelLoaded ? 'bg-[#76B900]' : 'bg-amber-500'}`} />
              </span>
              <span className="text-gray-300">
                {isModelLoaded ? `YOLO ${deviceName}` : 'DEMO READY'}
              </span>
            </div>

            <button
              onClick={() => handleNavClick('inspector')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#76B900] hover:bg-[#8AE000] text-black font-semibold text-xs font-mono transition-all shadow-[0_0_15px_rgba(118,185,0,0.3)] hover:shadow-[0_0_25px_rgba(118,185,0,0.6)] active:scale-95"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>LAUNCH INSPECTOR</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#131713] border border-[#76B900]/30 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D120E] border-b border-[#76B900]/20 px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono ${
                  isActive
                    ? 'bg-[#76B900]/15 text-[#76B900] border border-[#76B900]/40'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-[#76B900]/20">
            <button
              onClick={() => handleNavClick('inspector')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#76B900] text-black font-bold font-mono text-sm shadow-[0_0_15px_rgba(118,185,0,0.4)]"
            >
              <Scan className="w-4 h-4" />
              <span>LAUNCH INSPECTOR</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
