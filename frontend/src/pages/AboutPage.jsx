import React from 'react';
import { 
  Info, 
  Target, 
  Cpu, 
  Layers, 
  AlertTriangle, 
  Rocket, 
  ShieldCheck, 
  Building2, 
  CloudSun,
  Smartphone,
  Video,
  Zap,
  MapPin
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-16 font-mono">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-[#76B900]/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76B900]/10 border border-[#76B900]/30 text-[#76B900] text-xs mb-2">
          <Info className="w-3.5 h-3.5" />
          <span>PROJECT DOSSIER & DOCUMENTATION</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          About Road Sense AI
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Comprehensive project background, methodology, civil applications, limitations, and future scope
        </p>
      </div>

      {/* Problem Statement & Objectives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Problem Statement Card */}
        <div className="p-8 rounded-3xl bg-[#0D120E] border border-gray-800 space-y-4">
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Problem Statement</span>
          </div>
          <h2 className="text-xl font-bold text-white">The Infrastructure Maintenance Crisis</h2>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Modern transportation infrastructure experiences severe wear due to increasing heavy traffic loads, 
            thermal expansion, moisture infiltration, and freeze-thaw cycles. Traditional road surface inspection 
            relies heavily on manual visual surveys, specialized laser profiler vans, or citizen complaints.
          </p>
          <ul className="space-y-2 text-xs text-gray-400 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-[#76B900] font-bold">▪</span>
              <span><strong>Manual surveys are dangerous & slow:</strong> Field inspectors are exposed to active traffic risks and can only cover limited roadway kilometers per day.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#76B900] font-bold">▪</span>
              <span><strong>Specialized survey vehicles are cost-prohibitive:</strong> Automated laser profilometers cost upwards of $250,000, making regular scans infeasible for municipal councils.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#76B900] font-bold">▪</span>
              <span><strong>Delayed pothole repair causes severe accidents:</strong> Unaddressed potholes lead to vehicle suspension failures, tire blowouts, and severe motorcycle crashes.</span>
            </li>
          </ul>
        </div>

        {/* Project Objectives Card */}
        <div className="p-8 rounded-3xl bg-[#0D120E] border border-[#76B900]/30 space-y-4 shadow-[0_0_25px_rgba(118,185,0,0.1)]">
          <div className="flex items-center gap-2 text-[#76B900] text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Project Objectives</span>
          </div>
          <h2 className="text-xl font-bold text-white">Automating Pavement Distress Triage</h2>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Road Sense AI was engineered during an AI Computer Vision internship to demonstrate a scalable, 
            cost-effective deep learning solution for automated road damage classification and reporting.
          </p>
          <ul className="space-y-2 text-xs text-gray-300 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-[#76B900] font-bold">✓</span>
              <span><strong>Deep Learning Localization:</strong> Train an anchor-free YOLO model on the standardized IEEE RDD2020 road damage dataset.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#76B900] font-bold">✓</span>
              <span><strong>Standardized Taxonomy:</strong> Classify longitudinal cracks (D00), transverse cracks (D10), alligator fatigue (D20), and potholes (D40).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#76B900] font-bold">✓</span>
              <span><strong>Actionable Triage:</strong> Provide heuristic maintenance prioritization to assist municipal engineering teams in scheduling repairs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#76B900] font-bold">✓</span>
              <span><strong>Executive Reporting:</strong> Automatically generate downloadable structured JSON telemetry and formal PDF engineering dossiers.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* AI Methodology & Technical Rationale */}
      <section className="p-8 rounded-3xl bg-[#0D120E] border border-gray-800 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#76B900] text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>AI Methodology</span>
          </div>
          <h2 className="text-xl font-bold text-white">Computer Vision Architectural Rationale</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          <div className="p-4 rounded-2xl bg-[#131713] border border-gray-800 space-y-2">
            <h3 className="font-bold text-white font-mono text-sm">Why Object Detection over Classification?</h3>
            <p className="text-gray-300 leading-relaxed">
              Whole-image classification only indicates whether a distress exists somewhere on the frame. 
              In contrast, bounding box object detection precisely localizes spatial coordinates, calculates surface area coverage, 
              and identifies multiple co-occurring defects on a single roadway segment.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131713] border border-gray-800 space-y-2">
            <h3 className="font-bold text-white font-mono text-sm">Why YOLO over Two-Stage R-CNN?</h3>
            <p className="text-gray-300 leading-relaxed">
              Two-stage detectors (like Faster R-CNN) suffer from high computational overhead (~120-180 ms latency). 
              Ultralytics YOLO processes frames in a single unified forward pass (~18-25 ms), making it suitable for 
              eventual embedded deployment on moving road inspection vehicles.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131713] border border-gray-800 space-y-2">
            <h3 className="font-bold text-white font-mono text-sm">Why Heuristic Priority vs Black-Box?</h3>
            <p className="text-gray-300 leading-relaxed">
              Pavement engineers require transparent, explainable triage logic. Our priority estimate combines detected 
              defect counts, established engineering severity weights (e.g. Potholes &gt; Alligator &gt; Longitudinal), 
              and relative surface area percentages rather than unverified neural predictions.
            </p>
          </div>
        </div>
      </section>

      {/* Real-World Civil Engineering Applications */}
      <section className="p-8 rounded-3xl bg-[#0D120E] border border-gray-800 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#76B900] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Civil Applications</span>
          </div>
          <h2 className="text-xl font-bold text-white">Municipal & Highway Maintenance Applications</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
          <div className="p-4 rounded-xl bg-[#131713] border border-gray-800 space-y-2">
            <div className="font-bold text-white font-mono">Municipal Road Audits</div>
            <p className="text-gray-400 leading-relaxed">
              Routine quarterly scans of city streets to detect micro-cracks before they expand into vehicle-damaging potholes.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#131713] border border-gray-800 space-y-2">
            <div className="font-bold text-white font-mono">Toll Highway Monitoring</div>
            <p className="text-gray-400 leading-relaxed">
              Automated compliance auditing for highway concessionaires to guarantee pavement surface smoothness.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#131713] border border-gray-800 space-y-2">
            <div className="font-bold text-white font-mono">Monsoon Damage Triage</div>
            <p className="text-gray-400 leading-relaxed">
              Rapid post-storm assessment to immediately triage flooded potholes and collapsed asphalt patches.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#131713] border border-gray-800 space-y-2">
            <div className="font-bold text-white font-mono">Maintenance Budgeting</div>
            <p className="text-gray-400 leading-relaxed">
              Data-backed allocation of annual resurfacing budgets based on quantitative defect density.
            </p>
          </div>
        </div>
      </section>

      {/* Challenges & Practical Limitations */}
      <section className="p-8 rounded-3xl bg-[#0D120E] border border-amber-500/30 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Challenges & Limitations</span>
          </div>
          <h2 className="text-xl font-bold text-white">Known Edge Cases & Operational Constraints</h2>
          <p className="text-xs text-gray-400">
            Real-world road inspection encounters complex environmental noise that current models must navigate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          <div className="p-4 rounded-xl bg-[#131713] border border-gray-800 space-y-2">
            <div className="font-bold text-white font-mono">Dynamic Tree & Overhead Shadows</div>
            <p className="text-gray-400 leading-relaxed">
              High-contrast shadows cast by roadside foliage and overpasses can mimic linear longitudinal fissures, requiring CLAHE normalization.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#131713] border border-gray-800 space-y-2">
            <div className="font-bold text-white font-mono">Water Puddles & Asphalt Glare</div>
            <p className="text-gray-400 leading-relaxed">
              Standing rainwater obscures cavity depth and produces specular sunlight reflections that challenge RGB cameras.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#131713] border border-gray-800 space-y-2">
            <div className="font-bold text-white font-mono">Gravel & Unpaved Roadways</div>
            <p className="text-gray-400 leading-relaxed">
              The model is specifically trained on bituminous asphalt pavement. Unpaved, cobblestone, or gravel roads fall outside the operational domain.
            </p>
          </div>
        </div>
      </section>

      {/* Future Scope - Clearly labeled as future research possibilities */}
      <section className="p-8 rounded-3xl bg-gradient-to-b from-[#131713] to-[#0D120E] border border-[#76B900]/40 space-y-6 shadow-[0_0_35px_rgba(118,185,0,0.15)]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#76B900] text-xs font-bold uppercase tracking-wider">
              <Rocket className="w-4 h-4" />
              <span>Future Research Roadmap</span>
            </div>
            <h2 className="text-xl font-bold text-white">Future Possibilities (Not Current Features)</h2>
            <p className="text-xs text-gray-400">
              The following capabilities represent active research frontiers for future development iterations:
            </p>
          </div>

          <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-[#76B900]/10 border border-[#76B900]/30 text-[#76B900] text-[10px] font-bold">
            FUTURE SCOPE ONLY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-sans">
          
          <div className="p-5 rounded-2xl bg-[#080B0A] border border-gray-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#151C15] border border-[#76B900]/30 flex items-center justify-center text-[#76B900]">
              <Video className="w-4 h-4" />
            </div>
            <div className="font-bold text-white font-mono text-xs">Real-Time Video Stream Inference</div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Processing continuous dashcam video streams at 30 FPS with ByteTrack object tracking to prevent duplicate counting of defects across consecutive frames.
            </p>
            <span className="text-[10px] text-amber-400 font-mono block">Status: Planned Future Work</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#080B0A] border border-gray-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#151C15] border border-[#76B900]/30 flex items-center justify-center text-[#76B900]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="font-bold text-white font-mono text-xs">Native Mobile App Deployment</div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Deploying lightweight models via CoreML (iOS) and TFLite (Android) mounted on vehicle dashboards for crowdsourced city surveys.
            </p>
            <span className="text-[10px] text-amber-400 font-mono block">Status: Planned Future Work</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#080B0A] border border-gray-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#151C15] border border-[#76B900]/30 flex items-center justify-center text-[#76B900]">
              <Zap className="w-4 h-4" />
            </div>
            <div className="font-bold text-white font-mono text-xs">Edge Hardware Acceleration</div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              FP16 and INT8 TensorRT quantization for deployment on low-power NVIDIA Jetson Orin Nano edge computers installed on maintenance trucks.
            </p>
            <span className="text-[10px] text-amber-400 font-mono block">Status: Planned Future Work</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#080B0A] border border-gray-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#151C15] border border-[#76B900]/30 flex items-center justify-center text-[#76B900]">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="font-bold text-white font-mono text-xs">GIS Spatial Hazard Heatmapping</div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Pairing camera coordinates with RTK-GPS receivers to plot interactive OpenStreetMap pavement degradation heatmaps for municipal public works.
            </p>
            <span className="text-[10px] text-amber-400 font-mono block">Status: Planned Future Work</span>
          </div>

        </div>
      </section>

    </div>
  );
}
