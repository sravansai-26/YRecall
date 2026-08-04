
import cv2
import numpy as np
from PIL import Image

video_path = r'c:\Users\Sravan\Projects\YRecall\04_Development\mobile\assets\animations\oboarding-video-org-final.webm'
output_path = r'c:\Users\Sravan\Projects\YRecall\04_Development\mobile\assets\animations\splash-anim.webp'

print('Opening video...')
cap = cv2.VideoCapture(video_path)
frames = []
fps = cap.get(cv2.CAP_PROP_FPS)
duration = int(1000 / fps) if fps > 0 else 33
print(f'FPS: {fps}, Duration per frame: {duration}ms')

ret, first_frame = cap.read()
if not ret:
    print('Could not read first frame')
    exit(1)

bg_color = first_frame[10, 10]
print(f'Background color detected: {bg_color}')
cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
        
    rgba = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)
    lower = np.array([max(0, int(c) - 25) for c in bg_color], dtype=np.uint8)
    upper = np.array([min(255, int(c) + 25) for c in bg_color], dtype=np.uint8)
    
    mask = cv2.inRange(frame, lower, upper)
    mask = cv2.GaussianBlur(mask, (3, 3), 0)
    
    alpha = 255 - mask
    rgba[:, :, 3] = alpha
    
    rgba_pil = cv2.cvtColor(rgba, cv2.COLOR_BGRA2RGBA)
    img = Image.fromarray(rgba_pil)
    frames.append(img)
    count += 1
    if count % 20 == 0:
        print(f'Processed {count} frames...')

cap.release()
print(f'Finished processing {count} frames. Saving WebP...')

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
    print('Successfully converted to transparent WebP!')
else:
    print('No frames processed.')

