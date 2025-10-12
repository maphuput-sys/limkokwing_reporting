CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    course VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lecturers (
    lecturer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100)
);


CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    lecturer_id INT,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id) ON DELETE SET NULL
);


CREATE TABLE student_ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_code VARCHAR(50) NOT NULL, -- Assuming course_code is used as a reference key
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    -- Note: A formal FK constraint on course_code would require a separate table constraint
);


CREATE TABLE lecturer_modules (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id INT NOT NULL,
    module_code VARCHAR(50) NOT NULL, -- module_code is used interchangeably with course_code
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id) ON DELETE CASCADE
    -- Note: You might want to add a UNIQUE constraint on (lecturer_id, module_code)
);


CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    submitted_by INT, -- Could be a PL or Lecturer ID
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE lecturer_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id INT NOT NULL,
    review TEXT NOT NULL,
    reviewer_id INT, -- PRL's ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id) ON DELETE CASCADE
);

CREATE TABLE prl_feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    feedback TEXT NOT NULL,
    prl_id INT, -- Optional: If you need to link to a PRL user account
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE monitoring (
    monitor_id INT AUTO_INCREMENT PRIMARY KEY,
    note TEXT NOT NULL,
    pl_id INT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

CREATE TABLE lectures (
    lecture_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    course_id INT, -- Optional: Link to the course table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table: classes
-- Used by: plRoutes.js (POST /classes)
-- -----------------------------------------------------
CREATE TABLE classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    schedule TEXT, -- Use TEXT to store complex scheduling info (e.g., JSON or descriptive text)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table: ratings (General PL Rating)
-- Used by: plRoutes.js (POST /rating)
-- -----------------------------------------------------
CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    pl_id INT, -- Optional: Link to the PL who submitted the rating
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table: marks
-- Used by: lecturerRoutes.js (POST /marks)
-- -----------------------------------------------------
CREATE TABLE marks (
    mark_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    marks DECIMAL(5, 2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table: attendance
-- Used by: lecturerRoutes.js (POST /attendance)
-- -----------------------------------------------------
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table: lecturer_feedback
-- Used by: lecturerRoutes.js (POST /feedback)
-- -----------------------------------------------------
CREATE TABLE lecturer_feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    feedback TEXT NOT NULL,
    lecturer_id INT, -- Optional: Link to the Lecturer who submitted the feedback
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);