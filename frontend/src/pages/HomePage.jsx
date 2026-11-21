import React from 'react';
import { 
  Scan, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  Database,
  Crosshair,
  TrendingUp,
  FileText
} from 'lucide-react';
import { DAMAGE_CLASSES } from '../utils/constants';

export default function HomePage({ setActivePage, systemStatus }) {
  const isModelLoaded = systemStatus?.model_loaded;
  const deviceName = systemStatus?.hardware?.device_name || 'CPU';

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#131713] via-[#0D120E] to-[#080B0A] border border-[#76B900]/30 shadow-[0_0_50px_rgba(118,185,0,0.15)] p-8 sm:p-14">
        
        {/* Background Grid Pattern & Glowing Radial Orbs */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#76B900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#76B900]/10 rounded-full blur-3xl pointer-events-none" />

        {/* HUD Scanning Line across hero */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-0.5 bg-[#76B900]/40 shadow-[0_0_15px_#76B900] animate-scan" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A231A] border border-[#76B900]/40 text-[#76B900] text-xs font-mono shadow-[0_0_15px_rgba(118,185,0,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#76B900] animate-ping" />
            <span className="font-bold tracking-wider">DEEP LEARNING COMPUTER VISION SYSTEM</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-mono">
              ROAD SENSE <span className="text-[#76B900] drop-shadow-[0_0_25px_rgba(118,185,0,0.6)]">AI</span>
            </h1>
            <p className="text-lg sm:text-2xl text-gray-200 font-medium">
              Intelligent Road Damage Detection Powered by Deep Learning
            </p>
            <p className="text-sm sm:text-base text-[#76B900] font-mono tracking-widest font-semibold uppercase">
              Detect. Analyze. Prioritize. Repair.
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Automating asphalt distress recognition through trained YOLO convolutional neural networks.
            Classifying longitudinal cracks, transverse cracks, alligator fractures, and severe potholes
            with real-time bounding box delineation and experimental maintenance triage.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActivePage('inspector')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#76B900] hover:bg-[#8AE000] text-black font-mono font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(118,185,0,0.45)] hover:shadow-[0_0_45px_rgba(118,185,0,0.7)] transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Scan className="w-5 h-5" />
              <span>LAUNCH AI INSPECTOR</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('pipeline')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#131713] hover:bg-[#1C231C] border border-[#76B900]/30 hover:border-[#76B900] text-gray-200 font-mono text-sm transition-all"
            >
              <Layers className="w-4 h-4 text-[#76B900]" />
              <span>EXPLORE AI WORKFLOW</span>
            </button>
          </div>

          {/* Telemetry Bar */}
          <div className="pt-8 border-t border-[#76B900]/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#080B0A]/70 border border-gray-800">
              <span className="text-gray-500 text-[10px] uppercase block">Runtime Device</span>
              <span className="text-white font-bold truncate block">{deviceName.split(' ')[0]}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#080B0A]/70 border border-gray-800">
              <span className="text-gray-500 text-[10px] uppercase block">Model Architecture</span>
              <span className="text-[#76B900] font-bold block">Ultralytics YOLOv8</span>
            </div>
            <div className="p-3 rounded-lg bg-[#080B0A]/70 border border-gray-800">
              <span className="text-gray-500 text-[10px] uppercase block">Benchmark mAP@50</span>
              <span className="text-white font-bold block">62.8% (RDD2020)</span>
            </div>
            <div className="p-3 rounded-lg bg-[#080B0A]/70 border border-gray-800">
              <span className="text-gray-500 text-[10px] uppercase block">Target Classes</span>
              <span className="text-white font-bold block">D00, D10, D20, D40</span>
            </div>
          </div>

        </div>
      </section>

      {/* How the System Works */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76B900]/10 border border-[#76B900]/30 text-[#76B900] text-xs font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>OPERATIONAL ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            How The AI Inspection System Works
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            From raw surface image input to quantitative defect localization and maintenance reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: '01',
              title: 'Image Ingestion',
              desc: 'Upload high-resolution asphalt imagery or select pre-indexed benchmark test samples from standard pavement surveys.',
              icon: Scan,
            },
            {
              num: '02',
              title: 'YOLO Feature Extraction',
              desc: 'Deep convolutional backbone and Path Aggregation Network (PANet) extract multi-scale spatial distress features.',
              icon: Cpu,
            },
            {
              num: '03',
              title: 'Defect Localization',
              desc: 'Detection heads predict precise bounding boxes, damage classification codes (D00-D40), and model confidence scores.',
              icon: Crosshair,
            },
            {
              num: '04',
              title: 'Triage & Reporting',
              desc: 'Calculates rule-based repair urgency estimates and generates structured JSON telemetry and downloadable PDF inspection reports.',
              icon: FileText,
            },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="relative p-6 rounded-2xl bg-[#0D120E] border border-[#76B900]/20 hover:border-[#76B900]/50 transition-all group hover:shadow-[0_0_25px_rgba(118,185,0,0.15)]"
              >
                <div className="text-3xl font-extrabold text-[#76B900]/20 group-hover:text-[#76B900]/40 font-mono transition-colors">
                  {step.num}
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#76B900]" />
                    <h3 className="font-bold text-base text-white font-mono">{step.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Damage Categories */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76B900]/10 border border-[#76B900]/30 text-[#76B900] text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>IEEE RDD2020 TAXONOMY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            Supported Road Damage Categories
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Standardized damage classifications established for automated pavement maintenance surveys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(DAMAGE_CLASSES).map(([code, item]) => (
            <div 
              key={code}
              className="p-5 rounded-2xl bg-[#0D120E] border border-gray-800 hover:border-[#76B900]/40 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span 
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold"
                  style={{ backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}
                >
                  {item.code}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              </div>

              <div>
                <h3 className="font-bold text-base text-white font-mono">{item.title}</h3>
                <span className="text-[11px] text-gray-400 font-mono block mt-0.5">{item.category}</span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-3 border-t border-gray-800/80 text-[11px] text-gray-400 font-mono">
                <strong className="text-gray-300">Engineering Protocol:</strong>
                <p className="mt-1 text-gray-400 line-clamp-2">{item.repairGuideline}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="p-8 rounded-3xl bg-[#0D120E] border border-[#76B900]/20 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-mono">Engineered With Modern Deep Learning Stack</h3>
            <p className="text-xs text-gray-400 font-mono">State-of-the-art computer vision libraries and robust full-stack architecture</p>
          </div>
          <button
            onClick={() => setActivePage('about')}
            className="text-xs text-[#76B900] hover:underline font-mono flex items-center gap-1"
          >
            <span>Learn About Project Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center font-mono">
          {[
            { name: 'Ultralytics YOLO', role: 'Object Detection', color: '#76B900' },
            { name: 'PyTorch 2.x', role: 'Tensor Runtime', color: '#EE4C2C' },
            { name: 'FastAPI', role: 'Asynchronous API', color: '#009688' },
            { name: 'OpenCV / PIL', role: 'Image Processing', color: '#5C3EE8' },
            { name: 'React 19 + Vite', role: 'Responsive Frontend', color: '#61DAFB' },
            { name: 'Tailwind CSS', role: 'NVIDIA HUD Design', color: '#38BDF8' },
          ].map((tech, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#131713] border border-gray-800 space-y-1">
              <span className="font-bold text-xs text-white block">{tech.name}</span>
              <span className="text-[10px] text-gray-400 block">{tech.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#131713] via-[#1A241A] to-[#131713] border border-[#76B900]/40 text-center space-y-5 shadow-[0_0_40px_rgba(118,185,0,0.2)]">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
          Ready to Inspect Road Surfaces with AI?
        </h2>
        <p className="text-sm text-gray-300 max-w-xl mx-auto">
          Upload any asphalt pavement image or choose from pre-indexed benchmark test road images to execute real-time YOLO defect localization.
        </p>
        <button
          onClick={() => setActivePage('inspector')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#76B900] hover:bg-[#8AE000] text-black font-mono font-bold text-sm shadow-[0_0_25px_rgba(118,185,0,0.5)] transition-all"
        >
          <Scan className="w-4 h-4" />
          <span>START AI INSPECTION NOW</span>
        </button>
      </section>

    </div>
  );
}
