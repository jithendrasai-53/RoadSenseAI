/**
 * API Service for Road Sense AI
 */

const API_BASE = '/api';

export async function fetchSystemStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error(`Status check returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("API status check failed:", err.message);
    return {
      model_loaded: false,
      hardware: { device_name: "Local Client / Offline Mode", is_gpu_accelerated: false },
      load_error: "Backend API offline or unreachable."
    };
  }
}

export async function fetchSampleCatalog() {
  try {
    const res = await fetch(`${API_BASE}/samples`);
    if (!res.ok) throw new Error(`Samples fetch returned ${res.status}`);
    const data = await res.json();
    return data.samples || [];
  } catch (err) {
    console.error("Failed to fetch sample catalog:", err);
    return [];
  }
}

export async function detectDamage({ file, sample_id, confidence = 0.25, mode = 'auto' }) {
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

  const res = await fetch(`${API_BASE}/detect`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.detail || `Detection failed with HTTP ${res.status}`);
  }

  return await res.json();
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
