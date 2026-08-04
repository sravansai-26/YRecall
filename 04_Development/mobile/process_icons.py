import cv2
import numpy as np
import os

def process_icons():
    # Load original logo
    logo_path = 'assets/logos/yr-logo.png'
    img = cv2.imread(logo_path, cv2.IMREAD_UNCHANGED)
    
    if img is None:
        print(f"Could not load {logo_path}")
        return

    # Ensure it has an alpha channel
    if img.shape[2] == 3:
        b, g, r = cv2.split(img)
        a = np.ones(b.shape, dtype=b.dtype) * 255
        # Make white pixels transparent
        mask = (r > 240) & (g > 240) & (b > 240)
        a[mask] = 0
        img = cv2.merge((b, g, r, a))

    # Find bounding box of non-transparent pixels
    a = img[:, :, 3]
    y_indices, x_indices = np.where(a > 0)
    
    if len(y_indices) == 0 or len(x_indices) == 0:
        print("Image is entirely transparent")
        return
        
    y_min, y_max = y_indices.min(), y_indices.max()
    x_min, x_max = x_indices.min(), x_indices.max()
    
    cropped = img[y_min:y_max+1, x_min:x_max+1]
    
    # 1. Generate icon.png (1024x1024) - Large, 10% padding
    def create_padded_icon(cropped_img, size, padding_ratio):
        canvas = np.zeros((size, size, 4), dtype=np.uint8)
        target_size = int(size * (1 - padding_ratio))
        
        # Calculate aspect ratio preserving resize
        h, w = cropped_img.shape[:2]
        scale = min(target_size / w, target_size / h)
        new_w, new_h = int(w * scale), int(h * scale)
        
        resized = cv2.resize(cropped_img, (new_w, new_h), interpolation=cv2.INTER_AREA)
        
        y_offset = (size - new_h) // 2
        x_offset = (size - new_w) // 2
        
        canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
        return canvas

    icon = create_padded_icon(cropped, 1024, 0.15)
    cv2.imwrite('assets/images/icon.png', icon)
    
    # 2. Generate android-icon-foreground.png (1080x1080) - Large, 15% padding
    # Adaptive icons get cropped by a circular mask (safe zone is inner 66%)
    # So we need the logo to fit within the inner 66% roughly, maybe 25% padding is safer.
    # The user complained it was too small, so let's make it fill the safe zone entirely.
    android_fg = create_padded_icon(cropped, 1080, 0.35)
    cv2.imwrite('assets/images/android-icon-foreground.png', android_fg)
    
    # 3. Generate android-icon-background.png (1080x1080) - Transparent
    android_bg = np.zeros((1080, 1080, 4), dtype=np.uint8)
    # The user said "absolute no backgrounds like from white". I'll leave it transparent.
    # We will remove the backgroundColor from app.config.js
    cv2.imwrite('assets/images/android-icon-background.png', android_bg)
    
    # 4. Generate notification-icon.png (96x96) - White silhouette on transparent
    noti_size = 96
    noti_canvas = np.zeros((noti_size, noti_size, 4), dtype=np.uint8)
    
    target_size = int(noti_size * 0.9)
    h, w = cropped.shape[:2]
    scale = min(target_size / w, target_size / h)
    new_w, new_h = int(w * scale), int(h * scale)
    
    resized = cv2.resize(cropped, (new_w, new_h), interpolation=cv2.INTER_AREA)
    
    # Make it a white silhouette
    b, g, r, a = cv2.split(resized)
    white_b = np.ones_like(b) * 255
    white_g = np.ones_like(g) * 255
    white_r = np.ones_like(r) * 255
    silhouette = cv2.merge((white_b, white_g, white_r, a))
    
    y_offset = (noti_size - new_h) // 2
    x_offset = (noti_size - new_w) // 2
    noti_canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = silhouette
    
    cv2.imwrite('assets/images/notification-icon.png', noti_canvas)
    print("Successfully generated all icons!")

if __name__ == '__main__':
    process_icons()
