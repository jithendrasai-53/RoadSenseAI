# RoadSenseAI — VS Code Full-Stack Starter

A small frontend + Python Flask backend project for the RoadSenseAI road-damage detection concept.

## Folder structure

```text
RoadSenseAI/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── models/
│   │   └── README.md
│   └── uploads/
└── README.md
```

## Requirements
- Python 3.10 or newer
- Visual Studio Code
- A modern browser

## Run the backend
Open a VS Code terminal and run:

```bash
cd backend
python -m venv .venv
```

Activate the environment:

**Windows CMD**
```bat
.venv\\Scripts\\activate
```

**Windows PowerShell**
```powershell
.\\.venv\\Scripts\\Activate.ps1
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

Install dependencies and start Flask:

```bash
pip install -r requirements.txt
python app.py
```

Backend health check: http://127.0.0.1:5000/api/health

## Run the frontend
Keep the backend terminal running. Open a second terminal:

```bash
cd frontend
python -m http.server 5500
```

Open http://127.0.0.1:5500 in your browser.

## Important: model status
The frontend upload and backend API connection are implemented. The backend validates and saves an uploaded image, but returns `model_not_configured` because no trained model file was supplied. To get real pothole/crack detection, add your trained model weights and implement inference at the marked integration point in `backend/app.py`. Do not present the starter upload response as an AI prediction.

## API
- `GET /api/health` — backend health check.
- `POST /api/predict` — multipart form upload; field name must be `image`. Accepts JPG/JPEG/PNG/WEBP up to 10 MB.
