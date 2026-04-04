import io
import time
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from picamera2 import Picamera2

app = FastAPI()

# 1. Initialize and Configure Camera
picam2 = Picamera2()
# Using 640x480 for the Pi 3 to ensure low latency
config = picam2.create_video_configuration(main={"size": (640, 480)})
picam2.configure(config)
picam2.start()

def generate_frames():
    """Continuously captures JPEGs from the camera and yields them."""
    # We reuse the same BytesIO object to save memory/CPU on the Pi 3
    stream = io.BytesIO()

    while True:
        # Clear the stream for the next frame
        stream.seek(0)
        stream.truncate()

        # Capture a single frame as a JPEG directly into our stream
        # This bypasses the need for manual encoders
        picam2.capture_file(stream, format="jpeg")

        frame = stream.getvalue()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        # Small sleep to prevent CPU spiking,
        # though capture_file naturally limits to the camera's framerate
        time.sleep(0.01)

@app.get("/video_feed")
async def video_feed():
    """Streaming endpoint."""
    return StreamingResponse(generate_frames(),
                             media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/")
async def index():
    """Simple UI for the network stream."""
    from fastapi.responses import HTMLResponse
    return HTMLResponse(content="""
        <html>
            <head>
                <title>Pi 3 Stream</title>
                <style>
                    body { background: #000; color: #0f0; text-align: center; font-family: monospace; }
                    img { border: 2px solid #333; margin-top: 20px; width: 100%; max-width: 640px; }
                </style>
            </head>
            <body>
                <h2>SYSTEM: LIVE_CAMERA_FEED // PI_3</h2>
                <img src="/video_feed" />
                <p>Status: Streaming via FastAPI</p>
            </body>
        </html>
    """)

if __name__ == "__main__":
    import uvicorn
    # Make sure to use 0.0.0.0 so you can see it from your other devices!
    uvicorn.run(app, host="0.0.0.0", port=8000)
