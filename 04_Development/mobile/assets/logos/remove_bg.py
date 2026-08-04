import cv2
import numpy as np

def remove_background(image_path, output_path):
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"Error loading {image_path}")
        return

    # Check if image has an alpha channel
    if img.shape[2] == 4:
        # It already has an alpha channel. Let's make anything close to white completely transparent.
        b, g, r, a = cv2.split(img)
        # Create a mask where the pixels are white (or very close to it)
        mask = (r > 240) & (g > 240) & (b > 240)
        # Set alpha to 0 for those pixels
        a[mask] = 0
        
        # We might also have a slightly off-white background #F9F9F9 (249, 249, 249)
        img = cv2.merge((b, g, r, a))
        cv2.imwrite(output_path, img)
        print(f"Saved {output_path}")
    else:
        # No alpha channel, add one and make white transparent
        b, g, r = cv2.split(img)
        a = np.ones(b.shape, dtype=b.dtype) * 255
        mask = (r > 240) & (g > 240) & (b > 240)
        a[mask] = 0
        img = cv2.merge((b, g, r, a))
        cv2.imwrite(output_path, img)
        print(f"Saved {output_path}")

remove_background('c:/Users/Sravan/Projects/YRecall/04_Development/mobile/assets/logos/yr-logo.png', 'c:/Users/Sravan/Projects/YRecall/04_Development/mobile/assets/logos/yr-logo.png')
