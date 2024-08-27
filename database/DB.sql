-- work in progress!!


CREATE DATABASE IF NOT EXISTS AttendenceRecorder;
USE AttendenceRecorder;

CREATE TABLE `Student_Phone_Number` (
  `Student_Phone_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Primary_Phone_Number` VARCHAR(20),
  `Secondary_Phone_Number` VARCHAR(20)
);

CREATE TABLE `Student_Email` (
  `Student_Email_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Personal_Email` VARCHAR(100),
  `Allocated_University_Email` VARCHAR(100)
);

CREATE TABLE `Faculty_Phone_Number` (
  `Faculty_Phone_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Primary_Phone_Number` VARCHAR(20),
  `Secondary_Phone_Number` VARCHAR(20)
);

CREATE TABLE `Faculty_Email` (
  `Faculty_Email_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Personal_Email` VARCHAR(100),
  `Allocated_University_Email` VARCHAR(100)
);

CREATE TABLE `Student_Details` (
  `Student_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Student_Name` VARCHAR(100),
  `Department` VARCHAR(100),
  `FK_Student_Phone_ID` INT,
  `FK_Student_Email_ID` INT,
  CONSTRAINT `FK_Student_Phone_ID` FOREIGN KEY (`FK_Student_Phone_ID`) REFERENCES `Student_Phone_Number`(`Student_Phone_ID`),
  CONSTRAINT `FK_Student_Email_ID` FOREIGN KEY (`FK_Student_Email_ID`) REFERENCES `Student_Email`(`Student_Email_ID`)
);

CREATE TABLE `Faculty_Details` (
  `Faculty_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Faculty_Name` VARCHAR(100),
  `Department` VARCHAR(100),
  `FK_Faculty_Phone_ID` INT,
  `FK_Faculty_Email_ID` INT,
  CONSTRAINT `FK_Faculty_Phone_ID` FOREIGN KEY (`FK_Faculty_Phone_ID`) REFERENCES `Faculty_Phone_Number`(`Faculty_Phone_ID`),
  CONSTRAINT `FK_Faculty_Email_ID` FOREIGN KEY (`FK_Faculty_Email_ID`) REFERENCES `Faculty_Email`(`Faculty_Email_ID`)
);

CREATE TABLE `Camera` (
  `Camera_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Location` VARCHAR(100),
  `Model_Number` VARCHAR(50),
  `FK_Student_ID` INT,
  CONSTRAINT `FK_Student_ID` FOREIGN KEY (`FK_Student_ID`) REFERENCES `Student_Details`(`Student_ID`)
);

CREATE TABLE `Courses` (
  `Course_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Number_of_Credits` INT,
  `Name_of_Course` VARCHAR(100)
);

CREATE TABLE `Sub_Server` (
  `Sub_Server_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Department` VARCHAR(100),
  `Students_Face_Data` BLOB,
  `Location` VARCHAR(100),
  `FK_Student_ID` INT,
  `FK_Faculty_ID` INT,
  `FK_Camera_ID` INT,
  CONSTRAINT `FK_Student_ID_Sub` FOREIGN KEY (`FK_Student_ID`) REFERENCES `Student_Details`(`Student_ID`),
  CONSTRAINT `FK_Faculty_ID_Sub` FOREIGN KEY (`FK_Faculty_ID`) REFERENCES `Faculty_Details`(`Faculty_ID`),
  CONSTRAINT `FK_Camera_ID_Sub` FOREIGN KEY (`FK_Camera_ID`) REFERENCES `Camera`(`Camera_ID`)
);

CREATE TABLE `Main_Server` (
  `Main_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Course_Information` VARCHAR(255),
  `Departments` VARCHAR(255),
  `Students_Attendance_Status` VARCHAR(255),
  `Department_ID` INT,
  `FK_Sub_Server_ID` INT,
  `FK_Course_ID` INT,
  `FK_Student_ID` INT,
  `FK_Faculty_ID` INT,
  CONSTRAINT `FK_Sub_Server_ID_Main` FOREIGN KEY (`FK_Sub_Server_ID`) REFERENCES `Sub_Server`(`Sub_Server_ID`),
  CONSTRAINT `FK_Course_ID_Main` FOREIGN KEY (`FK_Course_ID`) REFERENCES `Courses`(`Course_ID`),
  CONSTRAINT `FK_Student_ID_Main` FOREIGN KEY (`FK_Student_ID`) REFERENCES `Student_Details`(`Student_ID`),
  CONSTRAINT `FK_Faculty_ID_Main` FOREIGN KEY (`FK_Faculty_ID`) REFERENCES `Faculty_Details`(`Faculty_ID`)
);

