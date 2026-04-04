import io
import time
import glob
import serial
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from picamera2 import Picamera2

app = FastAPI()

# Add CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Camera state tracking
camera_connected = False
picam2 = None

# NodeMCU (AQI module) state tracking
nodemcu_connected = False
nodemcu_port = None

def initialize_camera():
    """Initialize the camera and return success status."""
    global picam2, camera_connected
    try:
        picam2 = Picamera2()
        config = picam2.create_video_configuration(main={"size": (640, 480)})
        picam2.configure(config)
        picam2.start()
        camera_connected = True
        return True
    except Exception as e:
        print(f"Camera initialization failed: {e}")
        camera_connected = False
        return False

def detect_nodemcu():
    """Detect NodeMCU connected via USB serial."""
    global nodemcu_connected, nodemcu_port
    
    # Common USB serial device paths on Raspberry Pi
    serial_ports = glob.glob('/dev/ttyUSB*') + glob.glob('/dev/ttyACM*')
    
    for port in serial_ports:
        try:
            # Try to open the serial port briefly to check if it's accessible
            ser = serial.Serial(port, 115200, timeout=1)
            ser.close()
            nodemcu_connected = True
            nodemcu_port = port
            print(f"NodeMCU detected on {port}")
            return True
        except (serial.SerialException, OSError) as e:
            continue
    
    nodemcu_connected = False
    nodemcu_port = None
    return False

# Initialize camera on startup
initialize_camera()
# Check for NodeMCU on startup
detect_nodemcu()

def generate_frames():
    """Continuously captures JPEGs from the camera and yields them."""
    global camera_connected
    
    if not camera_connected or picam2 is None:
        return
    
    # We reuse the same BytesIO object to save memory/CPU on the Pi 3
    stream = io.BytesIO()

    while True:
        try:
            # Clear the stream for the next frame
            stream.seek(0)
            stream.truncate()

            # Capture a single frame as a JPEG directly into our stream
            picam2.capture_file(stream, format="jpeg")

            frame = stream.getvalue()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            # Small sleep to prevent CPU spiking
            time.sleep(0.01)
        except Exception as e:
            print(f"Frame capture error: {e}")
            camera_connected = False
            break

@app.get("/video_feed")
async def video_feed():
    """Streaming endpoint."""
    return StreamingResponse(generate_frames(),
                             media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/module_status")
async def module_status():
    """Return the current module connection status."""
    global camera_connected, nodemcu_connected
    
    # Check if camera is still working by attempting a test capture
    if camera_connected and picam2 is not None:
        try:
            # Quick health check
            picam2.capture_metadata()
        except Exception:
            camera_connected = False
    
    # Re-check NodeMCU connection
    detect_nodemcu()
    
    # Determine active module (priority: camera > aqi > payload)
    active = None
    if camera_connected:
        active = "camera"
    elif nodemcu_connected:
        active = "aqi"
    
    return JSONResponse(content={
        "modules": {
            "camera": {
                "id": "camera",
                "name": "RGB Camera",
                "connected": camera_connected,
                "specs": {
                    "resolution": "640x480",
                    "fps": "30",
                    "fov": "84°",
                    "encoding": "MJPEG"
                }
            },
            "aqi": {
                "id": "aqi",
                "name": "AQI Module",
                "connected": nodemcu_connected,
                "port": nodemcu_port,
                "specs": {
                    "sensor": "MQ135",
                    "mcu": "NodeMCU",
                    "accuracy": "±5%"
                }
            },
            "payload": {
                "id": "payload", 
                "name": "Payload Module",
                "connected": False,
                "specs": {
                    "max_weight": "2.5kg",
                    "release": "Electromagnetic"
                }
            }
        },
        "active_module": active
    })

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
