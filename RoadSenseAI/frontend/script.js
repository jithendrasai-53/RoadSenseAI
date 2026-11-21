const API_BASE = "http://127.0.0.1:5000";
const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const button = document.getElementById("analyzeBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
let selectedFile = null;

input.addEventListener("change", () => {
  selectedFile = input.files && input.files[0] ? input.files[0] : null;
  resultEl.hidden = true;
  if (!selectedFile) { button.disabled = true; preview.hidden = true; return; }
  if (!["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)) {
    statusEl.textContent = "Please select a JPG, PNG, or WEBP image.";
    selectedFile = null; button.disabled = true; preview.hidden = true; return;
  }
  if (selectedFile.size > 10 * 1024 * 1024) {
    statusEl.textContent = "File is larger than 10 MB.";
    selectedFile = null; button.disabled = true; preview.hidden = true; return;
  }
  preview.src = URL.createObjectURL(selectedFile);
  preview.hidden = false; button.disabled = false;
  statusEl.textContent = `${selectedFile.name} selected.`;
});

button.addEventListener("click", async () => {
  if (!selectedFile) return;
  button.disabled = true; statusEl.textContent = "Uploading image…"; resultEl.hidden = true;
  const data = new FormData(); data.append("image", selectedFile);
  try {
    const response = await fetch(`${API_BASE}/api/predict`, {method:"POST", body:data});
    const payload = await response.json();
    statusEl.textContent = response.ok ? "Backend response received." : (payload.message || "Request failed.");
    resultEl.textContent = JSON.stringify(payload, null, 2);
    resultEl.hidden = false;
  } catch (err) {
    statusEl.textContent = "Could not reach backend. Start the Flask server and try again.";
  } finally { button.disabled = !selectedFile; }
});