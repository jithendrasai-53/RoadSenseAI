#!/usr/bin/env bash
# Render build script for Road Sense AI Backend
set -e

echo "[*] Upgrading pip..."
pip install --upgrade pip

echo "[*] Installing lightweight CPU PyTorch (prevents 512MB RAM/disk limit exhaustion)..."
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

echo "[*] Installing remaining dependencies..."
pip install -r requirements.txt

echo "[*] Backend build completed successfully!"
