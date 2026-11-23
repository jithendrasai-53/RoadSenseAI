export const DAMAGE_CLASSES = {
  D00: {
    code: 'D00',
    title: 'Longitudinal Crack',
    category: 'Linear Wheel-Path Distress',
    color: '#38BDF8', // Cyan
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-400',
    badgeBorder: 'border-sky-500/30',
    description: 'Cracks oriented parallel to the centerline of the roadway. Primarily triggered by paving joint fatigue, poor seam compaction, or repetitive heavy axle wheel tracking.',
    repairGuideline: 'Clean debris with compressed air, fill with hot-pour bituminous mastic sealant, and seal surface.'
  },
  D10: {
    code: 'D10',
    title: 'Transverse Crack',
    category: 'Thermal Contraction Distress',
    color: '#10B981', // Emerald
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    description: 'Cracks running perpendicular to the roadway centerline. Driven by temperature-induced shrinkage of the asphalt binder and subgrade moisture fluctuations.',
    repairGuideline: 'Rout and seal transverse fractures with elastomeric polymer asphalt before winter moisture penetrates base.'
  },
  D20: {
    code: 'D20',
    title: 'Alligator Crack',
    category: 'Structural Fatigue / Mesh Failure',
    color: '#F59E0B', // Amber
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/30',
    description: 'A network of interconnected polygonal fractures resembling reptile skin. Indicates progressive base-course structural exhaustion under repetitive heavy vehicle loadings.',
    repairGuideline: 'Structural asphalt patch required; full-depth milling, sub-base recompaction, and dense bituminous overlay.'
  },
  D40: {
    code: 'D40',
    title: 'Pothole',
    category: 'Severe Cavity / Safety Hazard',
    color: '#EF4444', // Red
    badgeBg: 'bg-red-500/10',
    badgeText: 'text-red-400',
    badgeBorder: 'border-red-500/30',
    description: 'Bowl-shaped structural cavity formed after water enters surface fractures, freezes/softens the sub-base, and traffic dislodges asphalt aggregate chunks.',
    repairGuideline: 'Immediate safety triage: clean loose debris, apply tack coat, compact hot-mix asphalt in 50mm lifts.'
  }
};

export const PIPELINE_STAGES = [
  {
    step: 1,
    title: 'Image Collection',
    tag: 'Dataset Acquisition',
    icon: 'Camera',
    description: 'Acquiring high-resolution dashcam, smartphone, and drone imagery under variable illumination, weather conditions, and road surface typologies according to IEEE RDD protocols.',
    input: 'Crowdsourced Road Videos & Dashcam Feeds',
    output: 'Raw RGB Frames (1080p, 4K)',
    details: 'Images are captured at varying angles (forward facing 15°-30° tilt) to capture roadway surface distress without excessive sky interference.'
  },
  {
    step: 2,
    title: 'Dataset Preprocessing',
    tag: 'Quality & Normalization',
    icon: 'Layers',
    description: 'Filtering blurry frames, resizing to 640x640 resolution with aspect-ratio letterboxing, CLAHE contrast equalization, and color space normalization.',
    input: 'Raw Variable Frames',
    output: 'Standardized 640x640x3 Tensors',
    details: 'Contrast Limited Adaptive Histogram Equalization (CLAHE) is selectively applied to enhance faint crack boundaries in shadowed conditions.'
  },
  {
    step: 3,
    title: 'Image Annotation',
    tag: 'Ground Truth Labeling',
    icon: 'Tag',
    description: 'Rigorous bounding box delineation following RDD standards (D00: Longitudinal, D10: Transverse, D20: Alligator, D40: Pothole) with normalized coordinates.',
    input: 'Standardized Images',
    output: 'YOLO Formatted .txt Labels (Class X Y W H)',
    details: 'Ground truth boxes encompass the distress envelope with tight margins to minimize background noise during training.'
  },
  {
    step: 4,
    title: 'Dataset Splitting',
    tag: 'Data Partitioning',
    icon: 'PieChart',
    description: 'Stratified partitioning into 70% Training, 20% Validation, and 10% Independent Test sets ensuring balanced class distributions across all subsets.',
    input: 'Annotated Dataset Registry',
    output: 'Train / Val / Test Manifests',
    details: 'Stratified sampling prevents geographic and category imbalance between training and validation splits.'
  },
  {
    step: 5,
    title: 'YOLO Training',
    tag: 'Deep Neural Learning',
    icon: 'Cpu',
    description: 'Training deep convolutional backbone with Path Aggregation Network (PANet) feature pyramid and anchor-free detection heads using CIoU and BCE loss.',
    input: 'Training Set & Pretrained Backbones',
    output: 'Trained Weights (best.pt)',
    details: 'Data augmentations include mosaic blending, mixup, random perspective transforms, and horizontal flips.'
  },
  {
    step: 6,
    title: 'Model Validation',
    tag: 'Hyperparameter Tuning',
    icon: 'CheckCircle2',
    description: 'Evaluating loss convergence, tracking validation metrics per epoch, applying early stopping, and fine-tuning Non-Maximum Suppression (NMS) IoU thresholds.',
    input: 'Validation Subset',
    output: 'Validation Loss Curves & PR Checkpoints',
    details: 'Confidence and IoU thresholds are systematically swept to optimize F1-score across all 4 defect categories.'
  },
  {
    step: 7,
    title: 'Testing on Unseen Images',
    tag: 'Generalization Testing',
    icon: 'Eye',
    description: 'Running inference across the sequestered 10% test split featuring novel road types, rainy weather conditions, and extreme shadow artifacts.',
    input: 'Sequestered 10% Test Partition',
    output: 'Generalization Performance Vector',
    details: 'Confirms that the model does not overfit to specific pavement textures or regional asphalt color variations.'
  },
  {
    step: 8,
    title: 'Detection Evaluation',
    tag: 'Quantitative Benchmarking',
    icon: 'BarChart3',
    description: 'Computing Mean Average Precision (mAP@0.50, mAP@0.50:0.95), Precision, Recall, confusion matrix, and inference latency across hardware architectures.',
    input: 'Inference Predictions vs Ground Truth',
    output: 'mAP Benchmarks & Confusion Matrix',
    details: 'Evaluation strictly follows the international IEEE Road Damage Detection Challenge criteria.'
  }
];

