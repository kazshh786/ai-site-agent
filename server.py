# FILE: server.py
# This script runs a Flask web server to act as the backend for our AI Site Generator.
# It receives the project brief from the frontend, runs the main generation script,
# and streams the output back to the browser in real-time.
# FIX: Added explicit CORS configuration to solve the "Failed to fetch" error.

import subprocess
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)

# --- DEFINITIVE CORS FIX ---
# This explicitly tells the server to accept requests from your frontend domain.
# This is the standard and secure way to handle cross-origin requests.
CORS(app, resources={r"/generate-site": {"origins": "https://ai.kasimshah.com"}})

@app.route('/generate-site', methods=['POST'])
def generate_site_endpoint():
    """
    This is the main API endpoint. It receives the form data and
    initiates the website generation process.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request. No data provided."}), 400

    company_name = data.get('company_name')
    domain_name = data.get('domain_name')
    industry = data.get('industry')
    
    if not all([company_name, domain_name, industry]):
        return jsonify({"error": "Missing required fields: company_name, domain_name, industry"}), 400

    def generate():
        """
        Runs the main.py script as a subprocess and yields its output.
        """
        command = [
            'python3', 
            './main.py',
            '--company', company_name,
            '--domain', domain_name,
            '--industry', industry
        ]
        
        process = subprocess.Popen(
            command, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.STDOUT, 
            text=True,
            bufsize=1,
            universal_newlines=True
        )

        for line in iter(process.stdout.readline, ''):
            yield line.replace('\n', '\\n')

        process.stdout.close()
        return_code = process.wait()
        
        if return_code != 0:
            yield f"Error: The script failed with exit code {return_code}.\\n"

    return Response(generate(), mimetype='text/plain')

if __name__ == '__main__':
    # Run the server on localhost, port 5000.
    # Nginx will handle the public-facing traffic.
    app.run(host='127.0.0.1', port=5000, debug=True)
