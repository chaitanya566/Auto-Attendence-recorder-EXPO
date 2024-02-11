import os
from flask import Flask, render_template, request
import mysql.connector
app = Flask(__name__, template_folder='../templates', static_folder='../static')
db_config = {
    'host': '127.0.0.1',#THIS CAN BE DEFAULT BUT CHECK ANYWAYS
    'user': 'root',#THIS CAN BE DEFAULT BUT CHECK ANYWAYS
    'password': 'saradhi@2005',#ENTER YOUR PASSWORD HERE BEFORE PROCEDING AND THE OTHER VALUES
    'database': 'Attendence_DB'#THIS ONE TO
}
@app.route('/')
def index():
    return render_template( 'create_account.html')

@app.route('/process', methods=['POST'])
def process_form():

    name = request.form['name']
    reg_no = request.form['reg_no']
    class_ = request.form['class']
    department = request.form['department']
    connection = None
    # Process the form data (you can perform any desired operations here)
    # For example, print the values to the console
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Insert data into the 'users' table
        cursor.execute(
            "INSERT INTO users (name, reg_no, class, department) VALUES (%s, %s, %s, %s)",
            (name, reg_no, class_, department)
        )

        connection.commit()
        print("Data inserted successfully.")

    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed.")
    print(f"Name: {name}, Reg No.: {reg_no}, Class: {class_}, Department: {department}")
    folder_name = f"{name}"
    location="../data/Section_Name/images"
    full_path = os.path.join(location, folder_name)
    create_folder(full_path)
    # Return a html file
    return render_template('success_creation.html')


def create_folder(folder_path):
    try:
        os.makedirs(folder_path)
        print(f"Folder '{folder_path}' created successfully.")
    except OSError as e:
        print(f"Failed to create folder '{folder_path}': {e}")


if __name__ == '__main__':
    app.run(debug=True)
