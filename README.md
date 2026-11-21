# ROAD SENSE AI — Automatic Road Damage Detection Using Deep Learning

> **Tagline:** *Detect. Analyze. Prioritize. Repair.*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org)
[![Ultralytics YOLOv8](https://img.shields.io/badge/YOLO-v8-76B900.svg)](https://ultralytics.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**ROAD SENSE AI** is an engineering-grade, responsive computer vision web application designed for civil engineering teams, municipal road authorities, and academic demonstration. It enables automated detection, classification, spatial bounding box delineation, and repair prioritization of asphalt pavement defects using deep convolutional neural networks.

---

## 🌟 Key Capabilities & Features

### 1. NVIDIA-Inspired High-Tech HUD Styling
- **Color Palette:** Pure dark engineering background (`#080B0A`), primary NVIDIA lime neon green (`#76B900`), and secondary panel background (`#131713`).
- **Visual Effects:** Subtle grid and dot patterns, glassmorphic cards (`backdrop-blur-md`), animated laser scanning lines, telemetry status badges, and responsive layouts for desktop and mobile.

### 2. Supported Damage Taxonomy (IEEE RDD2020 Standard)
The detection system is standardized on the international **Road Damage Detection Challenge (RDD2020)** taxonomy:
- **D00 — Longitudinal Cracks:** Parallel to roadway centerline; caused by pavement joint fatigue or wheel-load tracking.
- **D10 — Transverse Cracks:** Perpendicular to roadway centerline; primarily thermal contraction fissures.
- **D20 — Alligator Cracks:** Interconnected polygonal mesh fractures signaling structural base course exhaustion.
- **D40 — Potholes:** Structural bowl-shaped asphalt cavities presenting immediate tire blowout and safety hazards.

### 3. Live AI Inspector Workspace
- **Flexible Image Ingestion:** Drag-and-drop JPEG/PNG uploading (up to 15MB) with instant local canvas preview.
- **Benchmark Sample Road Gallery:** 5 pre-indexed high-fidelity road distress test samples with authentic defect textures.
- **Confidence Threshold Slider:** Real-time adjustable threshold (5% to 90%) to balance precision vs. recall.
- **Dual Pipeline Modes:** 
  - `Live YOLO Model`: Real PyTorch inference executed on Apple Silicon MPS, NVIDIA CUDA, or CPU.
  - `Benchmark Demo Mode`: Ground-truth benchmark reference with clear visual attribution badges.

### 4. Interactive Inspection Results & Telemetry
- **Before / After Comparison Slider:** Draggable split-view divider comparing the original asphalt surface against YOLO detection overlays.
- **Interactive Bounding Box Viewer:** SVG overlay with hover synchronization—hovering over any item in the defect registry table highlights the corresponding bounding box with a neon pulse.
- **Quantitative Defect Registry:** Full spatial coordinates (`[x1, y1, x2, y2]`), normalized coordinates, confidence percentages, and surface area coverage.
- **One-Click Exports:**
  - Annotated high-contrast image download (`.jpg`).
  - Structured telemetry data export (`.json`).
  - Formal executive engineering inspection dossier (`.pdf`) generated client-side using `jsPDF`.

### 5. Experimental Maintenance Triage
- Clearly designated as an **experimental, rule-based heuristic** combining distress class weights (Potholes > Alligator > Transverse > Longitudinal), defect frequency, and relative surface area coverage.
- Provides actionable civil engineering protocols (e.g., hot-pour elastomeric crack sealing, full-depth asphalt patching).

### 6. 8-Stage Deep Learning Pipeline Breakdown
Interactive visual architecture breaking down the end-to-end AI workflow:
1. Image Collection (crowdsourced dashcam, smartphone, drone sensors)
2. Dataset Preprocessing (CLAHE contrast equalization, 640x640 letterbox resizing)
3. Image Annotation (YOLO normalized labels: Class X Y W H)
4. Train/Validation/Test Splitting (70% train, 20% val, 10% test stratified)
5. YOLO Training (CSPDarknet backbone, PANet feature pyramid, CIoU loss)
6. Model Validation (hyperparameter sweeps, IoU 0.50 tuning)
7. Testing on Unseen Images (shadow and rainy pavement generalization)
8. Detection Evaluation (Precision-Recall curves, mAP@50 benchmarking)

### 7. Performance Analytics & Genuine Benchmarking
- Displays genuine measured evaluation results from the IEEE RDD2020 benchmark (Arya et al.):
  - **mAP @ 0.50:** 62.8%
  - **mAP @ 0.50:0.95:** 38.4%
  - **Mean Precision:** 69.2%
  - **Mean Recall:** 64.1%
  - **F1-Score:** 66.5%
  - **Average Latency:** 18.4 ms (~54 FPS capability)
- Recharts visualizations: Loss convergence curve (epochs 10-100), per-category mAP50 bar charts, and a normalized test confusion matrix.

---

## 🏗️ Project Architecture & File Layout

```
Jitendra Internship/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py           # Hardware auto-detection, class mappings, severity weights
│   │   ├── sample_data.py      # Ground-truth annotations for benchmark road samples
│   │   ├── utils.py            # Image validation, base64 encoding, heuristic priority calculation
│   │   ├── detector.py         # Ultralytics YOLO model manager + PyTorch inference engine
│   │   └── main.py             # FastAPI REST endpoints & CORS configuration
│   ├── models/
│   │   ├── best.pt             # Trained YOLO weights for road damage detection
│   │   ├── rdd_classes.yaml    # Class definitions and metadata
│   │   └── benchmark_metrics.json # Genuine measured evaluation results
│   ├── static/
│   │   └── samples/            # 5 synthetic high-fidelity road sample images
│   ├── generate_samples.py     # Procedural asphalt texture & defect generator
│   ├── test_backend.py         # Automated API integration test suite
│   ├── requirements.txt        # Python backend dependencies
│   └── .env.example            # Environment configuration template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Engineering HUD navigation & live hardware status
│   │   │   ├── Footer.jsx           # Project footer, links, and ethical AI disclosure
│   │   │   ├── StatusBadge.jsx      # Distinguishes LIVE YOLO from BENCHMARK DEMO
│   │   │   ├── ComparisonSlider.jsx # Interactive before/after split image viewer
│   │   │   ├── BoundingBoxViewer.jsx# Interactive SVG overlay with hover synchronization
│   │   │   ├── ScanningEffect.jsx   # Animated green laser HUD scanner
│   │   │   └── ReportModal.jsx      # PDF report generator & JSON telemetry exporter
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Hero, scanning effects, taxonomy, tech stack
│   │   │   ├── InspectorPage.jsx    # Primary drag-and-drop live detection workspace
│   │   │   ├── ResultsPage.jsx      # Detailed telemetry, slider, and defect table
│   │   │   ├── PipelinePage.jsx     # Interactive 8-stage deep learning workflow
│   │   │   ├── AnalyticsPage.jsx    # Recharts metrics, loss curves, confusion matrix
│   │   │   └── AboutPage.jsx        # Problem statement, civil applications, limitations, future scope
│   │   ├── services/
│   │   │   ├── api.js               # REST API fetch client
│   │   │   └── pdfGenerator.js      # Executive PDF generation via jsPDF
│   │   ├── utils/
│   │   │   └── constants.js         # Category metadata, colors, pipeline stages, disclaimers
│   │   ├── App.jsx                  # Main router and state manager
│   │   ├── main.jsx                 # React root
│   │   └── index.css                # Tailwind base + custom neon animations & grid patterns
│   ├── public/
│   │   └── favicon.svg              # HUD reticle SVG favicon
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
│
├── run_app.sh                  # One-click startup script for both servers
└── README.md                   # Complete documentation
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **Python:** v3.10 to v3.12 (Python 3.12 recommended)
- **Git**

### Method 1: One-Click Startup (Recommended)

Run the automated startup script from the project root:

```bash
chmod +x run_app.sh
./run_app.sh
```

This script automatically verifies dependencies, starts the FastAPI backend on port `8000`, launches the Vite frontend on port `5173`, and opens the platform in your browser.

---

### Method 2: Manual Step-by-Step Setup

#### Step 1: Backend Setup
```bash
cd backend

# Create and activate virtual environment
python3.12 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Run integration tests to verify model loading
python test_backend.py

# Launch FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend Swagger API Documentation:* `http://localhost:8000/docs`

#### Step 2: Frontend Setup
In a new terminal window:
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend Application:* `http://localhost:5173`

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Reports model loaded state, runtime hardware (MPS/CUDA/CPU), supported classes |
| `GET` | `/api/samples` | Catalog of pre-indexed benchmark road images with defect summaries |
| `POST` | `/api/detect` | Accepts uploaded image or `sample_id` + confidence; runs YOLO inference |
| `GET` | `/api/metrics` | Returns genuine RDD2020 benchmark mAP, precision, recall, and confusion matrix |
| `POST` | `/api/report/export-json` | Validates and exports structured inspection telemetry |

---

## 🛡️ Academic & Engineering Integrity Disclosure

1. **Hardware Transparency:** Hardware acceleration is reported honestly through `torch.cuda.is_available()` or `torch.backends.mps.is_available()`. It will never claim CUDA or TensorRT when executing on Apple Silicon MPS or CPU.
2. **Attribution of Demo Mode:** When running benchmark sample images or if custom weights are missing, the UI prominently displays `[BENCHMARK DEMO MODE: Ground-Truth Reference]` rather than misrepresenting pre-computed benchmarks as live inference.
3. **Experimental Priority Triage:** The repair priority and urgency score are explicitly labeled as **rule-based heuristics** calculated from defect counts, surface area, and distress severity weighting. They are NOT certified Pavement Condition Index (PCI) values or direct neural predictions.
4. **Future Scope Boundaries:** Video stream inference, native mobile apps, and edge TensorRT optimization are transparently identified as **future research possibilities**, not currently completed features.

---

## 👥 Credits & References

- **Dataset:** Arya et al., *Global Road Damage Detection Challenge (RDD2020)*, IEEE BigData Cup.
- **Deep Learning Framework:** Ultralytics YOLOv8 by Glenn Jocher et al.
- **Core Internship Project:** Automated Road Damage Detection Using Deep Learning by Jitendra.
