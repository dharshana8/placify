-- Insert departments if they don't exist
INSERT INTO departments (id, name, description) VALUES 
(1, 'CSE', 'Computer Science and Engineering'),
(2, 'ECE', 'Electronics and Communication Engineering'),
(3, 'EEE', 'Electrical and Electronics Engineering'),
(4, 'MECH', 'Mechanical Engineering'),
(5, 'IT', 'Information Technology'),
(6, 'AIML', 'Artificial Intelligence and Machine Learning'),
(7, 'AIDS', 'Artificial Intelligence and Data Science'),
(8, 'CSBS', 'Computer Science and Business Systems'),
(9, 'CIVIL', 'Civil Engineering')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Update students with random CGPAs between 6.5 and 9.5
UPDATE students SET cgpa = 6.5 + (RANDOM() * 3.0) WHERE cgpa IS NULL;

-- Map department IDs to proper names (update dept_id based on email patterns or randomly)
UPDATE students SET dept_id = 8 WHERE dept_id = 9 OR (email LIKE '%csbs%');
UPDATE students SET dept_id = 1 WHERE email LIKE '%cse%' AND email NOT LIKE '%csbs%';
UPDATE students SET dept_id = 2 WHERE email LIKE '%ece%';
UPDATE students SET dept_id = 3 WHERE email LIKE '%eee%';
UPDATE students SET dept_id = 4 WHERE email LIKE '%mech%';
UPDATE students SET dept_id = 5 WHERE email LIKE '%it%';
UPDATE students SET dept_id = 6 WHERE email LIKE '%aiml%';
UPDATE students SET dept_id = 7 WHERE email LIKE '%aids%';