CREATE TABLE `Change_Log` (
  `Log_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Changed_Table` VARCHAR(100),
  `Changed_Row_ID` INT,
  `Action` VARCHAR(50),
  `Timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW Contact_Info AS
SELECT 
    s.Student_ID,
    s.Student_Name,
    s.Department AS Student_Department,
    sp.Primary_Phone_Number AS Student_Primary_Phone,
    sp.Secondary_Phone_Number AS Student_Secondary_Phone,
    se.Personal_Email AS Student_Personal_Email,
    se.Allocated_University_Email AS Student_University_Email,
    f.Faculty_ID,
    f.Faculty_Name,
    f.Department AS Faculty_Department,
    fp.Primary_Phone_Number AS Faculty_Primary_Phone,
    fp.Secondary_Phone_Number AS Faculty_Secondary_Phone,
    fe.Personal_Email AS Faculty_Personal_Email,
    fe.Allocated_University_Email AS Faculty_University_Email
FROM Student_Details s
LEFT JOIN Student_Phone_Number sp ON s.FK_Student_Phone_ID = sp.Student_Phone_ID
LEFT JOIN Student_Email se ON s.FK_Student_Email_ID = se.Student_Email_ID
LEFT JOIN Faculty_Details f ON s.Department = f.Department
LEFT JOIN Faculty_Phone_Number fp ON f.FK_Faculty_Phone_ID = fp.Faculty_Phone_ID
LEFT JOIN Faculty_Email fe ON f.FK_Faculty_Email_ID = fe.Faculty_Email_ID;

DELIMITER //

CREATE TRIGGER log_student_details_change
AFTER UPDATE ON Student_Details
FOR EACH ROW
BEGIN
    INSERT INTO Change_Log (Changed_Table, Changed_Row_ID, Action)
    VALUES ('Student_Details', NEW.Student_ID, 'Updated');
END//

CREATE TRIGGER log_faculty_details_change
AFTER UPDATE ON Faculty_Details
FOR EACH ROW
BEGIN
    INSERT INTO Change_Log (Changed_Table, Changed_Row_ID, Action)
    VALUES ('Faculty_Details', NEW.Faculty_ID, 'Updated');
END//

DELIMITER ;

-- Insert values into Student_Phone_Number table
INSERT INTO Student_Phone_Number (Primary_Phone_Number, Secondary_Phone_Number) 
VALUES ('1234567890', '9876543210');

-- Insert values into Student_Email table
INSERT INTO Student_Email (Personal_Email, Allocated_University_Email) 
VALUES ('john.doe@example.com', 'john.doe@university.edu');

-- Insert values into Faculty_Phone_Number table
INSERT INTO Faculty_Phone_Number (Primary_Phone_Number, Secondary_Phone_Number) 
VALUES ('9876543210', '1234567890');

-- Insert values into Faculty_Email table
INSERT INTO Faculty_Email (Personal_Email, Allocated_University_Email) 
VALUES ('professor@example.com', 'professor@university.edu');

-- Insert values into Student_Details table
INSERT INTO Student_Details (Student_Name, Department, FK_Student_Phone_ID, FK_Student_Email_ID) 
VALUES ('John Doe', 'Computer Science', 
        (SELECT Student_Phone_ID FROM Student_Phone_Number WHERE Primary_Phone_Number = '1234567890'), 
        (SELECT Student_Email_ID FROM Student_Email WHERE Personal_Email = 'john.doe@example.com'));

-- Insert values into Faculty_Details table
INSERT INTO Faculty_Details (Faculty_Name, Department, FK_Faculty_Phone_ID, FK_Faculty_Email_ID) 
VALUES ('Dr. Smith', 'Computer Science', 
        (SELECT Faculty_Phone_ID FROM Faculty_Phone_Number WHERE Primary_Phone_Number = '9876543210'), 
        (SELECT Faculty_Email_ID FROM Faculty_Email WHERE Personal_Email = 'professor@example.com'));

-- Insert values into Camera table
INSERT INTO Camera (Location, Model_Number) 
VALUES ('Building A', 'CAM001');

-- Insert values into Sub_Server table, including foreign keys
-- Insert values into Sub_Server table, including foreign keys
INSERT INTO Sub_Server (Department, Location, FK_Student_ID, FK_Faculty_ID, FK_Camera_ID) 
VALUES ('Computer Science', 'Room 101', 
        (SELECT Student_ID FROM Student_Details WHERE Student_Name = 'John Doe' AND Department = 'Computer Science' LIMIT 1), 
        (SELECT Faculty_ID FROM Faculty_Details WHERE Faculty_Name = 'Dr. Smith' AND Department = 'Computer Science' LIMIT 1),
        (SELECT Camera_ID FROM Camera WHERE Location = 'Building A' AND Model_Number = 'CAM001' LIMIT 1));



