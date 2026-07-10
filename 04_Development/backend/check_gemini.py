import os
import sys

sys.path.append(os.path.join(os.getcwd(), '04_Development', 'backend'))

from google import genai
from google.genai import types
from app.core.config import settings

def main():
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    # create a dummy image
    dummy_image = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00C\x00'
    mime = 'image/jpeg'
    
    part = types.Part.from_bytes(data=dummy_image, mime_type=mime)
    
    print("Part object:", part)
    print("Part type:", type(part))
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                part,
                'Describe this image in detail and extract any text present in it.'
            ]
        )
        print("Success:", response.text)
    except Exception as e:
        print("Error calling generate_content:", repr(e))

if __name__ == "__main__":
    main()
