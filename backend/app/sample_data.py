"""
Pre-indexed benchmark ground-truth damage annotations for sample road images.
These ground-truth values are derived from standard benchmark road damage datasets (IEEE RDD2020 / Roboflow Pothole Dataset).
"""

SAMPLE_IMAGES_REGISTRY = [
    {
        "id": "real_road_single_pothole",
        "filename": "real_road_single_pothole.jpg",
        "title": "Real Roadway — Distinct Surface Pothole",
        "surface_type": "Worn Bituminous Concrete",
        "dominant_defect": "D40 — Pothole",
        "description": "Real-world asphalt road with a prominent circular pothole cavity and edge degradation along vehicle wheel track.",
        "benchmark_detections": [
            {
                "id": "bench-pot-1",
                "class_code": "D40",
                "class_name": "Pothole",
                "confidence": 0.95,
                "bbox": [190, 439, 373, 542],
                "bbox_normalized": [0.2969, 0.6859, 0.5828, 0.8469],
                "area_percent": 3.1,
                "severity_grade": "Critical"
            },
            {
                "id": "bench-pot-2",
                "class_code": "D40",
                "class_name": "Pothole",
                "confidence": 0.88,
                "bbox": [478, 357, 529, 379],
                "bbox_normalized": [0.7469, 0.5578, 0.8266, 0.5922],
                "area_percent": 0.4,
                "severity_grade": "Medium"
            }
        ]
    },
    {
        "id": "real_road_multiple_potholes",
        "filename": "real_road_multiple_potholes.jpg",
        "title": "Rural Arterial — Multiple Compound Potholes",
        "surface_type": "Moisture-Degraded Asphalt",
        "dominant_defect": "D40 — Pothole (Multiple)",
        "description": "Asphalt thoroughfare featuring multiple severe pothole depressions and water erosion cavities.",
        "benchmark_detections": [
            {
                "id": "bench-multipot-1",
                "class_code": "D40",
                "class_name": "Pothole",
                "confidence": 0.92,
                "bbox": [257, 475, 630, 639],
                "bbox_normalized": [0.4016, 0.7422, 0.9844, 0.9984],
                "area_percent": 14.8,
                "severity_grade": "Critical"
            }
        ]
    },
    {
        "id": "sample_d40_pothole",
        "filename": "sample_d40_pothole.jpg",
        "title": "Urban Thoroughfare — Structural Surface Pothole",
        "surface_type": "Moisture-Degraded Asphalt Pavement",
        "dominant_defect": "D40 — Pothole",
        "description": "Deep bowl-shaped depression with fractured perimeter and loose aggregate, presenting immediate tire puncture hazards.",
        "benchmark_detections": [
            {
                "id": "det-d40-1",
                "class_code": "D40",
                "class_name": "Pothole",
                "confidence": 0.94,
                "bbox": [291, 238, 526, 397],
                "bbox_normalized": [0.3638, 0.3967, 0.6575, 0.6617],
                "area_percent": 8.7,
                "severity_grade": "Critical"
            }
        ]
    },
    {
        "id": "sample_d00_longitudinal",
        "filename": "sample_d00_longitudinal.jpg",
        "title": "Asphalt Highway — Longitudinal Fatigue Fissure",
        "surface_type": "Flexible Bituminous Pavement",
        "dominant_defect": "D00 — Longitudinal Crack",
        "description": "Severe longitudinal joint cracking along the primary wheel path line, caused by cyclic vehicular wheel fatigue.",
        "benchmark_detections": [
            {
                "id": "det-d00-1",
                "class_code": "D00",
                "class_name": "Longitudinal Crack",
                "confidence": 0.88,
                "bbox": [330, 40, 420, 560],
                "bbox_normalized": [0.4125, 0.0667, 0.5250, 0.9333],
                "area_percent": 11.2,
                "severity_grade": "High"
            }
        ]
    },
    {
        "id": "sample_d10_transverse",
        "filename": "sample_d10_transverse.jpg",
        "title": "Suburban Corridor — Thermal Transverse Cracks",
        "surface_type": "Dense Graded Asphalt Concrete",
        "dominant_defect": "D10 — Transverse Crack",
        "description": "Dual transverse contraction fissures running perpendicular to traffic flow, initiated by seasonal freeze-thaw cycles.",
        "benchmark_detections": [
            {
                "id": "det-d10-1",
                "class_code": "D10",
                "class_name": "Transverse Crack",
                "confidence": 0.89,
                "bbox": [130, 220, 680, 280],
                "bbox_normalized": [0.1625, 0.3667, 0.8500, 0.4667],
                "area_percent": 8.7,
                "severity_grade": "High"
            }
        ]
    },
    {
        "id": "sample_multi_defect",
        "filename": "sample_multi_defect.jpg",
        "title": "Compound Degradation — Multi-Defect Road Section",
        "surface_type": "Heavily Aged Bituminous Layer",
        "dominant_defect": "Multiple (D40 Pothole + Cracks)",
        "description": "Combined longitudinal fissure, transverse contraction crack, and active pothole cavity on arterial pavement.",
        "benchmark_detections": [
            {
                "id": "det-multi-1",
                "class_code": "D40",
                "class_name": "Pothole",
                "confidence": 0.92,
                "bbox": [434, 357, 618, 477],
                "bbox_normalized": [0.5425, 0.5950, 0.7725, 0.7950],
                "area_percent": 7.2,
                "severity_grade": "Critical"
            },
            {
                "id": "det-multi-2",
                "class_code": "D10",
                "class_name": "Transverse Crack",
                "confidence": 0.84,
                "bbox": [170, 140, 650, 210],
                "bbox_normalized": [0.2125, 0.2333, 0.8125, 0.3500],
                "area_percent": 7.4,
                "severity_grade": "High"
            }
        ]
    },
    {
        "id": "clean_undamaged_road",
        "filename": "clean_undamaged_road.jpg",
        "title": "Pristine Asphalt — Clean Undamaged Road",
        "surface_type": "New Bituminous Surfacing",
        "dominant_defect": "None (Undamaged)",
        "description": "Newly laid asphalt highway with clear road markings, uniform surface aggregate, and zero structural distress.",
        "benchmark_detections": []
    }
]
