-- Insert 3 companies
INSERT INTO users (name, email, password, role) VALUES
('TCS Recruiter', 'hr@tcs.com', '$2a$10$xqZ8Z8Z8Z8Z8Z8Z8Z8Z8Z.Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'COMPANY'),
('Infosys Recruiter', 'hr@infosys.com', '$2a$10$xqZ8Z8Z8Z8Z8Z8Z8Z8Z8Z.Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'COMPANY'),
('Wipro Recruiter', 'hr@wipro.com', '$2a$10$xqZ8Z8Z8Z8Z8Z8Z8Z8Z8Z.Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'COMPANY')
ON CONFLICT (email) DO NOTHING;

-- Get user IDs and insert companies
WITH user_ids AS (
  SELECT id, email FROM users WHERE email IN ('hr@tcs.com', 'hr@infosys.com', 'hr@wipro.com')
)
INSERT INTO companies (user_id, company_name, industry, website, hr_name, hr_email, hr_phone, description, status)
SELECT 
  u.id,
  CASE 
    WHEN u.email = 'hr@tcs.com' THEN 'Tata Consultancy Services'
    WHEN u.email = 'hr@infosys.com' THEN 'Infosys Limited'
    WHEN u.email = 'hr@wipro.com' THEN 'Wipro Technologies'
  END,
  'IT Services',
  CASE 
    WHEN u.email = 'hr@tcs.com' THEN 'https://www.tcs.com'
    WHEN u.email = 'hr@infosys.com' THEN 'https://www.infosys.com'
    WHEN u.email = 'hr@wipro.com' THEN 'https://www.wipro.com'
  END,
  CASE 
    WHEN u.email = 'hr@tcs.com' THEN 'Rajesh Kumar'
    WHEN u.email = 'hr@infosys.com' THEN 'Priya Sharma'
    WHEN u.email = 'hr@wipro.com' THEN 'Amit Patel'
  END,
  u.email,
  CASE 
    WHEN u.email = 'hr@tcs.com' THEN '9876543210'
    WHEN u.email = 'hr@infosys.com' THEN '9876543211'
    WHEN u.email = 'hr@wipro.com' THEN '9876543212'
  END,
  CASE 
    WHEN u.email = 'hr@tcs.com' THEN 'Leading global IT services, consulting and business solutions organization'
    WHEN u.email = 'hr@infosys.com' THEN 'Global leader in next-generation digital services and consulting'
    WHEN u.email = 'hr@wipro.com' THEN 'Leading technology services and consulting company'
  END,
  'APPROVED'
FROM user_ids u
ON CONFLICT DO NOTHING;

-- Insert jobs for TCS (6 jobs)
WITH tcs_company AS (
  SELECT c.id FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'hr@tcs.com'
)
INSERT INTO jobs (company_id, title, description, location, job_type, salary_package, min_cgpa, required_skills, interview_date, status)
SELECT 
  tc.id,
  title,
  description,
  location,
  job_type,
  salary_package,
  min_cgpa,
  required_skills,
  interview_date,
  'ACTIVE'
FROM tcs_company tc,
(VALUES
  ('Software Engineer', 'Develop and maintain enterprise applications using Java and Spring Boot', 'Bangalore', 'FULL_TIME', '₹4.5 LPA', 7.0, ARRAY['Java', 'Spring Boot', 'MySQL', 'REST API'], CURRENT_DATE + INTERVAL '15 days'),
  ('Frontend Developer', 'Build responsive web applications using React and modern JavaScript', 'Hyderabad', 'FULL_TIME', '₹4.2 LPA', 6.5, ARRAY['React', 'JavaScript', 'HTML', 'CSS', 'Redux'], CURRENT_DATE + INTERVAL '20 days'),
  ('Data Analyst', 'Analyze business data and create insights using Python and SQL', 'Mumbai', 'FULL_TIME', '₹4.8 LPA', 7.5, ARRAY['Python', 'SQL', 'Tableau', 'Excel', 'Statistics'], CURRENT_DATE + INTERVAL '18 days'),
  ('DevOps Engineer', 'Manage CI/CD pipelines and cloud infrastructure', 'Pune', 'FULL_TIME', '₹5.5 LPA', 7.0, ARRAY['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux'], CURRENT_DATE + INTERVAL '25 days'),
  ('QA Engineer', 'Design and execute test cases for web and mobile applications', 'Chennai', 'FULL_TIME', '₹3.8 LPA', 6.0, ARRAY['Selenium', 'Java', 'TestNG', 'API Testing', 'Agile'], CURRENT_DATE + INTERVAL '12 days'),
  ('Business Analyst', 'Gather requirements and bridge gap between business and technology', 'Bangalore', 'FULL_TIME', '₹5.0 LPA', 7.5, ARRAY['SQL', 'Excel', 'JIRA', 'Agile', 'Communication'], CURRENT_DATE + INTERVAL '22 days')
) AS v(title, description, location, job_type, salary_package, min_cgpa, required_skills, interview_date);

-- Insert jobs for Infosys (6 jobs)
WITH infosys_company AS (
  SELECT c.id FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'hr@infosys.com'
)
INSERT INTO jobs (company_id, title, description, location, job_type, salary_package, min_cgpa, required_skills, interview_date, status)
SELECT 
  ic.id,
  title,
  description,
  location,
  job_type,
  salary_package,
  min_cgpa,
  required_skills,
  interview_date,
  'ACTIVE'
FROM infosys_company ic,
(VALUES
  ('Full Stack Developer', 'Work on end-to-end web application development using MEAN/MERN stack', 'Bangalore', 'FULL_TIME', '₹5.2 LPA', 7.0, ARRAY['Node.js', 'React', 'MongoDB', 'Express', 'JavaScript'], CURRENT_DATE + INTERVAL '16 days'),
  ('Python Developer', 'Develop backend services and APIs using Python and Django', 'Hyderabad', 'FULL_TIME', '₹4.8 LPA', 6.8, ARRAY['Python', 'Django', 'PostgreSQL', 'REST API', 'Git'], CURRENT_DATE + INTERVAL '19 days'),
  ('Cloud Engineer', 'Design and implement cloud solutions on Azure platform', 'Pune', 'FULL_TIME', '₹6.0 LPA', 7.5, ARRAY['Azure', 'Cloud Computing', 'Terraform', 'Python', 'Networking'], CURRENT_DATE + INTERVAL '24 days'),
  ('Mobile App Developer', 'Build native Android applications using Kotlin', 'Chennai', 'FULL_TIME', '₹4.5 LPA', 6.5, ARRAY['Kotlin', 'Android', 'Java', 'REST API', 'Git'], CURRENT_DATE + INTERVAL '14 days'),
  ('Machine Learning Engineer', 'Develop ML models and deploy them in production', 'Bangalore', 'FULL_TIME', '₹7.5 LPA', 8.0, ARRAY['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'SQL'], CURRENT_DATE + INTERVAL '28 days'),
  ('Cybersecurity Analyst', 'Monitor and protect systems from security threats', 'Mumbai', 'FULL_TIME', '₹5.5 LPA', 7.0, ARRAY['Network Security', 'Ethical Hacking', 'Linux', 'Python', 'SIEM'], CURRENT_DATE + INTERVAL '21 days')
) AS v(title, description, location, job_type, salary_package, min_cgpa, required_skills, interview_date);

-- Insert jobs for Wipro (6 jobs)
WITH wipro_company AS (
  SELECT c.id FROM companies c JOIN users u ON c.user_id = u.id WHERE u.email = 'hr@wipro.com'
)
INSERT INTO jobs (company_id, title, description, location, job_type, salary_package, min_cgpa, required_skills, interview_date, status)
SELECT 
  wc.id,
  title,
  description,
  location,
  job_type,
  salary_package,
  min_cgpa,
  required_skills,
  interview_date,
  'ACTIVE'
FROM wipro_company wc,
(VALUES
  ('Java Backend Developer', 'Build scalable microservices using Java and Spring ecosystem', 'Bangalore', 'FULL_TIME', '₹4.6 LPA', 7.0, ARRAY['Java', 'Spring Boot', 'Microservices', 'MySQL', 'Kafka'], CURRENT_DATE + INTERVAL '17 days'),
  ('UI/UX Developer', 'Create beautiful and intuitive user interfaces', 'Hyderabad', 'FULL_TIME', '₹4.0 LPA', 6.5, ARRAY['HTML', 'CSS', 'JavaScript', 'Figma', 'React'], CURRENT_DATE + INTERVAL '13 days'),
  ('Data Engineer', 'Build and maintain data pipelines and ETL processes', 'Pune', 'FULL_TIME', '₹5.8 LPA', 7.5, ARRAY['Python', 'Spark', 'Hadoop', 'SQL', 'AWS'], CURRENT_DATE + INTERVAL '26 days'),
  ('SAP Consultant', 'Implement and customize SAP solutions for clients', 'Mumbai', 'FULL_TIME', '₹6.5 LPA', 7.0, ARRAY['SAP', 'ABAP', 'Business Process', 'SQL', 'Communication'], CURRENT_DATE + INTERVAL '23 days'),
  ('Network Engineer', 'Design and manage enterprise network infrastructure', 'Chennai', 'FULL_TIME', '₹4.2 LPA', 6.5, ARRAY['Networking', 'Cisco', 'Routing', 'Switching', 'Firewall'], CURRENT_DATE + INTERVAL '15 days'),
  ('Automation Tester', 'Automate testing processes using modern frameworks', 'Bangalore', 'FULL_TIME', '₹4.4 LPA', 6.8, ARRAY['Selenium', 'Python', 'Pytest', 'CI/CD', 'API Testing'], CURRENT_DATE + INTERVAL '20 days')
) AS v(title, description, location, job_type, salary_package, min_cgpa, required_skills, interview_date);
