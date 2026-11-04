#!/usr/bin/env python3
"""Enhance Casa Playa 204 photos: brighter, warmer, richer; export responsive WebP with SEO names."""
import os
from PIL import Image, ImageEnhance

SRC = "/mnt/user-data/attachments/4e6d0c84-8f0e-5721-a8c0-5145a902b51d"
OUT = "/home/claude/george/public/images/casa-playa-204"
os.makedirs(OUT, exist_ok=True)

# attachment-id -> seo name
MAP = {
    "010c1e15-image.png": "casa-playa-204-aruba-arcade-arched-windows-oranjestad",
    "d4c8224c-image.jpg": "casa-playa-aruba-royal-plaza-arcade-green-white-tile",
    "2e55444c-image.jpg": "casa-playa-204-aruba-king-bed-bedroom-vacation-rental",
    "0da7a5f4-image.jpg": "casa-playa-204-aruba-bedroom-king-bed-smart-tv",
    "0044a041-image.jpg": "casa-playa-204-aruba-bathroom-rainfall-shower-gold-fixtures",
    "b6032de6-image.jpg": "casa-playa-204-aruba-balcony-dining-royal-plaza-courtyard",
    "98ae97be-image.jpg": "casa-playa-204-aruba-balcony-dutch-colonial-architecture-view",
    "ac420114-image.jpg": "casa-playa-204-aruba-balcony-view-oranjestad-harbor",
    "29deec32-image.jpg": "casa-playa-204-aruba-open-plan-living-room-green-kitchen",
    "497a4a46-image.jpg": "casa-playa-204-aruba-living-room-smart-tv-kitchen",
    "0e107b14-image.jpg": "casa-playa-204-aruba-dining-area-coffee-station",
    "8b62d716-image.jpg": "casa-playa-204-aruba-kitchen-green-cabinets-dining-table",
    "9f27e693-image.jpg": "casa-playa-204-aruba-living-dining-room-natural-light",
    "1372a691-image.jpg": "casa-playa-204-aruba-living-room-balcony-royal-plaza-view",
    "d020f108-image.jpg": "casa-playa-204-aruba-sofa-dutch-colonial-window-view",
    "2242aebd-image.jpg": "casa-playa-204-aruba-remote-work-desk-nook",
    "f761eba6-image.jpg": "casa-playa-204-aruba-dining-table-seats-four",
    "2491e8a4-image.jpg": "casa-playa-204-aruba-full-kitchen-oven-refrigerator",
    "a84d974f-image.jpg": "casa-playa-204-aruba-washer-dryer-laundry",
}

SIZES = [1920, 1280, 800, 480]

def warm(img, strength=1.0):
    """Warm color cast: lift reds, slightly reduce blues."""
    r, g, b = img.split()
    r = r.point(lambda i: min(255, int(i * (1 + 0.045 * strength))))
    g = g.point(lambda i: min(255, int(i * (1 + 0.012 * strength))))
    b = b.point(lambda i: int(i * (1 - 0.035 * strength)))
    return Image.merge("RGB", (r, g, b))

for src_name, seo in MAP.items():
    path = os.path.join(SRC, src_name)
    img = Image.open(path).convert("RGB")
    # Enhancement pipeline: brightness, warmth, saturation, contrast, slight sharpen
    img = ImageEnhance.Brightness(img).enhance(1.07)
    img = warm(img, 1.0)
    img = ImageEnhance.Color(img).enhance(1.12)
    img = ImageEnhance.Contrast(img).enhance(1.05)
    img = ImageEnhance.Sharpness(img).enhance(1.08)
    w, h = img.size
    for target in SIZES:
        if target > w and target != min(SIZES):
            continue
        tw = min(target, w)
        th = int(h * tw / w)
        resized = img.resize((tw, th), Image.LANCZOS)
        suffix = "" if target == 1920 else f"-{target}w"
        out_path = os.path.join(OUT, f"{seo}{suffix}.webp")
        resized.save(out_path, "WEBP", quality=82, method=6)
    print(f"{src_name} -> {seo}.webp ({w}x{h})")

total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
print(f"\n{len(os.listdir(OUT))} files, total {total/1024/1024:.1f} MB")
