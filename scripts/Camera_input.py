import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
from flask_socketio import SocketIO

socketio_app = Flask(__name__)
socketio = SocketIO(socketio_app)

def handle_send_data(data):
    print("Data received by Server:", data)
    # Process data as needed
    # For simplicity, let's just broadcast the received data
    socketio.emit('received_data', data)

app = Flask(__name__, template_folder='../templates', static_folder='../static')
CORS(app)  # Enable CORS for all routes in the Flask app

current_dir = os.path.dirname(os.path.abspath(__file__))
# setting the route and stuff
relative_upload_path = os.path.join('..', 'data', 'Section_Name', 'device1')
absolute_upload_dir = os.path.join(current_dir, relative_upload_path)
os.makedirs(absolute_upload_dir, exist_ok=True)
image_count = 0

@app.route('/')
def index():
    return render_template('Camera_input.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    global image_count
    if 'image' not in request.files:
        return 'No file part', 400
    file = request.files['image']

    if file.filename == '':
        return 'No selected file', 400
    if file:
        # filename = secure_filename(file.filename)
        new_filename = f"image{image_count + 1}.jpg"
        file_path = os.path.join(absolute_upload_dir, new_filename)
        file.save(file_path)
        
        # Increment image count
        image_count += 1
        
        if image_count >= 10:
            # process_images()
            print("Reached 10 images")
            image_count = 0
            # Reset image count after processing
        
        return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200

if __name__ == '__main__':
    app.run(debug=True)
