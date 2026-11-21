"""
Script to generate synthetic high-fidelity asphalt road sample images with authentic defect features.
These provide benchmark test samples for the Road Sense AI platform.
"""
import os
import math
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "static", "samples")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_asphalt_texture(width=800, height=600, base_color=(55, 58, 56)):
    """Generate textured asphalt canvas with aggregate pebbles and lighting gradient."""
    # Base grayscale noise
    np.random.seed(42)
    noise = np.random.normal(0, 18, (height, width, 3))
    base = np.full((height, width, 3), base_color, dtype=np.float32)
    img_data = np.clip(base + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(img_data)
    
    # Add subtle aggregate specks
    draw = ImageDraw.Draw(img)
    for _ in range(1200):
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        r = random.randint(1, 3)
        c = random.choice([40, 75, 95, 110, 130])
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(c, c, c))
        
    return img

def draw_road_lane_markings(img, draw_line=True, side='left'):
    draw = ImageDraw.Draw(img)
    w, h = img.size
    if draw_line:
        # Yellow or white dashed line
        if side == 'left':
            x_start = int(w * 0.12)
            for y in range(0, h, 60):
                draw.rectangle([x_start - 4, y, x_start + 4, y + 35], fill=(210, 180, 50, 180))
        elif side == 'right':
            x_start = int(w * 0.88)
            draw.line([(x_start, 0), (x_start, h)], fill=(220, 220, 220, 200), width=6)

def generate_crack_path(start_pt, length, angle_deg, roughness=8, branch_prob=0.0):
    """Generate tortuous crack coordinates."""
    points = [start_pt]
    curr_x, curr_y = start_pt
    angle_rad = math.radians(angle_deg)
    
    step_size = 12
    num_steps = int(length / step_size)
    
    for _ in range(num_steps):
        jitter = random.uniform(-roughness, roughness)
        curr_x += step_size * math.cos(angle_rad) + jitter * math.sin(angle_rad)
        curr_y += step_size * math.sin(angle_rad) + jitter * math.cos(angle_rad)
        points.append((curr_x, curr_y))
        
    return points

def render_crack(draw, points, width=3, color=(20, 22, 20)):
    # Render shadow and crack core
    for i in range(len(points) - 1):
        p1 = points[i]
        p2 = points[i + 1]
        # Dark core
        draw.line([p1, p2], fill=color, width=width)
        # Subtle edge highlighting (weathered rim)
        draw.line([(p1[0] + 1, p1[1] + 1), (p2[0] + 1, p2[1] + 1)], fill=(75, 78, 75), width=max(1, width - 2))

def create_sample_1_longitudinal():
    img = create_asphalt_texture(800, 600, (52, 54, 52))
    draw_road_lane_markings(img, True, 'left')
    draw_road_lane_markings(img, True, 'right')
    draw = ImageDraw.Draw(img)
    
    # Longitudinal crack running vertically (D00)
    random.seed(101)
    pts1 = generate_crack_path((360, 40), 510, 88, roughness=7)
    render_crack(draw, pts1, width=4, color=(15, 17, 15))
    
    # Secondary minor parallel fissure
    pts2 = generate_crack_path((385, 150), 320, 92, roughness=5)
    render_crack(draw, pts2, width=2, color=(22, 24, 22))
    
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(os.path.join(OUTPUT_DIR, "sample_d00_longitudinal.jpg"), quality=95)
    print("Saved sample_d00_longitudinal.jpg")

def create_sample_2_transverse():
    img = create_asphalt_texture(800, 600, (58, 60, 58))
    draw_road_lane_markings(img, True, 'left')
    draw = ImageDraw.Draw(img)
    
    # Transverse cracks running horizontally across the lane (D10)
    random.seed(202)
    pts1 = generate_crack_path((140, 240), 520, 2, roughness=6)
    render_crack(draw, pts1, width=5, color=(16, 18, 16))
    
    pts2 = generate_crack_path((220, 430), 440, -4, roughness=5)
    render_crack(draw, pts2, width=4, color=(18, 20, 18))
    
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(os.path.join(OUTPUT_DIR, "sample_d10_transverse.jpg"), quality=95)
    print("Saved sample_d10_transverse.jpg")

