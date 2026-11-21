"""
Integration test script for Road Sense AI backend API.
Verifies:
1. /api/status endpoint
2. /api/samples catalog
3. /api/detect with sample_id (benchmark mode)
4. /api/detect with live YOLO inference on sample image
5. /api/metrics benchmark endpoint
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def run_tests():
    print("=== Testing Road Sense AI Backend ===")
    
    # 1. Status Check
    print("\n1. Testing GET /api/status...")
    r = requests.get(f"{BASE_URL}/api/status")
    assert r.status_code == 200, f"Status check failed: {r.status_code}"
    status_data = r.json()
    print("   Model loaded:", status_data["model_loaded"])
    print("   Hardware:", status_data["hardware"]["device_name"])
    print("   Classes supported:", list(status_data["classes"].keys()))

    # 2. Samples Catalog
    print("\n2. Testing GET /api/samples...")
    r = requests.get(f"{BASE_URL}/api/samples")
    assert r.status_code == 200, f"Samples list failed: {r.status_code}"
    samples = r.json().get("samples", [])
    print(f"   Found {len(samples)} pre-indexed benchmark samples:")
    for s in samples:
        print(f"     - [{s['id']}] {s['title']} ({s['dominant_defect']})")

    # 3. Detect benchmark sample
    print("\n3. Testing POST /api/detect (Benchmark Sample Mode)...")
    payload = {"sample_id": "sample_d40_pothole", "confidence": 0.25, "mode": "demo"}
    r = requests.post(f"{BASE_URL}/api/detect", data=payload)
    assert r.status_code == 200, f"Detection failed: {r.text}"
    det_data = r.json()
    print("   Execution mode:", det_data["execution_mode"])
    print("   Total defects detected:", det_data["total_detections"])
    print("   Priority assessment:", det_data["priority_evaluation"]["priority_level"])
    print("   Is heuristic disclaimer present:", det_data["priority_evaluation"]["is_heuristic"])

    # 4. Detect live inference with image file
    print("\n4. Testing POST /api/detect (Real File Upload / Live Inference)...")
    sample_file_path = "backend/static/samples/sample_d10_transverse.jpg"
    with open(sample_file_path, "rb") as f:
        files = {"file": ("sample_d10_transverse.jpg", f, "image/jpeg")}
        data = {"confidence": 0.15, "mode": "auto"}
        r = requests.post(f"{BASE_URL}/api/detect", files=files, data=data)
    assert r.status_code == 200, f"Live detection failed: {r.text}"
    live_data = r.json()
    print("   Execution mode:", live_data["execution_mode"])
    print("   Latency:", live_data["latency_ms"], "ms")
    print("   Status Badge:", live_data["status_badge"])
    print("   Device Used:", live_data["device_used"])

    # 5. Benchmark Metrics
    print("\n5. Testing GET /api/metrics...")
    r = requests.get(f"{BASE_URL}/api/metrics")
    assert r.status_code == 200, f"Metrics failed: {r.status_code}"
    metrics_data = r.json()
    print("   mAP50:", metrics_data["metrics"]["mAP50"])
    print("   Precision:", metrics_data["metrics"]["precision"])
    print("   Recall:", metrics_data["metrics"]["recall"])
    print("   Dataset Reference:", metrics_data["reference"])

    print("\n ALL BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
