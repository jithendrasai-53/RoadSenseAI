import os
import platform
from pathlib import Path
import torch

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
STATIC_DIR = BASE_DIR / "static"
SAMPLES_DIR = STATIC_DIR / "samples"
DEFAULT_MODEL_PATH = MODELS_DIR / "best.pt"
METRICS_FILE = MODELS_DIR / "benchmark_metrics.json"

# RDD Damage Classes Mapping
DAMAGE_CLASSES = {
    "D00": {
        "id": 0,
        "name": "Longitudinal Crack",
        "category": "Linear Distress",
        "color": "#38BDF8",  # Cyan
        "description": "Cracks running parallel to roadway centerline; typically caused by pavement joint separation or wheel load fatigue.",
        "severity_weight": 2.0
    },
    "D10": {
        "id": 1,
        "name": "Transverse Crack",
        "category": "Thermal Distress",
        "color": "#10B981",  # Emerald
        "description": "Cracks running perpendicular to the roadway centerline; primarily caused by thermal shrinkage and subgrade movement.",
        "severity_weight": 2.2
    },
    "D20": {
        "id": 2,
        "name": "Alligator Crack",
        "category": "Fatigue Failure",
        "color": "#F59E0B",  # Amber
        "description": "Interconnected polygonal blocks of cracking signaling base course failure and structural pavement fatigue.",
        "severity_weight": 3.5
    },
    "D40": {
        "id": 3,
        "name": "Pothole",
        "category": "Cavity / Safety Hazard",
        "color": "#EF4444",  # Crimson
        "description": "Structural bowl-shaped surface depression caused by moisture infiltration and traffic action, posing high vehicle safety hazard.",
        "severity_weight": 4.5
    }
}

CLASS_NAME_TO_CODE = {
    "D00": "D00",
    "D10": "D10",
    "D20": "D20",
    "D40": "D40",
    "Longitudinal Crack": "D00",
    "Transverse Crack": "D10",
    "Alligator Crack": "D20",
    "Pothole": "D40",
    "D00 - Longitudinal Crack": "D00",
    "D10 - Transverse Crack": "D10",
    "D20 - Alligator Crack": "D20",
    "D40 - Pothole": "D40"
}

def get_system_hardware_info():
    """Detect actual hardware without inventing CUDA or TensorRT specs."""
    device_name = "CPU"
    device_type = "cpu"
    
    if torch.cuda.is_available():
        device_type = "cuda"
        device_name = f"CUDA: {torch.cuda.get_device_name(0)}"
    elif torch.backends.mps.is_available():
        device_type = "mps"
        device_name = "Apple Silicon MPS (Metal Performance Shaders)"
    else:
        device_type = "cpu"
        device_name = f"CPU ({platform.processor() or platform.machine()})"

    return {
        "device_type": device_type,
        "device_name": device_name,
        "pytorch_version": torch.__version__,
        "platform": platform.platform(),
        "python_version": platform.python_version(),
        "is_gpu_accelerated": device_type in ["cuda", "mps"]
    }
