# Model weights

Place your trained road-damage detection model and any label/config files in this folder.

This package does not contain trained weights or claim to perform real AI inference. Connect your actual model in `backend/app.py` inside the `/api/predict` route. Return real class names, confidence values and (if supported) bounding boxes.
