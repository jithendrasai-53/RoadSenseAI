import os
import time
from pathlib import Path
from PIL import Image
import torch

from app.config import (
    BASE_DIR,
    MODELS_DIR,
    DAMAGE_CLASSES,
    CLASS_NAME_TO_CODE,
    get_system_hardware_info
)
from app.sample_data import SAMPLE_IMAGES_REGISTRY
from app.utils import (
    render_detection_annotations,
    calculate_rule_based_priority,
    image_to_base64
)

def compute_box_iou(b1, b2):
    """Compute Intersection over Union between two bounding boxes [x1, y1, x2, y2]."""
    x1 = max(b1[0], b2[0])
    y1 = max(b1[1], b2[1])
    x2 = min(b1[2], b2[2])
    y2 = min(b1[3], b2[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    a1 = max(1, (b1[2] - b1[0]) * (b1[3] - b1[1]))
    a2 = max(1, (b2[2] - b2[0]) * (b2[3] - b2[1]))
    union = a1 + a2 - inter
    return inter / union if union > 0 else 0.0

def apply_nms(detections, iou_thresh=0.40):
    """
    Standard Non-Maximum Suppression (NMS) to eliminate overlapping duplicate boxes.
    Keeps the higher-confidence prediction when two boxes overlap by > iou_thresh.
    """
    if not detections:
        return []
    
    # Sort descending by confidence score
    sorted_dets = sorted(detections, key=lambda d: d.get("confidence", 0.0), reverse=True)
    kept = []
    
    for d in sorted_dets:
        box_d = d["bbox"]
        suppress = False
        for k in kept:
            box_k = k["bbox"]
            iou = compute_box_iou(box_d, box_k)
            # If same or overlapping defect, keep the higher confidence one
            if iou > iou_thresh:
                suppress = True
                break
        if not suppress:
            kept.append(d)
            
    return kept


class RoadDamageDetector:
    def __init__(self):
        import psutil
        self.hardware_info = get_system_hardware_info()
        self.device = self.hardware_info["device_type"]
        self.pothole_model = None
        self.rdd_model = None
        self.is_model_loaded = False
        self.loaded_model_names = []
        self.load_error = None

        # Detect low-memory environment (e.g. Render 512MB free tier)
        total_ram_mb = psutil.virtual_memory().total / (1024 * 1024)
        is_render = os.environ.get("RENDER", "").lower() in ["true", "1"]
        self.is_low_ram = total_ram_mb < 1200 or is_render

        if self.is_low_ram:
            print(f"[!] Running in memory-constrained environment (RAM: {total_ram_mb:.0f}MB). Optimizing model footprint.")
            torch.set_num_threads(1)

        self.load_models()

    def load_models(self):
        """Load genuine road-damage and pothole detection YOLOv8 models."""
        from ultralytics import YOLO

        pothole_path = MODELS_DIR / "pothole_yolov8.pt"
        rdd_path = MODELS_DIR / "rdd_yolov8m.pt"
        fallback_path = MODELS_DIR / "best.pt"

        loaded_any = False

        # 1. Specialized Pothole Detection Model (Lightweight YOLOv8 Nano)
        if pothole_path.exists():
            try:
                self.pothole_model = YOLO(str(pothole_path))
                self.loaded_model_names.append("Pothole-YOLOv8")
                loaded_any = True
                print(f"Loaded Pothole model from {pothole_path} on {self.device}.")
            except Exception as e:
                print(f"Warning: Failed to load {pothole_path}: {e}")

        # 2. Road Damage Dataset Model (Cracks & Distress)
        # On 512MB free tiers (Render), skip the 52MB Medium model to prevent SIGKILL 137 / 502 Bad Gateway
        if not self.is_low_ram and rdd_path.exists():
            try:
                self.rdd_model = YOLO(str(rdd_path))
                self.loaded_model_names.append("RDD2022-YOLOv8m")
                loaded_any = True
                print(f"Loaded RDD model from {rdd_path} on {self.device}.")
            except Exception as e:
                print(f"Warning: Failed to load {rdd_path}: {e}")

        # 3. Fallback Model if specialized ones are missing
        if not loaded_any and fallback_path.exists():
            try:
                self.rdd_model = YOLO(str(fallback_path))
                self.loaded_model_names.append("YOLOv8-RoadModel")
                loaded_any = True
                print(f"Loaded fallback model from {fallback_path} on {self.device}.")
            except Exception as e:
                self.load_error = str(e)

        self.is_model_loaded = loaded_any
        if not loaded_any:
            self.load_error = "No trained YOLO road damage models found in backend/models/."

    def get_status(self) -> dict:
        """Return model loading status and system capabilities."""
        classes_info = {}
        for code, details in DAMAGE_CLASSES.items():
            classes_info[code] = {
                "name": details["name"],
                "color": details["color"],
                "category": details["category"],
                "description": details["description"]
            }

        return {
            "model_loaded": self.is_model_loaded,
            "model_names": self.loaded_model_names,
            "primary_model_architecture": "Ultralytics YOLOv8 (PyTorch)",
            "classes": classes_info,
            "hardware": self.hardware_info,
            "load_error": self.load_error,
            "sample_mode_available": True,
            "supports_live_inference": self.is_model_loaded
        }

    def predict_benchmark_sample(self, sample_id: str, confidence_thresh: float) -> dict:
        """
        Return verified ground-truth benchmark detection for pre-indexed sample image.
        Used strictly in BENCHMARK DEMO mode.
        """
        sample_meta = next((s for s in SAMPLE_IMAGES_REGISTRY if s["id"] == sample_id), None)
        if not sample_meta:
            sample_meta = SAMPLE_IMAGES_REGISTRY[0]

        filtered_detections = [
            dict(d) for d in sample_meta["benchmark_detections"]
            if d.get("confidence", 0.0) >= confidence_thresh
        ]

        # Load sample image from disk
        from app.config import SAMPLES_DIR
        sample_img_path = SAMPLES_DIR / sample_meta["filename"]
        if sample_img_path.exists():
            orig_img = Image.open(sample_img_path).convert("RGB")
        else:
            orig_img = Image.new("RGB", (800, 600), color=(50, 52, 50))

        width, height = orig_img.size
        annotated_img = render_detection_annotations(orig_img, filtered_detections)

        # Count per category
        counts = {"D00": 0, "D10": 0, "D20": 0, "D40": 0}
        for det in filtered_detections:
            code = det.get("class_code", "D00")
            if code in counts:
                counts[code] += 1

        priority = calculate_rule_based_priority(filtered_detections, width, height)

        return {
            "execution_mode": "BENCHMARK_DEMO_MODE",
            "is_demo_mode": True,
            "status_badge": "BENCHMARK DEMO (Ground Truth Reference)",
            "model_name": "IEEE RDD2020 / Roboflow Benchmark Ground-Truth",
            "sample_id": sample_meta["id"],
            "sample_title": sample_meta["title"],
            "surface_type": sample_meta["surface_type"],
            "image_dimensions": {"width": width, "height": height},
            "confidence_threshold": confidence_thresh,
            "total_detections": len(filtered_detections),
            "detections": filtered_detections,
            "class_counts": counts,
            "priority_evaluation": priority,
            "latency_ms": 12.0,
            "device_used": "Benchmark Dataset Ground Truth",
            "original_image": image_to_base64(orig_img),
            "annotated_image": image_to_base64(annotated_img),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

    def detect(
        self, 
        img: Image.Image, 
        confidence_thresh: float = 0.15, 
        sample_id: str = None, 
        force_mode: str = "real",
        imgsz: int = 640
    ) -> dict:
        """
        Execute real YOLO neural network inference on an uploaded or selected image.
        Uses original image dimensions, extracts real bounding boxes, and avoids fake detections.
        """
        # If user explicitly requests Demo Mode, return the benchmark reference
        if force_mode == "demo" and sample_id:
            return self.predict_benchmark_sample(sample_id, confidence_thresh)

        if not self.is_model_loaded:
            raise RuntimeError(
                f"No trained YOLO models are loaded: {self.load_error}. "
                "Ensure weights exist in backend/models/ or use Benchmark Demo mode."
            )

        width, height = img.size
        start_time = time.perf_counter()
        infer_device = self.device

        # In low-memory cloud tiers (Render 512MB), clamp imgsz to 480 to keep RAM below cgroup limits
        effective_imgsz = min(imgsz, 480) if self.is_low_ram else imgsz

        raw_detections = []
        counts = {"D00": 0, "D10": 0, "D20": 0, "D40": 0}

        with torch.inference_mode():
            # 1. Run Specialized Pothole YOLO Model
            if self.pothole_model is not None:
                try:
                    res_pot = self.pothole_model.predict(
                        source=img,
                        conf=confidence_thresh,
                        imgsz=effective_imgsz,
                        device=infer_device,
                        verbose=False
                    )
                    if res_pot and len(res_pot) > 0:
                        for idx, box in enumerate(res_pot[0].boxes):
                            conf = float(box.conf[0].item())
                            coords = [round(c) for c in box.xyxy[0].tolist()]
                            x1 = max(0, min(width - 1, coords[0]))
                            y1 = max(0, min(height - 1, coords[1]))
                            x2 = max(0, min(width - 1, coords[2]))
                            y2 = max(0, min(height - 1, coords[3]))
                            
                            box_w = max(0, x2 - x1)
                            box_h = max(0, y2 - y1)
                            area_pct = round(((box_w * box_h) / max(1, width * height)) * 100, 2)

                            raw_detections.append({
                                "id": f"det-pothole-{idx + 1}",
                                "class_code": "D40",
                                "class_name": "Pothole",
                                "class_id": 3,
                                "confidence": round(conf, 3),
                                "bbox": [x1, y1, x2, y2],
                                "bbox_normalized": [
                                    round(x1 / width, 4),
                                    round(y1 / height, 4),
                                    round(x2 / width, 4),
                                    round(y2 / height, 4)
                                ],
                                "area_percent": area_pct,
                                "severity_grade": "Critical" if conf > 0.70 else "High"
                            })
                except Exception as e:
                    print(f"Pothole model inference failed on {infer_device}: {e}")

            # 2. Run Road Damage Dataset (RDD) Model (Cracks & General Distress)
            if self.rdd_model is not None:
                try:
                    res_rdd = self.rdd_model.predict(
                        source=img,
                        conf=confidence_thresh,
                        imgsz=effective_imgsz,
                        device=infer_device,
                        verbose=False
                    )
                    if res_rdd and len(res_rdd) > 0:
                        for idx, box in enumerate(res_rdd[0].boxes):
                            conf = float(box.conf[0].item())
                            cls_idx = int(box.cls[0].item())
                            raw_name = self.rdd_model.names.get(cls_idx, f"Class {cls_idx}").lower()
                            
                            # Standardize RDD class codes
                            if "pothole" in raw_name or "d40" in raw_name:
                                class_code = "D40"
                                class_name = "Pothole"
                                class_id = 3
                            elif "transverse" in raw_name or "d10" in raw_name:
                                class_code = "D10"
                                class_name = "Transverse Crack"
                                class_id = 1
                            elif "alligator" in raw_name or "d20" in raw_name:
                                class_code = "D20"
                                class_name = "Alligator Crack"
                                class_id = 2
                            else:
                                class_code = "D00"
                                class_name = "Longitudinal Crack"
                                class_id = 0

                            coords = [round(c) for c in box.xyxy[0].tolist()]
                            x1 = max(0, min(width - 1, coords[0]))
                            y1 = max(0, min(height - 1, coords[1]))
                            x2 = max(0, min(width - 1, coords[2]))
                            y2 = max(0, min(height - 1, coords[3]))
                            
                            box_w = max(0, x2 - x1)
                            box_h = max(0, y2 - y1)
                            area_pct = round(((box_w * box_h) / max(1, width * height)) * 100, 2)

                            raw_detections.append({
                                "id": f"det-rdd-{idx + 1}",
                                "class_code": class_code,
                                "class_name": class_name,
                                "class_id": class_id,
                                "confidence": round(conf, 3),
                                "bbox": [x1, y1, x2, y2],
                                "bbox_normalized": [
                                    round(x1 / width, 4),
                                    round(y1 / height, 4),
                                    round(x2 / width, 4),
                                    round(y2 / height, 4)
                                ],
                                "area_percent": area_pct,
                                "severity_grade": "High" if conf > 0.65 else "Medium"
                            })
                except Exception as e:
                    print(f"RDD model inference failed on {infer_device}: {e}")

        # Garbage collect intermediate tensors
        import gc
        gc.collect()

        # 3. Apply Non-Maximum Suppression (NMS) to combine and deduplicate real model predictions
        final_detections = apply_nms(raw_detections, iou_thresh=0.40)

        # Count per category
        for d in final_detections:
            code = d.get("class_code", "D00")
            if code in counts:
                counts[code] += 1

        latency_ms = round((time.perf_counter() - start_time) * 1000, 1)
        annotated_img = render_detection_annotations(img, final_detections)
        priority = calculate_rule_based_priority(final_detections, width, height)

        model_desc = " + ".join(self.loaded_model_names) if self.loaded_model_names else "YOLOv8"

        return {
            "execution_mode": "LIVE_YOLO_INFERENCE",
            "is_demo_mode": False,
            "status_badge": f"LIVE YOLO INFERENCE ({infer_device.upper()})",
            "model_name": f"{model_desc} (PyTorch)",
            "sample_id": sample_id,
            "image_dimensions": {"width": width, "height": height},
            "confidence_threshold": confidence_thresh,
            "total_detections": len(final_detections),
            "detections": final_detections,
            "class_counts": counts,
            "priority_evaluation": priority,
            "latency_ms": latency_ms,
            "device_used": f"{self.hardware_info['device_name']} [{infer_device.upper()}]",
            "original_image": image_to_base64(img),
            "annotated_image": image_to_base64(annotated_img),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

# Global detector instance
detector = RoadDamageDetector()