def create_sample_3_alligator():
    img = create_asphalt_texture(800, 600, (50, 52, 50))
    draw_road_lane_markings(img, True, 'right')
    draw = ImageDraw.Draw(img)
    
    # Alligator cracking: polygon block network (D20)
    random.seed(303)
    center_x, center_y = 420, 310
    radius = 160
    
    # Create intersecting web
    nodes = []
    for _ in range(28):
        nx = center_x + random.randint(-radius, radius)
        ny = center_y + random.randint(int(-radius * 0.7), int(radius * 0.7))
        nodes.append((nx, ny))
        
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            dist = math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1])
            if dist < 65:
                pts = generate_crack_path(nodes[i], dist, math.degrees(math.atan2(nodes[j][1] - nodes[i][1], nodes[j][0] - nodes[i][0])), roughness=3)
                render_crack(draw, pts, width=3, color=(12, 14, 12))
                
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(os.path.join(OUTPUT_DIR, "sample_d20_alligator.jpg"), quality=95)
    print("Saved sample_d20_alligator.jpg")

def create_sample_4_pothole():
    img = create_asphalt_texture(800, 600, (54, 56, 54))
    draw_road_lane_markings(img, True, 'left')
    draw = ImageDraw.Draw(img)
    
    # Pothole cavity (D40)
    random.seed(404)
    cx, cy = 410, 320
    rx, ry = 110, 75
    
    # Outer broken lip
    for r in range(12):
        shade = 45 + r * 2
        draw.ellipse([cx - rx - 8 + r, cy - ry - 6 + r, cx + rx + 8 - r, cy + ry + 6 - r], fill=(shade, shade, shade))
        
    # Deep inner hole
    draw.ellipse([cx - rx + 5, cy - ry + 4, cx + rx - 5, cy + ry - 4], fill=(12, 14, 12))
    draw.ellipse([cx - rx + 25, cy - ry + 15, cx + rx - 15, cy + ry - 10], fill=(6, 8, 6))
    
    # Loose gravel particles inside cavity
    for _ in range(40):
        gx = cx + random.randint(-rx + 30, rx - 30)
        gy = cy + random.randint(-ry + 20, ry - 20)
        draw.ellipse([gx - 3, gy - 2, gx + 3, gy + 2], fill=(60, 65, 60))
        
    # Radially propagating edge microcracks
    for ang in [15, 65, 120, 195, 250, 310]:
        sx = cx + rx * math.cos(math.radians(ang))
        sy = cy + ry * math.sin(math.radians(ang))
        pts = generate_crack_path((sx, sy), random.randint(35, 75), ang, roughness=4)
        render_crack(draw, pts, width=2, color=(18, 20, 18))
        
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(os.path.join(OUTPUT_DIR, "sample_d40_pothole.jpg"), quality=95)
    print("Saved sample_d40_pothole.jpg")

def create_sample_5_multi():
    img = create_asphalt_texture(800, 600, (48, 50, 48))
    draw_road_lane_markings(img, True, 'left')
    draw_road_lane_markings(img, True, 'right')
    draw = ImageDraw.Draw(img)
    
    random.seed(505)
    # Defect 1: Longitudinal crack on left side
    pts1 = generate_crack_path((260, 60), 380, 84, roughness=6)
    render_crack(draw, pts1, width=3, color=(14, 16, 14))
    
    # Defect 2: Transverse crack crossing upper road
    pts2 = generate_crack_path((180, 160), 460, 5, roughness=5)
    render_crack(draw, pts2, width=4, color=(16, 18, 16))
    
    # Defect 3: Moderate pothole on lower right
    cx, cy, rx, ry = 530, 420, 85, 55
    draw.ellipse([cx - rx - 5, cy - ry - 4, cx + rx + 5, cy + ry + 4], fill=(38, 40, 38))
    draw.ellipse([cx - rx + 5, cy - ry + 4, cx + rx - 5, cy + ry - 4], fill=(10, 12, 10))
    for _ in range(25):
        gx = cx + random.randint(-rx + 20, rx - 20)
        gy = cy + random.randint(-ry + 15, ry - 15)
        draw.ellipse([gx - 2, gy - 2, gx + 2, gy + 2], fill=(65, 70, 65))
        
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(os.path.join(OUTPUT_DIR, "sample_multi_defect.jpg"), quality=95)
    print("Saved sample_multi_defect.jpg")

if __name__ == "__main__":
    create_sample_1_longitudinal()
    create_sample_2_transverse()
    create_sample_3_alligator()
    create_sample_4_pothole()
    create_sample_5_multi()
    print("All 5 road damage benchmark samples generated successfully.")
