import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Sliders, 
  Scan, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Cpu, 
  Database,
  ArrowRight,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import ScanningEffect from '../components/ScanningEffect';
import StatusBadge from '../components/StatusBadge';
import BoundingBoxViewer from '../components/BoundingBoxViewer';
import { detectDamage, fetchSampleCatalog, API_BASE } from '../services/api';
import { DAMAGE_CLASSES } from '../utils/constants';

export default function InspectorPage({ 
  setActivePage, 
  latestInspection, 
  setLatestInspection, 
  systemStatus 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [samplesCatalog, setSamplesCatalog] = useState([]);
  const [confidence, setConfidence] = useState(0.15); // Initially 0.15 for diagnostic testing
  const [detectionMode, setDetectionMode] = useState('real'); // 'real' | 'demo'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showInteractiveBoxes, setShowInteractiveBoxes] = useState(false);
  const [hoveredDetId, setHoveredDetId] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch samples catalog on mount
  useEffect(() => {
    let isMounted = true;
    fetchSampleCatalog().then((samples) => {
      if (isMounted) setSamplesCatalog(samples);
    });
    return () => { isMounted = false; };
  }, []);

  // Handle local file selection
  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setErrorMessage("Please select a valid JPEG or PNG image file.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Image file exceeds 15MB limit.");
      return;
    }

    // Clear previous state & set to real live mode
    setErrorMessage(null);
    setSelectedSampleId(null);
    setSelectedFile(file);
    setLatestInspection(null); // Clear previous detections
    setDetectionMode('real');   // Custom uploads are strictly Live YOLO

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle selecting a pre-indexed benchmark sample
  const handleSelectSample = (sample) => {
    setSelectedFile(null);
    setSelectedSampleId(sample.id);
    setPreviewUrl(sample.image_url);
    setLatestInspection(null); // Clear previous detections
    setErrorMessage(null);
  };

  // Clear current selection
  const handleClear = () => {
    setSelectedFile(null);
    setSelectedSampleId(null);
    setPreviewUrl(null);
    setLatestInspection(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Trigger Detection API
  const handleRunDetection = async () => {
    if (!selectedFile && !selectedSampleId) {
      setErrorMessage("Please upload an asphalt image or select a benchmark sample to inspect.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await detectDamage({
        file: selectedFile,
        sample_id: selectedSampleId,
        confidence: confidence,
        mode: selectedFile ? 'real' : detectionMode,
      });

      setLatestInspection(result);
    } catch (err) {
      console.error("Detection failed:", err);
      setErrorMessage(err.message || "Failed to execute road damage detection.");
    } finally {
      setIsLoading(false);
    }
  };

  const deviceName = systemStatus?.hardware?.device_name || 'CPU';

  return (
    <div className="space-y-10 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#76B900]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76B900]/10 border border-[#76B900]/30 text-[#76B900] text-xs font-mono mb-2">
            <Scan className="w-3.5 h-3.5" />
            <span>PRIMARY INFERENCE WORKSPACE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-mono tracking-tight">
            Live AI Road Inspector
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
            Detect asphalt surface cracks, distress patterns, and pothole cavities via YOLO deep learning
          </p>
          {!systemStatus?.model_loaded && (
            <div className="mt-2 text-xs font-mono text-amber-300/90 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Backend standby (<code className="text-white bg-black/40 px-1 py-0.5 rounded">{API_BASE}</code>). Benchmark demo mode active below.</span>
            </div>
          )}
        </div>

        {/* Runtime Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#131713] border border-[#76B900]/25 font-mono text-xs flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${systemStatus?.model_loaded ? 'bg-[#76B900] shadow-[0_0_8px_#76B900]' : 'bg-amber-400 animate-pulse'}`} />
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Inference Hardware</span>
              <span className="text-white font-bold">{systemStatus?.model_loaded ? `${deviceName.split(' ')[0]} Active` : 'Offline / Standby'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls & Right Visual Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload & Configurations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Drag & Drop Area */}
          <div className="p-6 rounded-2xl bg-[#0D120E] border border-[#76B900]/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                1. Select Pavement Image
              </span>
              {previewUrl && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-mono"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragOver 
                  ? 'border-[#76B900] bg-[#76B900]/10' 
                  : 'border-gray-700 hover:border-[#76B900]/50 bg-[#131713]/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
              />
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#1A241A] border border-[#76B900]/30 flex items-center justify-center mx-auto text-[#76B900]">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-gray-200">
                  <span className="text-[#76B900] font-bold">Click to upload</span> or drag and drop
                </div>
                <p className="text-[10px] text-gray-500 font-mono">
                  Upload any road photo (JPEG / PNG) • Up to 15MB
                </p>
              </div>
            </div>

            {/* Benchmark Samples Gallery */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Or select test road sample:</span>
                <span className="text-[#76B900] text-[10px]">Pothole & RDD Dataset</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {samplesCatalog.map((sample) => {
                  const isSelected = selectedSampleId === sample.id;
                  const isPothole = sample.dominant_defect.includes('D40') || sample.dominant_defect.includes('Pothole');
                  return (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2.5 rounded-lg text-left border transition-all font-mono text-[10px] flex flex-col justify-between h-20 overflow-hidden ${
                        isSelected
                          ? 'border-[#76B900] bg-[#76B900]/15 text-white shadow-[0_0_12px_rgba(118,185,0,0.3)]'
                          : 'border-gray-800 bg-[#131713] text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold line-clamp-1 ${isPothole ? 'text-red-400' : 'text-[#76B900]'}`}>
                          {sample.dominant_defect}
                        </span>
                      </div>
                      <div className="text-[9px] text-gray-400 line-clamp-2">{sample.title}</div>
                      <span className="text-[#76B900] text-[8px] uppercase tracking-wider">Select Sample</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Model Inference Parameters */}
          <div className="p-6 rounded-2xl bg-[#0D120E] border border-[#76B900]/20 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-[#76B900]" />
              <span>2. Inference Parameters</span>
            </div>

            {/* Confidence Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300">Confidence Threshold:</span>
                <span className="font-bold text-[#76B900] bg-[#76B900]/15 px-2 py-0.5 rounded border border-[#76B900]/30">
                  {Math.round(confidence * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.90"
                step="0.05"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full accent-[#76B900] bg-gray-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>Higher Recall (5%)</span>
                <span>Default Diagnostic (15%)</span>
                <span>High Precision (90%)</span>
              </div>
            </div>

            {/* Execution Mode Selector */}
            <div className="space-y-2 pt-2 border-t border-gray-800">
              <label className="text-xs font-mono text-gray-300 block">Execution Pipeline Mode:</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setDetectionMode('real')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    detectionMode === 'real'
                      ? 'border-[#76B900] bg-[#76B900]/15 text-[#76B900]'
                      : 'border-gray-800 bg-[#131713] text-gray-400'
                  }`}
                >
                  <div className="font-bold">Live YOLO Model</div>
                  <div className="text-[10px] text-gray-400">Direct PyTorch execution</div>
                </button>

                <button
                  type="button"
                  disabled={!selectedSampleId}
                  onClick={() => setDetectionMode('demo')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedSampleId ? '' : 'opacity-40 cursor-not-allowed'
                  } ${
                    detectionMode === 'demo'
                      ? 'border-sky-500 bg-sky-950/40 text-sky-400'
                      : 'border-gray-800 bg-[#131713] text-gray-400'
                  }`}
                >
                  <div className="font-bold">Benchmark Demo</div>
                  <div className="text-[10px] text-gray-400">Ground truth reference</div>
                </button>
              </div>
              {!selectedSampleId && (
                <p className="text-[10px] text-gray-500 font-mono">
                  * Uploaded images always execute Live YOLO neural inference.
                </p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 font-mono text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-red-300 block">Connection Notice:</span>
                  <p className="text-[11px] leading-relaxed text-red-200/90">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Run Detection Button */}
            <button
              onClick={handleRunDetection}
              disabled={isLoading || (!selectedFile && !selectedSampleId)}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#76B900] hover:bg-[#8AE000] text-black font-mono font-bold text-sm shadow-[0_0_25px_rgba(118,185,0,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-98"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>RUNNING REAL YOLO INFERENCE...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 text-black" />
                  <span>RUN AI ROAD DETECTION</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Right Column: Visual Canvas & Detection Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-2xl bg-[#0D120E] border border-[#76B900]/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#76B900]" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Real-Time Inspection Viewport
                </span>
              </div>

              {latestInspection && (
                <div className="flex items-center gap-2">
                  <StatusBadge 
                    isDemoMode={latestInspection.is_demo_mode}
                    statusBadge={latestInspection.status_badge}
                    deviceUsed={latestInspection.device_used}
                  />
                  {latestInspection.detections?.length > 0 && (
                    <button
                      onClick={() => setShowInteractiveBoxes(!showInteractiveBoxes)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 border transition-all ${
                        showInteractiveBoxes 
                          ? 'bg-[#76B900] text-black border-[#76B900] font-bold' 
                          : 'bg-[#131713] text-gray-300 border-gray-700 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>{showInteractiveBoxes ? 'Interactive SVG' : 'Rendered PNG'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Image Canvas Box */}
            <div className="relative min-h-[380px] rounded-xl bg-black border border-gray-800 flex items-center justify-center overflow-hidden p-2">
              {previewUrl ? (
                <div className="relative w-full flex items-center justify-center">
                  {latestInspection && showInteractiveBoxes ? (
                    <BoundingBoxViewer
                      imageSrc={latestInspection.original_image}
                      detections={latestInspection.detections}
                      hoveredDetectionId={hoveredDetId}
                      setHoveredDetectionId={setHoveredDetId}
                      imageDimensions={latestInspection.image_dimensions || { width: 800, height: 600 }}
                    />
                  ) : (
                    <img
                      src={latestInspection?.annotated_image || previewUrl}
                      alt="Road Surface Preview"
                      className="w-full h-auto max-h-[500px] object-contain rounded-lg block"
                    />
                  )}
                  {/* Laser Scanning Animation */}
                  <ScanningEffect isScanning={isLoading} />
                </div>
              ) : (
                <div className="text-center p-8 space-y-3 font-mono text-gray-500">
                  <Scan className="w-12 h-12 text-gray-700 mx-auto" />
                  <p className="text-xs">No pavement image loaded.</p>
                  <p className="text-[11px] text-gray-600">
                    Upload an image or select a benchmark sample to activate AI inspection.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Result Summary Strip (When Inspection is ready) */}
            {latestInspection && (
              <div className="p-4 rounded-xl bg-[#131713] border border-[#76B900]/30 space-y-3 animate-in fade-in duration-300 font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#76B900]" />
                    <span className="font-bold text-white">Detection Complete:</span>
                    <span className="text-[#76B900] font-bold">
                      {latestInspection.total_detections} defect(s) detected
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      ({latestInspection.latency_ms} ms)
                    </span>
                  </div>

                  <button
                    onClick={() => setActivePage('results')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#76B900]/20 hover:bg-[#76B900]/30 border border-[#76B900]/40 text-[#76B900] text-xs font-bold transition-all"
                  >
                    <span>VIEW FULL TELEMETRY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Per-class count badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800 text-[11px]">
                  {Object.entries(latestInspection.class_counts || {}).map(([code, count]) => {
                    const classInfo = DAMAGE_CLASSES[code];
                    const isPothole = code === 'D40';
                    return (
                      <span
                        key={code}
                        className={`px-2.5 py-1 rounded-md border font-bold ${isPothole && count > 0 ? 'animate-pulse' : ''}`}
                        style={{
                          backgroundColor: `${classInfo?.color || '#76B900'}15`,
                          borderColor: `${classInfo?.color || '#76B900'}40`,
                          color: classInfo?.color || '#76B900'
                        }}
                      >
                        {code} ({classInfo?.title}): {count}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
