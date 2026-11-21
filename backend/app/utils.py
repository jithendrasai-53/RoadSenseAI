import io
import base64
from PIL import Image, ImageDraw, ImageFont
from app.config import DAMAGE_CLASSES

def validate_image(image_bytes: bytes) -> Image.Image:
    """Validate uploaded image file and return PIL Image."""
    if not image_bytes or len(image_bytes) == 0:
        raise ValueError("Uploaded image file is empty.")
    if len(image_bytes) > 15 * 1024 * 1024:
        raise ValueError("Uploaded image exceeds the 15MB size limit.")
    
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        # Re-open after verify() because verify() empties the file buffer
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert("RGB")
        return img
    except Exception as e:
        raise ValueError(f"Corrupt or unsupported image format. Please upload a valid JPEG or PNG. Details: {str(e)}")

def image_to_base64(img: Image.Image, format: str = "JPEG", quality: int = 92) -> str:
    """Encode PIL image to base64 Data URL."""
    buffered = io.BytesIO()
    img.save(buffered, format=format, quality=quality)
    img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/{format.lower()};base64,{img_b64}"

def hex_to_rgb(hex_str: str) -> tuple:
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def calculate_rule_based_priority(detections: list, img_width: int, img_height: int) -> dict:
    """
    Experimental rule-based heuristic for maintenance prioritization.
    Explicitly labeled as an empirical estimate, NOT a trained model prediction or certified PCI.
    """
    if not detections:
        return {
            "priority_level": "None Detected",
            "urgency_score": 0.0,
            "badge_color": "#10B981",
            "recommended_action": "Routine periodic monitoring; no active structural defects detected at current threshold.",
            "estimated_timeframe": "Standard scheduled inspection (6-12 months)",
            "is_heuristic": True,
            "disclaimer": "EXPERIMENTAL ESTIMATE: This prioritization is a rule-based heuristic based on defect frequency and surface area coverage. It is NOT a certified Pavement Condition Index (PCI) or neural network prediction."
        }

    total_image_area = max(1, img_width * img_height)
    total_defect_area = 0.0
    weighted_score = 0.0
    
    counts = {"D00": 0, "D10": 0, "D20": 0, "D40": 0}
    
    for det in detections:
        code = det.get("class_code", "D00")
        bbox = det.get("bbox", [0, 0, 0, 0])
        w = max(0, bbox[2] - bbox[0])
        h = max(0, bbox[3] - bbox[1])
        area = w * h
        total_defect_area += area
        
        weight = DAMAGE_CLASSES.get(code, {}).get("severity_weight", 2.0)
        conf = det.get("confidence", 0.5)
        weighted_score += weight * (0.8 + 0.4 * conf)
        
        if code in counts:
            counts[code] += 1

    area_percentage = (total_defect_area / total_image_area) * 100.0
    # Heuristic composite index: weighted count + surface area impact
    raw_index = weighted_score + (area_percentage * 1.8)
    
    # Scale index into 0 - 100 range
    urgency_score = min(100.0, round(raw_index * 12.0, 1))
    
    # Determine level and engineering recommendation
    if counts["D40"] >= 1 or urgency_score >= 70.0:
        priority_level = "High Priority — Hazard Alert"
        badge_color = "#EF4444"
        recommended_action = "Urgent pothole cavity filling with hot asphalt mix or cold compaction; edge milling and compaction required to prevent tire blowout risks."
        timeframe = "Immediate / Within 48-72 hours"
    elif counts["D20"] >= 1 or urgency_score >= 45.0:
        priority_level = "Medium-High Priority — Base Course Fatigue"
        badge_color = "#F59E0B"
        recommended_action = "Pavement patch repair and structural base stabilization; seal interconnected cracks with polymer-modified bitumen to halt water ingress."
        timeframe = "Within 2 to 4 weeks"
    elif counts["D10"] >= 1 or urgency_score >= 25.0:
        priority_level = "Medium Priority — Contraction Fissures"
        badge_color = "#10B981"
        recommended_action = "Clean and seal transverse cracks using hot-pour elastomeric sealant; monitor joint propagation during temperature shifts."
        timeframe = "Within 1 to 2 months"
    else:
        priority_level = "Low Priority — Surface Maintenance"
        badge_color = "#38BDF8"
        recommended_action = "Preventative crack sealing and micro-surfacing to prevent moisture permeation along longitudinal wheel track distress."
        timeframe = "Standard maintenance schedule (3-6 months)"

    return {
        "priority_level": priority_level,
        "urgency_score": urgency_score,
        "badge_color": badge_color,
        "recommended_action": recommended_action,
        "estimated_timeframe": timeframe,
        "area_coverage_percent": round(area_percentage, 2),
        "is_heuristic": True,
        "disclaimer": "EXPERIMENTAL ESTIMATE: This prioritization is a rule-based heuristic calculated from defect counts, surface area, and distress severity weighting. It is NOT a certified Pavement Condition Index (PCI) or direct neural network prediction."
    }

