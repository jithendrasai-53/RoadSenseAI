import requests
import json
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000"
SAMPLES_DIR = Path(__file__).resolve().parent / "backend" / "static" / "samples"

def test_status():
    print("\n--- 1. Testing /api/status ---")
    r = requests.get(f"{BASE_URL}/api/status")
    assert r.status_code == 200, f"Status check failed: {r.text}"
    data = r.json()
    print(f"Model loaded: {data['model_loaded']}")
    print(f"Model names: {data['model_names']}")
    print(f"Hardware: {data['hardware']['device_type']} ({data['hardware']['device_name']})")
    print(f"Supports live inference: {data['supports_live_inference']}")
    return data

def test_detection(image_filename, conf=0.15, mode="real", sample_id=None):
    img_path = SAMPLES_DIR / image_filename
    assert img_path.exists(), f"Image {img_path} not found"
    
    print(f"\n--- Testing Detection on: {image_filename} (conf={conf}, mode={mode}) ---")
    with open(img_path, "rb") as f:
        files = {"file": (image_filename, f, "image/jpeg")}
        data = {
            "confidence": str(conf),
            "mode": mode,
            "imgsz": "640"
        }
        if sample_id:
            data["sample_id"] = sample_id
        r = requests.post(f"{BASE_URL}/api/detect", files=files, data=data)
        
    assert r.status_code == 200, f"Detect failed: {r.status_code} {r.text}"
    res = r.json()
    print(f"Execution Mode: {res['execution_mode']}")
    print(f"Status Badge: {res['status_badge']}")
    print(f"Model: {res['model_name']}")
    print(f"Dimensions: {res['image_dimensions']}")
    print(f"Latency: {res['latency_ms']} ms")
    print(f"Total Detections: {res['total_detections']}")
    print(f"Class Counts: {res['class_counts']}")
    print(f"Priority Evaluation: {res['priority_evaluation']['priority_level']} (Score: {res['priority_evaluation']['urgency_score']}/100)")
    
    for i, det in enumerate(res['detections']):
        print(f"  [{i+1}] {det['class_code']} - {det['class_name']}: conf={det['confidence']}, bbox={det['bbox']}, area={det['area_percent']}%")
    return res

def test_benchmark_mode():
    print(f"\n--- Testing Benchmark Demo Mode (sample_id='real_road_single_pothole') ---")
    data = {
        "confidence": "0.15",
        "sample_id": "real_road_single_pothole",
        "mode": "demo"
    }
    r = requests.post(f"{BASE_URL}/api/detect", data=data)
    assert r.status_code == 200, f"Benchmark mode failed: {r.text}"
    res = r.json()
    print(f"Execution Mode: {res['execution_mode']}")
    print(f"Status Badge: {res['status_badge']}")
    print(f"Total Detections: {res['total_detections']}")
    print(f"Class Counts: {res['class_counts']}")

def test_png_upload():
    from PIL import Image
    import io
    print(f"\n--- Testing PNG Image Upload ---")
    img = Image.new("RGB", (640, 480), color=(80, 80, 80))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    
    files = {"file": ("test_road.png", buf, "image/png")}
    data = {"confidence": "0.15", "mode": "real"}
    r = requests.post(f"{BASE_URL}/api/detect", files=files, data=data)
    assert r.status_code == 200, f"PNG upload failed: {r.text}"
    res = r.json()
    print(f"PNG Upload Success. Total Detections: {res['total_detections']}, latency: {res['latency_ms']} ms")

if __name__ == "__main__":
    test_status()
    # 1. Multiple Potholes
    test_detection("real_road_multiple_potholes.jpg", conf=0.15)
    # 2. Single Large Pothole
    test_detection("real_road_single_pothole.jpg", conf=0.15)
    # 3. Longitudinal Cracks (D00)
    test_detection("sample_d00_longitudinal.jpg", conf=0.15)
    # 4. Clean Undamaged Road (0 defects expected)
    test_detection("clean_undamaged_road.jpg", conf=0.15)
    # 5. Benchmark Demo separation
    test_benchmark_mode()
    # 6. PNG Upload
    test_png_upload()
    print("\n>>> ALL TEST SCENARIOS COMPLETED SUCCESSFULLY! <<<")
