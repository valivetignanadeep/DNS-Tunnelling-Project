from flask import Flask, request, jsonify
from flask_cors import CORS
from analyzer import DNSAnalyzer
from live_sniffer import LiveSniffer
import os
import uuid

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

analyzer = DNSAnalyzer()
live_sniffer = LiveSniffer()

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
            # Clean up file after analysis
            os.remove(filepath)
            return jsonify(results_data)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/api/live/start', methods=['POST'])
def start_live_sniffer():
    try:
        live_sniffer.start()
        return jsonify({'status': 'success', 'message': 'Live sniffer interface online'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/live/stop', methods=['POST'])
def stop_live_sniffer():
    try:
        live_sniffer.stop()
        return jsonify({'status': 'success', 'message': 'Live sniffer interface offline'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/live/status', methods=['GET'])
def get_live_status():
    try:
        return jsonify(live_sniffer.get_status())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/live/clear', methods=['POST'])
def clear_live_telemetry():
    try:
        live_sniffer.clear()
        return jsonify({'status': 'success', 'message': 'Live databases cleared'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