def render_detection_annotations(img: Image.Image, detections: list) -> Image.Image:
    """Render high-contrast, engineering-style bounding boxes and labels on image."""
    annotated = img.copy()
    draw = ImageDraw.Draw(annotated, "RGBA")
    
    width, height = img.size
    
    for det in detections:
        code = det.get("class_code", "D00")
        name = det.get("class_name", "Damage")
        conf = det.get("confidence", 0.0)
        bbox = det.get("bbox", [0, 0, 0, 0])
        
        color_hex = DAMAGE_CLASSES.get(code, {}).get("color", "#76B900")
        r, g, b = hex_to_rgb(color_hex)
        
        x1, y1, x2, y2 = bbox
        x1 = max(0, min(width - 1, x1))
        y1 = max(0, min(height - 1, y1))
        x2 = max(0, min(width - 1, x2))
        y2 = max(0, min(height - 1, y2))
        
        # 1. Semi-transparent fill highlight
        draw.rectangle([x1, y1, x2, y2], fill=(r, g, b, 45), outline=None)
        
        # 2. Glowing multi-stroke bounding border
        draw.rectangle([x1, y1, x2, y2], outline=(r, g, b, 255), width=3)
        
        # 3. Corner bracket accents for futuristic HUD aesthetic
        corner_len = min(20, max(6, int((x2 - x1) * 0.18)))
        # Top-left
        draw.line([(x1, y1), (x1 + corner_len, y1)], fill=(255, 255, 255, 240), width=4)
        draw.line([(x1, y1), (x1, y1 + corner_len)], fill=(255, 255, 255, 240), width=4)
        # Top-right
        draw.line([(x2, y1), (x2 - corner_len, y1)], fill=(255, 255, 255, 240), width=4)
        draw.line([(x2, y1), (x2, y1 + corner_len)], fill=(255, 255, 255, 240), width=4)
        # Bottom-left
        draw.line([(x1, y2), (x1 + corner_len, y2)], fill=(255, 255, 255, 240), width=4)
        draw.line([(x1, y2), (x1, y2 - corner_len)], fill=(255, 255, 255, 240), width=4)
        # Bottom-right
        draw.line([(x2, y2), (x2 - corner_len, y2)], fill=(255, 255, 255, 240), width=4)
        draw.line([(x2, y2), (x2, y2 - corner_len)], fill=(255, 255, 255, 240), width=4)

        # 4. Text Label Tag
        label_text = f" {code} | {name}  {int(conf * 100)}% "
        # Approximate font metrics
        char_width = 7.5
        tag_w = int(len(label_text) * char_width) + 12
        tag_h = 22
        
        tag_y1 = max(0, y1 - tag_h - 4) if y1 >= tag_h + 4 else y1 + 4
        tag_y2 = tag_y1 + tag_h
        tag_x2 = min(width - 1, x1 + tag_w)
        
        # Tag background
        draw.rectangle([x1, tag_y1, tag_x2, tag_y2], fill=(12, 16, 12, 230), outline=(r, g, b, 255), width=1)
        # Category color indicator bar
        draw.rectangle([x1, tag_y1, x1 + 5, tag_y2], fill=(r, g, b, 255))
        # Text string
        draw.text((x1 + 8, tag_y1 + 4), label_text, fill=(255, 255, 255, 255))

    return annotated
