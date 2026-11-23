/**
 * API Service for Road Sense AI
 */

import { DEFAULT_SAMPLE_CATALOG, DAMAGE_CLASSES } from '../utils/constants';

let rawBackendUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
if (rawBackendUrl.endsWith('/api')) {
  rawBackendUrl = rawBackendUrl.slice(0, -4);
}
export const BACKEND_URL = rawBackendUrl;
export const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

export async function fetchSystemStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Status check returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("API status check failed:", err.message);
    return {
      model_loaded: false,
      hardware: { device_name: "Local Client / Offline Mode", is_gpu_accelerated: false },
      load_error: `Backend unreachable at ${API_BASE}. Free Render services may take ~45s to wake from sleep.`
    };
  }
}

export async function fetchSampleCatalog() {
  try {
    const res = await fetch(`${API_BASE}/samples`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Samples fetch returned ${res.status}`);
    const data = await res.json();
    if (data.samples && data.samples.length > 0) {
      return data.samples.map(s => ({
        ...s,
        image_url: s.image_url?.startsWith('http') ? s.image_url : (BACKEND_URL ? `${BACKEND_URL}${s.image_url}` : s.image_url)
      }));
    }
    return DEFAULT_SAMPLE_CATALOG;
  } catch (err) {
    console.warn("Using offline benchmark sample catalog:", err.message);
    return DEFAULT_SAMPLE_CATALOG;
  }
}

function computeClientBenchmarkResult(sampleId, confidenceThresh) {
  const sample = DEFAULT_SAMPLE_CATALOG.find(s => s.id === sampleId) || DEFAULT_SAMPLE_CATALOG[0];
  const filtered = (sample.benchmark_detections || []).filter(d => (d.confidence || 0) >= confidenceThresh);
  
  const counts = { D00: 0, D10: 0, D20: 0, D40: 0 };
  let totalDefectArea = 0;
  
  filtered.forEach(d => {
    if (counts[d.class_code] !== undefined) counts[d.class_code]++;
    totalDefectArea += (d.area_percent || 0);
  });

  let priorityLevel = "Low Priority — Surface Maintenance";
  let badgeColor = "#38BDF8";
  let urgencyScore = Math.min(100, Math.round(totalDefectArea * 3.5 + (counts.D40 * 35) + (counts.D20 * 20)));

  if (counts.D40 > 0 || urgencyScore >= 70) {
    priorityLevel = "High Priority — Hazard Alert";
    badgeColor = "#EF4444";
  } else if (counts.D20 > 0 || urgencyScore >= 45) {
    priorityLevel = "Medium-High Priority — Base Course Fatigue";
    badgeColor = "#F59E0B";
  } else if (counts.D10 > 0 || urgencyScore >= 25) {
    priorityLevel = "Medium Priority — Contraction Fissures";
    badgeColor = "#10B981";
  }

  return {
    execution_mode: "BENCHMARK_DEMO_MODE",
    is_demo_mode: true,
    status_badge: "BENCHMARK DEMO (Ground Truth Reference)",
    model_name: "IEEE RDD2020 / Roboflow Benchmark Reference",
    sample_id: sample.id,
    sample_title: sample.title,
    surface_type: sample.surface_type,
    image_dimensions: { width: 800, height: 600 },
    confidence_threshold: confidenceThresh,
    total_detections: filtered.length,
    detections: filtered,
    class_counts: counts,
    priority_evaluation: {
      priority_level: priorityLevel,
      urgency_score: urgencyScore,
      badge_color: badgeColor,
      recommended_action: counts.D40 > 0 ? "Immediate pothole filling with hot asphalt compaction." : "Bituminous seal coat and crack monitoring.",
      estimated_timeframe: counts.D40 > 0 ? "Immediate (48h)" : "1-3 months",
      area_coverage_percent: Math.min(100, totalDefectArea),
      is_heuristic: true,
      disclaimer: "EXPERIMENTAL ESTIMATE: Rule-based heuristic calculation based on defect counts and surface area."
    },
    latency_ms: 12.0,
    device_used: "Client-Side Ground Truth Catalog",
    original_image: null,
    annotated_image: null,
    timestamp: new Date().toISOString()
  };
}

export async function detectDamage({ file, sample_id, confidence = 0.25, mode = 'auto' }) {
  // If user selected demo mode on a pre-indexed sample and backend is offline, return client-side benchmark
  if (sample_id && mode === 'demo') {
    try {
      const formData = new FormData();
      formData.append('confidence', confidence.toString());
      formData.append('mode', 'demo');
      formData.append('sample_id', sample_id);

      const res = await fetch(`${API_BASE}/detect`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(6000)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend unavailable for demo sample, serving offline benchmark:", e.message);
      return computeClientBenchmarkResult(sample_id, confidence);
    }
  }

  const formData = new FormData();
  formData.append('confidence', confidence.toString());
  formData.append('mode', mode);

  if (file) {
    formData.append('file', file);
  } else if (sample_id) {
    formData.append('sample_id', sample_id);
  } else {
    throw new Error("Either an image file or sample_id is required for detection.");
  }

  try {
    const res = await fetch(`${API_BASE}/detect`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(errorJson?.detail || `Server returned error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // If it was a benchmark sample, gracefully fall back to client benchmark
    if (sample_id) {
      console.warn("Live backend unreachable for sample, falling back to benchmark demo:", err.message);
      return computeClientBenchmarkResult(sample_id, confidence);
    }

    // For uploaded custom files, provide an actionable explanation
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error(
        `Failed to connect to backend at "${API_BASE}". ` +
        `If hosted on Render, the free instance may be waking from sleep (~45-60s) or still building. ` +
        `Please check your Render dashboard status or verify VITE_API_URL in Vercel settings.`
      );
    }
    throw err;
  }
}

export async function fetchBenchmarkMetrics() {
  try {
    const res = await fetch(`${API_BASE}/metrics`);
    if (!res.ok) throw new Error(`Metrics fetch returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch benchmark metrics:", err);
    throw err;
  }
}
