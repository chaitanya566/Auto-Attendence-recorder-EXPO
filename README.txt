The main files to be used here are

    -server.html
    -create_account.py
    -test_wifi.py
    -handle_client_image.py (Camera_imput.html)

the ones that need change (for front end design are)
    -server.html
    -handle_client_image.py (Camera_imput.html)
    -index.html (the page that takes the user to the Camera_input.html on clicking a button) {didnt integrate with the python flask so gotta do that first}

as for the back end 
    in the - handle_client_image.py use another AI model to detect blinking to figure out its an actual face 

as for the tools used
 - python html css js flask mysql faceAPI(AI model for face recognition)

and the libraries for python in their respective files
    -flask
    -mysql-connector-python
    -flask-socketio
    -websockets (if using old version of python other than 3.7 and forward)

as for keeping new faces 
    -run the create_account (or just create a folder in this relative path data->Section Name->images->Your_name(yes as a folder name) )
    -then store 1 image (can be increased as per line 34 in Server.js but note other folders should have have that amount of photos or more) (also note to rename the image this is done auto if using the Create_account.py)
    -then add Your_name to the list named "labels" to make this automatic we need several more tools hence this is skipped we can get the names of all the users from the data the school provides so not big of a issue

the other files in the scripts 
    -Connect-Client-with-Server.py
    -Connect-Server-with-Client.py
can change depening on the type of data transmition your going forward for the final product so not much to be done there

we can integrate amazon rekognition to detect if the face is real or not (not done yet)

and we are currently using a temporary method of using browser cookies to send information to the student that their attendence is marked