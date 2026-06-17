from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
# Allow Next.js frontend
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Flask API is running"})

@app.route("/api/v1/generate/request", methods=["POST"])
def generate_try_on():
    """
    Mock AI Generation Endpoint.
    Artificially delays for 8 seconds to simulate GPU processing time.
    """
    data = request.json
    garment_id = data.get("garment_id")
    user_image = data.get("user_image_data")
    
    print(f"Received generation request for garment {garment_id}. Processing...")
    
    # Simulate heavy GPU processing
    time.sleep(8)
    
    print("Generation complete.")
    return jsonify({
        "status": "completed",
        "result_image_url": user_image, 
        "message": "AI Generation completed successfully (Mock)"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
