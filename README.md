# Real-time Automated Facial Recognition Attendance System

## Overview
This project implements a real-time facial recognition attendance system. The system utilizes JavaScript primarily for processing tasks, including importing models, converting images into AI data, and comparing live video frames for facial recognition. Additionally, users can capture attendance either through live video feed or by uploading photos, providing a swift and accurate attendance recording process.

## Features
- Real-time facial recognition
- Photo capture attendance recording
- Secure storage of attendance records
- Elegant presentation of results using canvas overlay

## Technologies Used
- Front-end: HTML5, CSS, JavaScript
- Back-end: Python, [Flask](https://flask.palletsprojects.com/en/2.0.x/) , JavaScript
- Database: [MySQL](https://dev.mysql.com/doc/)
- AI Model: [Face-API](https://github.com/justadudewhohacks/face-api.js)
##  Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/chaitanya566/Real-time-Facial-Recognition-Attendance-System.git
    ```
2. **Navigate to the project directory:**
    ```bash
    cd attendance-system
    ```
3. **Install dependencies**
- Navigate to the project directory and install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
- Set up MySQL database and configure connection details in the Flask app.

## File Structure
- The project directory is structured as follows:

  - **data**: Contains user-specific data and images.
    - **current_user**: Stores temporary frames for current user processing.
    - **images**: Holds user images organized by folders, each representing a user.
  - **database**: Contains scripts or files related to database operations.
  - **scripts**: Includes Python scripts for various functionalities.
  - **static**: Stores static files such as CSS and JavaScript.
  - **templates**: Holds HTML templates for the user interface. 

## Setup
1. **User Account Creation**
    - Users need to create their accounts, which initiates the storage of their information in the data/images directory. Each user's folder is named after their username and contains their images for recognition
2. **Image Processing**
    - Execute `Camera_input.py` to capture frames and store them temporarily in `data/current_user`. This process selects high-quality frames suitable for recognition.
3. **Facial Recognition**
    - Open  `Server.html` to initiate automatic attendance by comparing the captured frames with stored user images. The system utilizes AI model to identify users in real-time and record attendance seamlessly.

## Usage
- **Real-time Recognition:**
     Users' names are dynamically updated to green upon successful recognition. The system provides an intuitive interface for users to mark attendance swiftly.
- **Photo Upload:**
    Users can also upload photos for attendance comparison. The system intelligently compares uploaded photos against stored data to generate attendance records accurately.

## Libraries Used
- [Flask](https://flask.palletsprojects.com/) - Web framework for Python
- [Flask-Cors](https://flask-cors.readthedocs.io/en/latest/) - Extension for handling Cross-Origin Resource Sharing (CORS)
- [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/) - WebSocket support for Flask applications

- [asyncio](https://docs.python.org/3/library/asyncio.html) - Asynchronous I/O in Python
- [websockets](https://websockets.readthedocs.io/en/stable/) - Websockets library for Python
- [mysql-connector-python](https://dev.mysql.com/doc/connector-python/en/) - MySQL connector for Python
