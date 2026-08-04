import cv2
import numpy as np
from PIL import Image
import os

video_path = r'c:\Users\Sravan\Projects\YRecall\04_Development\mobile\assets\animations\oboarding-video-org.mp4'
output_path = r'c:\Users\Sravan\Projects\YRecall\04_Development\mobile\assets\animations\intro-anim.webp'

print("Opening video...")
cap = cv2.VideoCapture(video_path)
frames = []
fps = cap.get(cv2.CAP_PROP_FPS)
duration = int(1000 / fps) if fps > 0 else 33
print(f"FPS: {fps}, Duration per frame: {duration}ms")

# Sample background color from first frame
ret, first_frame = cap.read()
if not ret:
    print("Could not read first frame")
    exit(1)

# Assume background is near the top left corner (some padding to avoid edge artifacts)
bg_color = first_frame[10, 10]
print(f"Background color detected: {bg_color}")

# Reset video position
cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
        
    # Convert BGR to BGRA
    rgba = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)
    
    # Define color range for background
    lower = np.array([max(0, int(c) - 25) for c in bg_color], dtype=np.uint8)
    upper = np.array([min(255, int(c) + 25) for c in bg_color], dtype=np.uint8)
    
    # Create mask for background
    mask = cv2.inRange(frame, lower, upper)
    
    # Apply a slight blur to the mask to soften edges
    mask = cv2.GaussianBlur(mask, (3, 3), 0)
    
    # Use the mask as the inverted alpha channel
    # Where mask is 255 (background), alpha should be 0
    # Where mask is 0 (foreground), alpha should be 255
    # Wait, GaussianBlur makes intermediate values. 
    # alpha = 255 - mask
    alpha = 255 - mask
    rgba[:, :, 3] = alpha
    
    # Convert BGRA to RGBA for PIL
    rgba_pil = cv2.cvtColor(rgba, cv2.COLOR_BGRA2RGBA)
    img = Image.fromarray(rgba_pil)
    
    # Optional: crop the image to remove empty space if the animation is small
    # But user wants alignment to remain similar, so we'll keep size
    
    frames.append(img)
    count += 1
    if count % 20 == 0:
        print(f"Processed {count} frames...")

cap.release()
print(f"Finished processing {count} frames. Saving WebP...")

if frames:
    frames[0].save(
        output_path,
        format='WEBP',
        append_images=frames[1:],
        save_all=True,
        duration=duration,
        loop=0,
        minimize_size=True,
        method=4,
        quality=80
    )
    print("Successfully converted to transparent WebP!")
else:
    print("No frames processed.")