export const PRIORITY_DISCLAIMER =
  "EXPERIMENTAL ESTIMATE: The repair priority suggestion and urgency score are rule-based heuristics calculated from detected defect frequencies, category weights, and surface area coverage. They are NOT a certified Pavement Condition Index (PCI) or direct neural network prediction.";

export const DEFAULT_SAMPLE_CATALOG = [
  {
    id: "real_road_single_pothole",
    filename: "real_road_single_pothole.jpg",
    title: "Real Roadway — Distinct Surface Pothole",
    surface_type: "Worn Bituminous Concrete",
    dominant_defect: "D40 — Pothole",
    description: "Real-world asphalt road with a prominent circular pothole cavity and edge degradation along vehicle wheel track.",
    image_url: "/samples/real_road_single_pothole.jpg",
    benchmark_detections: [
      {
        id: "bench-pot-1",
        class_code: "D40",
        class_name: "Pothole",
        confidence: 0.95,
        bbox: [190, 439, 373, 542],
        bbox_normalized: [0.2969, 0.6859, 0.5828, 0.8469],
        area_percent: 3.1,
        severity_grade: "Critical"
      },
      {
        id: "bench-pot-2",
        class_code: "D40",
        class_name: "Pothole",
        confidence: 0.88,
        bbox: [478, 357, 529, 379],
        bbox_normalized: [0.7469, 0.5578, 0.8266, 0.5922],
        area_percent: 0.4,
        severity_grade: "Medium"
      }
    ]
  },
  {
    id: "real_road_multiple_potholes",
    filename: "real_road_multiple_potholes.jpg",
    title: "Rural Arterial — Multiple Compound Potholes",
    surface_type: "Moisture-Degraded Asphalt",
    dominant_defect: "D40 — Pothole (Multiple)",
    description: "Asphalt thoroughfare featuring multiple severe pothole depressions and water erosion cavities.",
    image_url: "/samples/real_road_multiple_potholes.jpg",
    benchmark_detections: [
      {
        id: "bench-multipot-1",
        class_code: "D40",
        class_name: "Pothole",
        confidence: 0.92,
        bbox: [257, 475, 630, 639],
        bbox_normalized: [0.4016, 0.7422, 0.9844, 0.9984],
        area_percent: 14.8,
        severity_grade: "Critical"
      }
    ]
  },
  {
    id: "sample_d40_pothole",
    filename: "sample_d40_pothole.jpg",
    title: "Urban Thoroughfare — Structural Surface Pothole",
    surface_type: "Moisture-Degraded Asphalt Pavement",
    dominant_defect: "D40 — Pothole",
    description: "Deep bowl-shaped depression with fractured perimeter and loose aggregate, presenting immediate tire puncture hazards.",
    image_url: "/samples/sample_d40_pothole.jpg",
    benchmark_detections: [
      {
        id: "det-d40-1",
        class_code: "D40",
        class_name: "Pothole",
        confidence: 0.94,
        bbox: [291, 238, 526, 397],
        bbox_normalized: [0.3638, 0.3967, 0.6575, 0.6617],
        area_percent: 8.7,
        severity_grade: "Critical"
      }
    ]
  },
  {
    id: "sample_d00_longitudinal",
    filename: "sample_d00_longitudinal.jpg",
    title: "Asphalt Highway — Longitudinal Fatigue Fissure",
    surface_type: "Flexible Bituminous Pavement",
    dominant_defect: "D00 — Longitudinal Crack",
    description: "Severe longitudinal joint cracking along the primary wheel path line, caused by cyclic vehicular wheel fatigue.",
    image_url: "/samples/sample_d00_longitudinal.jpg",
    benchmark_detections: [
      {
        id: "det-d00-1",
        class_code: "D00",
        class_name: "Longitudinal Crack",
        confidence: 0.88,
        bbox: [330, 40, 420, 560],
        bbox_normalized: [0.4125, 0.0667, 0.5250, 0.9333],
        area_percent: 11.2,
        severity_grade: "High"
      }
    ]
  },
  {
    id: "sample_d10_transverse",
    filename: "sample_d10_transverse.jpg",
    title: "Suburban Corridor — Thermal Transverse Cracks",
    surface_type: "Dense Graded Asphalt Concrete",
    dominant_defect: "D10 — Transverse Crack",
    description: "Dual transverse contraction fissures running perpendicular to traffic flow, initiated by seasonal freeze-thaw cycles.",
    image_url: "/samples/sample_d10_transverse.jpg",
    benchmark_detections: [
      {
        id: "det-d10-1",
        class_code: "D10",
        class_name: "Transverse Crack",
        confidence: 0.89,
        bbox: [130, 220, 680, 280],
        bbox_normalized: [0.1625, 0.3667, 0.8500, 0.4667],
        area_percent: 8.7,
        severity_grade: "High"
      }
    ]
  },
  {
    id: "sample_multi_defect",
    filename: "sample_multi_defect.jpg",
    title: "Compound Degradation — Multi-Defect Road Section",
    surface_type: "Heavily Aged Bituminous Layer",
    dominant_defect: "Multiple (D40 Pothole + Cracks)",
    description: "Combined longitudinal fissure, transverse contraction crack, and active pothole cavity on arterial pavement.",
    image_url: "/samples/sample_multi_defect.jpg",
    benchmark_detections: [
      {
        id: "det-multi-1",
        class_code: "D40",
        class_name: "Pothole",
        confidence: 0.92,
        bbox: [434, 357, 618, 477],
        bbox_normalized: [0.5425, 0.5950, 0.7725, 0.7950],
        area_percent: 7.2,
        severity_grade: "Critical"
      },
      {
        id: "det-multi-2",
        class_code: "D10",
        class_name: "Transverse Crack",
        confidence: 0.84,
        bbox: [170, 140, 650, 210],
        bbox_normalized: [0.2125, 0.2333, 0.8125, 0.3500],
        area_percent: 7.4,
        severity_grade: "High"
      }
    ]
  },
  {
    id: "clean_undamaged_road",
    filename: "clean_undamaged_road.jpg",
    title: "Pristine Asphalt — Clean Undamaged Road",
    surface_type: "New Bituminous Surfacing",
    dominant_defect: "None (Undamaged)",
    description: "Newly laid asphalt highway with clear road markings, uniform surface aggregate, and zero structural distress.",
    image_url: "/samples/clean_undamaged_road.jpg",
    benchmark_detections: []
  }
];
