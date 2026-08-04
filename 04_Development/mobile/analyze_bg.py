import cv2

def analyze_video_bg(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame.")
        return

    # Get color of top-left pixel
    bg_color = frame[0, 0]
    
    # Also get bottom-right just to compare
    h, w = frame.shape[:2]
    bg_color_br = frame[h-1, w-1]
    
    # Calculate average of borders just in case
    top_edge = frame[0, :].mean(axis=0)
    
    print(f"Top-Left BGR: {bg_color}")
    print(f"Bottom-Right BGR: {bg_color_br}")
    print(f"Top Edge Avg BGR: {top_edge}")
    
    # BGR to Hex
    b, g, r = bg_color
    hex_color = "#{:02x}{:02x}{:02x}".format(int(r), int(g), int(b))
    print(f"Recommended Background Hex: {hex_color.upper()}")

    cap.release()

if __name__ == '__main__':
    analyze_video_bg('C:/Users/Sravan/Projects/YRecall/04_Development/mobile/src/assets/splash-intro-video.mp4')
