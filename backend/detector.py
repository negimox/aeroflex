"""
Real-time Object Detection Server for Pi Camera Stream
Uses YOLOv8 on GPU to process MJPEG stream and serve annotated frames.

Optimized for small object detection (cellphones, tape, etc.)
"""

import io
import time
import threading
from typing import Optional
from contextlib import asynccontextmanager
import cv2
import numpy as np
import requests
import torch
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

# Configuration
PI_STREAM_URL = "http://10.97.233.251:8000/video_feed"

# YOLOv8s (small) is better for detecting small objects like phones, tape
# Options: yolov8n.pt (fastest), yolov8s.pt (balanced), yolov8m.pt (most accurate)
MODEL_NAME = "yolov8s.pt"

# Lower confidence for small/hard-to-detect objects
CONFIDENCE_THRESHOLD = 0.25

# Input size for inference (larger = better small object detection, slower)
# 640 is default, 800-1280 better for small objects
INFERENCE_SIZE = 640

# Global state
model: Optional[YOLO] = None
latest_detections: list = []
fps: float = 0.0
frame_lock = threading.Lock()
latest_frame: Optional[bytes] = None


def load_model():
    """Load YOLOv8 model with proper GPU detection."""
    global model
    print(f"Loading {MODEL_NAME}...")
    model = YOLO(MODEL_NAME)
    
    # Proper CUDA detection using PyTorch
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model.to(device)
    
    if torch.cuda.is_available():
        print(f"✓ GPU detected: {torch.cuda.get_device_name(0)}")
        print(f"✓ CUDA version: {torch.version.cuda}")
    else:
        print("⚠ Running on CPU - detection will be slower")
    
    print(f"Model loaded on: {device}")
    return model


def process_stream():
    """Background thread: fetch Pi stream, run detection, update latest_frame."""
    global latest_frame, latest_detections, fps

    # Boundary for MJPEG parsing
    bytes_buffer = b''
    frame_count = 0
    start_time = time.time()

    while True:
        try:
            # Connect to Pi stream
            response = requests.get(PI_STREAM_URL, stream=True, timeout=10)
            print(f"Connected to Pi stream: {PI_STREAM_URL}")

            for chunk in response.iter_content(chunk_size=4096):
                bytes_buffer += chunk

                # Find JPEG frame boundaries
                start = bytes_buffer.find(b'\xff\xd8')  # JPEG start
                end = bytes_buffer.find(b'\xff\xd9')    # JPEG end

                if start != -1 and end != -1 and end > start:
                    # Extract JPEG frame
                    jpg_data = bytes_buffer[start:end+2]
                    bytes_buffer = bytes_buffer[end+2:]

                    # Decode frame
                    np_arr = np.frombuffer(jpg_data, dtype=np.uint8)
                    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

                    if frame is None:
                        continue

                    # Run YOLOv8 inference with optimized settings
                    # - Lower conf threshold for small objects
                    # - imgsz controls input resolution
                    results = model(
                        frame, 
                        verbose=False, 
                        conf=CONFIDENCE_THRESHOLD,
                        imgsz=INFERENCE_SIZE,
                        iou=0.45,  # NMS IoU threshold
                    )

                    # Draw detections
                    annotated_frame = results[0].plot()

                    # Extract detection info
                    detections = []
                    for box in results[0].boxes:
                        cls_id = int(box.cls[0])
                        conf = float(box.conf[0])
                        label = model.names[cls_id]
                        detections.append({
                            "label": label,
                            "confidence": round(conf, 2),
                            "bbox": box.xyxy[0].tolist()
                        })

                    # Encode annotated frame to JPEG
                    _, encoded = cv2.imencode('.jpg', annotated_frame,
                                              [cv2.IMWRITE_JPEG_QUALITY, 85])

                    # Update global state
                    with frame_lock:
                        latest_frame = encoded.tobytes()
                        latest_detections = detections

                    # Calculate FPS
                    frame_count += 1
                    elapsed = time.time() - start_time
                    if elapsed >= 1.0:
                        fps = frame_count / elapsed
                        frame_count = 0
                        start_time = time.time()

        except requests.exceptions.RequestException as e:
            print(f"Stream connection error: {e}. Retrying in 2s...")
            time.sleep(2)
        except Exception as e:
            print(f"Processing error: {e}")
            time.sleep(0.1)


def generate_frames():
    """Yield annotated frames as MJPEG stream."""
    while True:
        with frame_lock:
            frame = latest_frame

        if frame is not None:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        time.sleep(0.01)  # ~100 FPS max, limited by actual processing


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Modern lifespan handler for startup/shutdown."""
    # Startup
    load_model()
    thread = threading.Thread(target=process_stream, daemon=True)
    thread.start()
    print("Detection server started!")
    yield
    # Shutdown (cleanup if needed)
    print("Shutting down...")


# Re-create app with lifespan
app = FastAPI(title="Object Detection Server", lifespan=lifespan)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def index():
    """Simple status page."""
    return {"status": "running", "model": MODEL_NAME, "stream_url": "/video_feed"}


@app.get("/video_feed")
async def video_feed():
    """Streaming endpoint for annotated frames."""
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.get("/detections")
async def get_detections():
    """Get current detection results as JSON."""
    with frame_lock:
        return JSONResponse({
            "fps": round(fps, 1),
            "detections": latest_detections,
            "count": len(latest_detections)
        })


@app.get("/stats")
async def get_stats():
    """Get detection statistics."""
    with frame_lock:
        labels = [d["label"] for d in latest_detections]

    # Count by label
    label_counts = {}
    for label in labels:
        label_counts[label] = label_counts.get(label, 0) + 1

    return JSONResponse({
        "fps": round(fps, 1),
        "total_objects": len(labels),
        "by_class": label_counts,
        "model": MODEL_NAME
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
