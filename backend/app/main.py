import os
import json
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from app.config import STATIC_DIR, SAMPLES_DIR, METRICS_FILE, DAMAGE_CLASSES
from app.sample_data import SAMPLE_IMAGES_REGISTRY
from app.detector import detector
from app.utils import validate_image

app = FastAPI(
    title="Road Sense AI — Pavement Damage Detection Engine",
    description="Automatic Road Damage Detection API powered by YOLO Deep Learning and Computer Vision",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for sample images
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/")
def root():
    return {
        "project": "ROAD SENSE AI",
        "tagline": "Detect. Analyze. Prioritize. Repair.",
        "status": "online",
        "api_docs": "/docs",
        "endpoints": [
            "/api/status",
            "/api/samples",
            "/api/detect",
            "/api/metrics"
        ]
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "model_loaded": detector.is_model_loaded}

@app.get("/api/status")
def get_model_status():
    """Return model loading state, hardware details, and damage category specifications."""
    return detector.get_status()

@app.get("/api/samples")
def list_sample_images():
    """Return catalog of pre-indexed benchmark road damage images."""
    samples = []
    for s in SAMPLE_IMAGES_REGISTRY:
        samples.append({
            "id": s["id"],
            "filename": s["filename"],
            "title": s["title"],
            "surface_type": s["surface_type"],
            "dominant_defect": s["dominant_defect"],
            "description": s["description"],
            "image_url": f"/static/samples/{s['filename']}",
            "benchmark_detection_count": len(s["benchmark_detections"])
        })
    return {"samples": samples}

@app.post("/api/detect")
async def detect_road_damage(
    file: UploadFile = File(None),
    confidence: float = Form(0.15),
    sample_id: str = Form(None),
    mode: str = Form("real"),  # 'real' | 'demo'
    imgsz: int = Form(640)
):
    """
    Execute real road damage defect detection via trained YOLO models.
    Can accept either a direct image file upload or a pre-indexed sample_id.
    """
    try:
        # Validate confidence threshold (0.05 to 0.90)
        confidence = max(0.05, min(0.90, float(confidence)))
        imgsz = int(imgsz) if imgsz in [640, 960, 1280] else 640

        # Case 1: Pre-indexed sample selected
        if sample_id and (file is None or file.filename == ""):
            sample_meta = next((s for s in SAMPLE_IMAGES_REGISTRY if s["id"] == sample_id), None)
            if not sample_meta:
                raise HTTPException(status_code=404, detail=f"Sample '{sample_id}' not found.")
            
            sample_path = SAMPLES_DIR / sample_meta["filename"]
            if not sample_path.exists():
                raise HTTPException(status_code=404, detail="Sample image file missing on server.")
            
            with open(sample_path, "rb") as f:
                img_bytes = f.read()
            img = validate_image(img_bytes)

            result = detector.detect(
                img=img,
                confidence_thresh=confidence,
                sample_id=sample_id,
                force_mode=mode,
                imgsz=imgsz
            )
            return JSONResponse(content=result)

        # Case 2: Custom file uploaded
        if file is not None and file.filename != "":
            img_bytes = await file.read()
            img = validate_image(img_bytes)

            result = detector.detect(
                img=img,
                confidence_thresh=confidence,
                sample_id=None,
                force_mode="real",  # Uploaded images ALWAYS run real inference
                imgsz=imgsz
            )
            return JSONResponse(content=result)

        raise HTTPException(
            status_code=400,
            detail="Please provide an image file upload or select a valid sample_id."
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except RuntimeError as re:
        raise HTTPException(status_code=503, detail=str(re))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.get("/api/metrics")
def get_benchmark_metrics():
    """Return genuine measured RDD2020 benchmark metrics and confusion matrix."""
    if not METRICS_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="Benchmark metrics file not found. Ensure models/benchmark_metrics.json exists."
        )
    with open(METRICS_FILE, "r") as f:
        data = json.load(f)
    return data

@app.post("/api/report/export-json")
async def export_inspection_json(report_data: dict):
    """Validate and return formatted inspection report JSON."""
    return JSONResponse(
        content=report_data,
        headers={"Content-Disposition": "attachment; filename=road_sense_inspection_report.json"}
    )
