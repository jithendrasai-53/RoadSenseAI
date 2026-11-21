import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  ShieldCheck,
  Code
} from 'lucide-react';
import { generateInspectionPDF } from '../services/pdfGenerator';
import { PRIORITY_DISCLAIMER } from '../utils/constants';

export default function ReportModal({ isOpen, onClose, inspectionData }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !inspectionData) return null;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);
    try {
      await generateInspectionPDF(inspectionData);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert(`Error generating PDF report: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inspectionData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `road_sense_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const priority = inspectionData.priority_evaluation || {};
  const isDemo = inspectionData.is_demo_mode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D120E] border border-[#76B900]/40 rounded-2xl shadow-[0_0_40px_rgba(118,185,0,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#131713] border-b border-[#76B900]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#76B900]/10 border border-[#76B900]/30 text-[#76B900]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-base text-white">INSPECTION REPORT EXPORT</h3>
              <p className="font-mono text-xs text-gray-400">Generate executive PDF & structured data telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 font-mono text-xs">
          
          {/* Quick Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-[#151C15] border border-gray-800">
              <span className="text-gray-400 text-[10px] uppercase">Defects Detected</span>
              <div className="text-xl font-bold text-white mt-1">
                {inspectionData.total_detections || 0}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#151C15] border border-gray-800">
              <span className="text-gray-400 text-[10px] uppercase">Execution Mode</span>
              <div className={`text-xs font-bold mt-1 ${isDemo ? 'text-sky-400' : 'text-[#76B900]'}`}>
                {isDemo ? 'BENCHMARK DEMO' : 'LIVE YOLO'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#151C15] border border-gray-800">
              <span className="text-gray-400 text-[10px] uppercase">Inference Device</span>
              <div className="text-xs font-bold text-gray-300 mt-1 truncate">
                {inspectionData.device_used?.split(' ')[0] || 'CPU'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#151C15] border border-gray-800">
              <span className="text-gray-400 text-[10px] uppercase">Urgency Score</span>
              <div className="text-xl font-bold text-amber-400 mt-1">
                {priority.urgency_score || 0}<span className="text-xs text-gray-500">/100</span>
              </div>
            </div>
          </div>

          {/* Priority Summary */}
          <div className="p-4 rounded-xl bg-[#131713] border border-[#76B900]/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs uppercase">Experimental Triage Recommendation</span>
              <span 
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{ 
                  backgroundColor: `${priority.badge_color || '#76B900'}20`, 
                  color: priority.badge_color || '#76B900' 
                }}
              >
                {priority.priority_level || 'Normal'}
              </span>
            </div>
            <p className="text-gray-200 text-xs leading-relaxed">
              {priority.recommended_action}
            </p>
            <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-800 flex items-center justify-between">
              <span>Target Repair Window: <strong className="text-white">{priority.estimated_timeframe}</strong></span>
              <span>Distress Area: <strong className="text-white">{priority.area_coverage_percent || 0}%</strong></span>
            </div>
          </div>

          {/* Heuristic Disclaimer Alert */}
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-[11px] text-amber-300/90 leading-snug">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>{PRIORITY_DISCLAIMER}</p>
          </div>

          {/* Report Sections Breakdown */}
          <div className="space-y-2 text-gray-300 text-xs">
            <div className="font-semibold text-white">Included in Document:</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#76B900]" />
                <span>Executive Telemetry & Timestamp</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#76B900]" />
                <span>Original vs Annotated Imagery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#76B900]" />
                <span>Defect Quantitative Distribution</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#76B900]" />
                <span>Heuristic Priority & Action Protocol</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-[#131713] border-t border-[#76B900]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDownloadJSON}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E261E] hover:bg-[#253225] border border-gray-700 text-gray-200 font-mono text-xs transition-colors"
          >
            <Code className="w-4 h-4 text-gray-400" />
            <span>EXPORT RAW JSON</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#76B900] hover:bg-[#8AE000] text-black font-mono font-bold text-xs shadow-[0_0_20px_rgba(118,185,0,0.4)] disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>GENERATING PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span>DOWNLOADED!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-black" />
                  <span>DOWNLOAD INSPECTION PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
