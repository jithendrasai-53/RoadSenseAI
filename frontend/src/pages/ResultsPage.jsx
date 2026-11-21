import React, { useState } from 'react';
import { 
  FileCheck, 
  Download, 
  FileText, 
  Code, 
  Layers, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  Maximize2,
  Cpu
} from 'lucide-react';
import ComparisonSlider from '../components/ComparisonSlider';
import BoundingBoxViewer from '../components/BoundingBoxViewer';
import StatusBadge from '../components/StatusBadge';
import ReportModal from '../components/ReportModal';
import { DAMAGE_CLASSES, PRIORITY_DISCLAIMER } from '../utils/constants';

export default function ResultsPage({ latestInspection, setActivePage }) {
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'interactive'
  const [hoveredDetectionId, setHoveredDetectionId] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // If user hasn't run detection yet, show empty state prompt
  if (!latestInspection) {
    return (
      <div className="py-20 text-center space-y-6 max-w-xl mx-auto font-mono">
        <div className="w-16 h-16 rounded-2xl bg-[#131713] border border-[#76B900]/30 flex items-center justify-center mx-auto text-[#76B900]">
          <FileCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Inspection Telemetry Available</h2>
          <p className="text-xs text-gray-400">
            Run an AI inspection on the Live Inspector page or select a benchmark sample to generate defect bounding boxes and telemetry.
          </p>
        </div>
        <button
          onClick={() => setActivePage('inspector')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#76B900] text-black font-bold text-xs shadow-[0_0_20px_rgba(118,185,0,0.4)]"
        >
          <span>GO TO LIVE AI INSPECTOR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const detections = latestInspection.detections || [];
  const classCounts = latestInspection.class_counts || {};
  const priority = latestInspection.priority_evaluation || {};
  const isDemo = latestInspection.is_demo_mode;

  // Download annotated image
  const handleDownloadAnnotatedImage = () => {
    if (!latestInspection.annotated_image) return;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = latestInspection.annotated_image;
    downloadAnchor.download = `road_sense_annotated_${Date.now()}.jpg`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Download raw JSON
  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(latestInspection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `road_sense_detections_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-10 pb-16 font-mono">
      
      {/* Page Header & Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#76B900]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76B900]/10 border border-[#76B900]/30 text-[#76B900] text-xs mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            <span>INSPECTION TELEMETRY DOSSIER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Inspection Results & Analysis
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Timestamp: {latestInspection.timestamp} • Latency: {latestInspection.latency_ms} ms
          </p>
        </div>

        {/* Status Badge & Export Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge 
            isDemoMode={isDemo}
            statusBadge={latestInspection.status_badge}
            deviceUsed={latestInspection.device_used}
          />

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#76B900] hover:bg-[#8AE000] text-black font-bold text-xs shadow-[0_0_15px_rgba(118,185,0,0.3)] transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>GENERATE PDF REPORT</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D120E] border border-gray-800 space-y-1">
          <span className="text-gray-400 text-[10px] uppercase block">Total Defect Count</span>
          <div className="text-2xl font-bold text-white">
            {latestInspection.total_detections}
          </div>
          <span className="text-[10px] text-gray-500">Above {Math.round((latestInspection.confidence_threshold || 0.25) * 100)}% conf</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D120E] border border-gray-800 space-y-1">
          <span className="text-gray-400 text-[10px] uppercase block">Dominant Distress</span>
          <div className="text-lg font-bold text-[#76B900] truncate">
            {detections.length > 0 ? detections[0].class_code : 'None'}
          </div>
          <span className="text-[10px] text-gray-400 truncate block">
            {detections.length > 0 ? detections[0].class_name : 'Clear road'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D120E] border border-gray-800 space-y-1">
          <span className="text-gray-400 text-[10px] uppercase block">Heuristic Priority</span>
          <div 
            className="text-base font-bold truncate"
            style={{ color: priority.badge_color || '#76B900' }}
          >
            {priority.priority_level?.split('—')[0] || 'Normal'}
          </div>
          <span className="text-[10px] text-gray-500">Urgency: {priority.urgency_score || 0}/100</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D120E] border border-gray-800 space-y-1">
          <span className="text-gray-400 text-[10px] uppercase block">Inference Device</span>
          <div className="text-base font-bold text-white truncate">
            {latestInspection.device_used?.split(' ')[0] || 'CPU'}
          </div>
          <span className="text-[10px] text-[#76B900]">{latestInspection.latency_ms} ms</span>
        </div>
      </div>

      {/* Visual Inspection Section: Mode Switcher + Canvas */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Visual Inspection Delineation
            </span>
            <span className="text-gray-500 text-xs">({detections.length} region bounding boxes)</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-lg bg-[#131713] border border-gray-800 text-xs">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'slider' 
                  ? 'bg-[#76B900] text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Before/After Splitter</span>
            </button>

            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'interactive' 
                  ? 'bg-[#76B900] text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive Box Highlight</span>
            </button>
          </div>
        </div>

        {/* Visual Viewer */}
        {viewMode === 'slider' ? (
          <ComparisonSlider
            originalImage={latestInspection.original_image}
            annotatedImage={latestInspection.annotated_image}
            height={500}
          />
        ) : (
          <BoundingBoxViewer
            imageSrc={latestInspection.original_image}
            detections={detections}
            hoveredDetectionId={hoveredDetectionId}
            setHoveredDetectionId={setHoveredDetectionId}
            imageDimensions={latestInspection.image_dimensions || { width: 800, height: 600 }}
          />
        )}

        {/* Download Buttons below canvas */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 text-xs">
          <button
            onClick={handleDownloadAnnotatedImage}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#131713] hover:bg-[#1C241C] border border-gray-700 text-gray-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#76B900]" />
            <span>Download Annotated Image</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#131713] hover:bg-[#1C241C] border border-gray-700 text-gray-200 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-sky-400" />
            <span>Download JSON Data</span>
          </button>
        </div>

      </div>

      {/* Category Breakdown & Detailed Defect Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Detailed Detection Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Individual Defect Registry ({detections.length})
            </h3>
            <span className="text-[11px] text-gray-400">Hover row to highlight bounding box</span>
          </div>

          {detections.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#0D120E] border border-gray-800 text-center text-gray-400 text-xs">
              No defect bounding boxes detected above the confidence threshold.
            </div>
          ) : (
            <div className="rounded-xl border border-gray-800 bg-[#0D120E] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#131713] text-gray-400 border-b border-gray-800 text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Defect ID</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Bounding Box [X1, Y1, X2, Y2]</th>
                      <th className="py-3 px-4">Surface Area</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/80">
                    {detections.map((det) => {
                      const isHovered = hoveredDetectionId === det.id;
                      const classInfo = DAMAGE_CLASSES[det.class_code];
                      const bbox = det.bbox || [0, 0, 0, 0];

                      return (
                        <tr
                          key={det.id}
                          onMouseEnter={() => setHoveredDetectionId(det.id)}
                          onMouseLeave={() => setHoveredDetectionId(null)}
                          className={`transition-colors cursor-pointer ${
                            isHovered 
                              ? 'bg-[#76B900]/15 text-white' 
                              : 'hover:bg-white/5 text-gray-300'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold font-mono">
                            {det.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: classInfo?.color || '#76B900' }}
                              />
                              <span className="font-bold">{det.class_code}</span>
                              <span className="text-gray-400 text-[11px] hidden sm:inline">
                                ({det.class_name})
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-[#76B900]">
                            {Math.round((det.confidence || 0) * 100)}%
                          </td>
                          <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                            [{bbox.join(', ')}]
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {det.area_percent ? `${det.area_percent}%` : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Heuristic Maintenance Triage (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Priority Card */}
          <div className="p-6 rounded-2xl bg-[#0D120E] border border-[#76B900]/25 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Maintenance Triage
              </span>
              <span 
                className="px-2.5 py-0.5 rounded text-[10px] font-bold"
                style={{ 
                  backgroundColor: `${priority.badge_color || '#76B900'}20`, 
                  color: priority.badge_color || '#76B900' 
                }}
              >
                {priority.priority_level?.split('—')[0] || 'Normal'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">
                {priority.urgency_score || 0}
                <span className="text-xs text-gray-500 font-normal"> / 100 Urgency Index</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${priority.urgency_score || 0}%`,
                    backgroundColor: priority.badge_color || '#76B900' 
                  }}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-800 text-xs">
              <span className="text-gray-400 font-bold block">Recommended Action:</span>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                {priority.recommended_action}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400 space-y-1">
              <div>Target Window: <strong className="text-white">{priority.estimated_timeframe}</strong></div>
              <div>Estimated Defect Area: <strong className="text-white">{priority.area_coverage_percent || 0}%</strong></div>
            </div>

            {/* Disclaimer Alert */}
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2 text-[10px] text-amber-300/90 leading-tight">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>{PRIORITY_DISCLAIMER}</p>
            </div>

          </div>

          {/* Category Count Summary */}
          <div className="p-5 rounded-2xl bg-[#0D120E] border border-gray-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Category Distribution
            </span>
            <div className="space-y-2">
              {Object.entries(DAMAGE_CLASSES).map(([code, item]) => {
                const count = classCounts[code] || 0;
                return (
                  <div key={code} className="flex items-center justify-between text-xs p-2 rounded bg-[#131713]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-white">{code}</span>
                      <span className="text-gray-400 text-[11px] truncate">{item.title}</span>
                    </div>
                    <span 
                      className="px-2 py-0.5 rounded font-bold text-xs"
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* PDF Inspection Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        inspectionData={latestInspection}
      />

    </div>
  );
}
