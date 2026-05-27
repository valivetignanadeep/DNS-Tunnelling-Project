from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import uuid

# Add the 'backend' folder to the python path to load the existing analyzer
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from analyzer import DNSAnalyzer

app = Flask(__name__)
CORS(app)

# Use Vercel's temporary writable folder for file operations
UPLOAD_FOLDER = '/tmp'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

analyzer = DNSAnalyzer()

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file:
        filename = f"{uuid.uuid4()}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        try:
            results_data = analyzer.analyze_pcap(filepath)
            # Cleanup file after analysis
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify(results_data)
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500

@app.route('/api/live/start', methods=['POST'])
def live_start():
    # Vercel serverless has a 10s-60s timeout and cannot run persistent scapy background capture
    # Return a success flag with serverless status so front-end knows it's a serverless simulation environment
    return jsonify({
        'status': 'simulation_started',
        'environment': 'serverless',
        'message': 'Vercel Serverless environment initialized. Client-side telemetry stream active.'
    })

@app.route('/api/live/stop', methods=['POST'])
def live_stop():
    return jsonify({'status': 'stopped'})

@app.route('/api/live/status', methods=['GET'])
def live_status():
    # Return basic success to keep polling endpoints happy
    return jsonify({
        'status': 'simulated',
        'environment': 'serverless'
    })

# If run directly (e.g. for local test)
if __name__ == '__main__':
    app.run(debug=True, port=5000)
