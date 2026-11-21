import React, { useState } from 'react';
import { 
  GitBranch, 
  Layers, 
  Camera, 
  Tag, 
  PieChart, 
  Cpu, 
  CheckCircle2, 
  Eye, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Terminal,
  Activity,
  Code
} from 'lucide-react';
import { PIPELINE_STAGES } from '../utils/constants';

export default function PipelinePage({ setActivePage }) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const activeStage = PIPELINE_STAGES[activeStageIndex];

  return (
    <div className="space-y-12 pb-16 font-mono">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#76B900]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76B900]/10 border border-[#76B900]/30 text-[#76B900] text-xs mb-2">
            <GitBranch className="w-3.5 h-3.5" />
            <span>DEEP LEARNING METHODOLOGY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI Model Architecture & Pipeline
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            End-to-end computer vision workflow from dataset preparation to quantitative validation
          </p>
        </div>

        <button
          onClick={() => setActivePage('inspector')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#76B900] hover:bg-[#8AE000] text-black font-bold text-xs shadow-[0_0_15px_rgba(118,185,0,0.3)] transition-all"
        >
          <span>TEST LIVE MODEL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Animated Interactive Pipeline Stages Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>PIPELINE EXECUTION STAGES:</span>
          <span className="text-[#76B900]">Stage {activeStage.step} of 8: {activeStage.title}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={stage.step}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isActive
                    ? 'border-[#76B900] bg-[#76B900]/15 text-white shadow-[0_0_15px_rgba(118,185,0,0.25)]'
                    : 'border-gray-800 bg-[#0D120E] text-gray-400 hover:border-gray-700 hover:text-gray-200'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#76B900] shadow-[0_0_10px_#76B900]" />
                )}
                <div className="text-[10px] text-gray-500 font-bold">STAGE 0{stage.step}</div>
                <div className="text-xs font-bold truncate mt-1">{stage.title}</div>
                <div className="text-[9px] text-[#76B900] truncate mt-0.5">{stage.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Stage Details Card */}
      <div className="p-8 rounded-3xl bg-[#0D120E] border border-[#76B900]/30 shadow-[0_0_35px_rgba(118,185,0,0.1)] space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#131713] border border-[#76B900]/40 flex items-center justify-center text-[#76B900] font-extrabold text-lg">
              0{activeStage.step}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">{activeStage.title}</h2>
              <span className="text-xs text-[#76B900] font-mono">{activeStage.tag}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={activeStageIndex === 0}
              onClick={() => setActiveStageIndex(activeStageIndex - 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-300 disabled:opacity-30 hover:border-gray-500"
            >
              ◄ Previous
            </button>
            <button
              disabled={activeStageIndex === PIPELINE_STAGES.length - 1}
              onClick={() => setActiveStageIndex(activeStageIndex + 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-300 disabled:opacity-30 hover:border-gray-500"
            >
              Next Stage ►
            </button>
          </div>
        </div>

        {/* Stage Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h4 className="text-gray-400 uppercase text-[10px] tracking-wider mb-1">Stage Objective & Methodology</h4>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                {activeStage.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#131713] border border-gray-800 space-y-2">
              <h4 className="text-[#76B900] uppercase text-[10px] tracking-wider font-bold">Engineering Implementation Notes</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {activeStage.details}
              </p>
            </div>

            {/* Input & Output Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#151C15] border border-gray-800 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase block">Input Artifact</span>
                <span className="text-white font-bold block">{activeStage.input}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#151C15] border border-[#76B900]/25 space-y-1">
                <span className="text-[#76B900] text-[10px] uppercase block">Output Artifact</span>
                <span className="text-white font-bold block">{activeStage.output}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Code & Mathematics */}
          <div className="p-5 rounded-xl bg-[#080B0A] border border-gray-800 space-y-4">
            <div className="flex items-center gap-2 text-[#76B900] text-xs font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Technical Specification</span>
            </div>

            {activeStage.step === 1 && (
              <div className="space-y-2 text-[11px] text-gray-300">
                <p>Sensor Specs: 30 FPS CMOS dashcam</p>
                <p>Tilt Geometry: 20° forward inclination</p>
                <p>Illumination: 1000 - 80,000 Lux variation</p>
                <p>Weather Splits: Dry, Overcast, Wet</p>
              </div>
            )}

            {activeStage.step === 2 && (
              <div className="space-y-2 text-[11px] text-gray-300">
                <p>Resolution: 640 x 640 px</p>
                <p>Interpolation: Bilinear / Letterbox</p>
                <p>CLAHE Clip Limit: 2.0</p>
                <p>Tile Grid Size: 8 x 8</p>
              </div>
            )}

            {activeStage.step === 3 && (
              <div className="space-y-2 text-[11px] text-gray-300">
                <p>Format: YOLO Normalized (class x y w h)</p>
                <p>Classes: D00, D10, D20, D40</p>
                <p>Min Box Area: 0.05% image area</p>
                <p>Overlap NMS: IoU 0.50</p>
              </div>
            )}

            {activeStage.step === 4 && (
              <div className="space-y-2 text-[11px] text-gray-300">
                <p>Train Split: 70% (Model fitting)</p>
                <p>Val Split: 20% (Early stopping)</p>
                <p>Test Split: 10% (Generalization)</p>
                <p>Stratification: Class-proportional</p>
              </div>
            )}

            {activeStage.step === 5 && (
              <div className="space-y-2 text-[11px] text-gray-300">
                <p>Loss Function: Complete IoU (CIoU)</p>
                <p>Optimizer: AdamW (lr=0.001, wd=0.0005)</p>
                <p>Augmentations: Mosaic, Mixup, HSV</p>
                <p>Backbone: CSPDarknet53 + PANet</p>
              </div>
            )}

            {activeStage.step === 6 && (
              <div className="space-y-2 text-[11px] text-gray-300">
                <p>Metric: mAP@0.50 & mAP@0.50:0.95</p>
                <p>Patience: 15 epochs early stop</p>
                <p>Confidence Sweep: 0.05 - 0.90</p>
                <p>Validation Frequency: Every 1 epoch</p>
              </div>
            )}

            {activeStage.step === 7 && (
              <div className="space-y-2 text-[11px] text-gray-300">
                <p>Testing Domain: Unseen asphalt corridors</p>
                <p>Zero-Shot Tolerance: Surface texture changes</p>
                <p>Shadow Robustness: Tree/building occlusion</p>
                <p>False Positive Rate: &lt; 8.2%</p>
              </div>
            )}

            {activeStage.step === 8 && (
              <div className="space-y-2 text-[11px] text-gray-300">
                <p>mAP@50 (Benchmark): 0.628</p>
                <p>Mean Precision: 0.692</p>
                <p>Mean Recall: 0.641</p>
                <p>Reference: IEEE BigData RDD2020</p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Visual Neural Network Architecture Diagram */}
      <section className="p-8 rounded-3xl bg-[#0D120E] border border-[#76B900]/20 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white font-mono">
            YOLOv8 Neural Detection Network Architecture
          </h3>
          <p className="text-xs text-gray-400">
            Multi-scale feature pyramid with anchor-free decoupled detection heads for road distress
          </p>
        </div>

        {/* Interactive Diagram Block */}
        <div className="p-6 rounded-2xl bg-[#080B0A] border border-gray-800 overflow-x-auto">
          <div className="min-w-[700px] flex items-center justify-between gap-4 text-center text-xs">
            
            {/* Input Node */}
            <div className="p-4 rounded-xl bg-[#131713] border border-[#76B900]/40 w-40 space-y-1">
              <span className="text-[#76B900] font-bold block text-sm">INPUT TENSOR</span>
              <span className="text-gray-300 block font-mono">640 x 640 x 3</span>
              <span className="text-[10px] text-gray-500">RGB Road Surface</span>
            </div>

            <ArrowRight className="w-5 h-5 text-[#76B900] shrink-0" />

            {/* Backbone Node */}
            <div className="p-4 rounded-xl bg-[#131713] border border-sky-500/40 w-48 space-y-1">
              <span className="text-sky-400 font-bold block text-sm">CSP BACKBONE</span>
              <span className="text-gray-300 block font-mono">C2f Blocks + SPPF</span>
              <span className="text-[10px] text-gray-500">Multi-scale Receptive Field</span>
            </div>

            <ArrowRight className="w-5 h-5 text-sky-400 shrink-0" />

            {/* Neck Node */}
            <div className="p-4 rounded-xl bg-[#131713] border border-amber-500/40 w-48 space-y-1">
              <span className="text-amber-400 font-bold block text-sm">PANET NECK</span>
              <span className="text-gray-300 block font-mono">FPN + Top-Down Path</span>
              <span className="text-[10px] text-gray-500">Fine Crack Feature Fusion</span>
            </div>

            <ArrowRight className="w-5 h-5 text-amber-400 shrink-0" />

            {/* Head Node */}
            <div className="p-4 rounded-xl bg-[#131713] border border-red-500/40 w-48 space-y-1">
              <span className="text-red-400 font-bold block text-sm">DECOUPLED HEADS</span>
              <span className="text-gray-300 block font-mono">Anchor-Free Dets</span>
              <span className="text-[10px] text-gray-500">Class (4) + Box (CIoU)</span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
