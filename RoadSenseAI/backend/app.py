from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pathlib import Path
from uuid import uuid4

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "RoadSenseAI backend"})

@app.post("/api/predict")
def predict():
    if "image" not in request.files:
        return jsonify({"status": "error", "message": "No image field was provided."}), 400
    image = request.files["image"]
    if not image.filename:
        return jsonify({"status": "error", "message": "No file was selected."}), 400
    if not allowed_file(image.filename):
        return jsonify({"status": "error", "message": "Only JPG, JPEG, PNG and WEBP files are accepted."}), 415

    safe_name = secure_filename(image.filename)
    saved_name = f"{uuid4().hex}_{safe_name}"
    save_path = UPLOAD_DIR / saved_name
    image.save(save_path)

    # Model integration point:
    # Load your trained detector here, preprocess save_path, run inference,
    # and return actual class labels, confidence scores and bounding boxes.
    return jsonify({
        "status": "model_not_configured",
        "message": "Image uploaded successfully. No trained model weights are included in this starter package.",
        "filename": safe_name,
        "stored_as": saved_name,
        "next_step": "Add your trained model and implement inference in backend/app.py."
    }), 501

@app.errorhandler(413)
def too_large(_error):
    return jsonify({"status": "error", "message": "Image exceeds the 10 MB upload limit."}), 413

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
