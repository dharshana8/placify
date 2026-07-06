package com.placify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class SeedDataController {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/seed-companies-jobs")
    public ResponseEntity<?> seedCompaniesJobs() {
        try {
            String hashedPassword = passwordEncoder.encode("password123");
            
            // Insert companies
            jdbcTemplate.update("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO NOTHING",
                "TCS Recruiter", "hr@tcs.com", hashedPassword, "COMPANY");
            jdbcTemplate.update("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO NOTHING",
                "Infosys Recruiter", "hr@infosys.com", hashedPassword, "COMPANY");
            jdbcTemplate.update("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO NOTHING",
                "Wipro Recruiter", "hr@wipro.com", hashedPassword, "COMPANY");

            // Get user IDs
            Long tcsUserId = jdbcTemplate.queryForObject("SELECT id FROM users WHERE email = 'hr@tcs.com'", Long.class);
            Long infosysUserId = jdbcTemplate.queryForObject("SELECT id FROM users WHERE email = 'hr@infosys.com'", Long.class);
            Long wiproUserId = jdbcTemplate.queryForObject("SELECT id FROM users WHERE email = 'hr@wipro.com'", Long.class);

            // Insert company profiles
            jdbcTemplate.update("INSERT INTO companies (user_id, company_name, industry, website, hr_name, hr_email, hr_phone, description, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (user_id) DO NOTHING",
                tcsUserId, "Tata Consultancy Services", "IT Services", "https://www.tcs.com", "Rajesh Kumar", "hr@tcs.com", "9876543210",
                "Leading global IT services, consulting and business solutions organization", "APPROVED");
            
            jdbcTemplate.update("INSERT INTO companies (user_id, company_name, industry, website, hr_name, hr_email, hr_phone, description, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (user_id) DO NOTHING",
                infosysUserId, "Infosys Limited", "IT Services", "https://www.infosys.com", "Priya Sharma", "hr@infosys.com", "9876543211",
                "Global leader in next-generation digital services and consulting", "APPROVED");
            
            jdbcTemplate.update("INSERT INTO companies (user_id, company_name, industry, website, hr_name, hr_email, hr_phone, description, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (user_id) DO NOTHING",
                wiproUserId, "Wipro Technologies", "IT Services", "https://www.wipro.com", "Amit Patel", "hr@wipro.com", "9876543212",
                "Leading technology services and consulting company", "APPROVED");

            // Get company IDs
            Long tcsId = jdbcTemplate.queryForObject("SELECT id FROM companies WHERE user_id = ?", Long.class, tcsUserId);
            Long infosysId = jdbcTemplate.queryForObject("SELECT id FROM companies WHERE user_id = ?", Long.class, infosysUserId);
            Long wiproId = jdbcTemplate.queryForObject("SELECT id FROM companies WHERE user_id = ?", Long.class, wiproUserId);

            // Insert TCS jobs
            insertJob(tcsId, "Software Engineer", "Develop and maintain enterprise applications using Java and Spring Boot", "Bangalore", "₹4.5 LPA", 7.0, new String[]{"Java", "Spring Boot", "MySQL", "REST API"}, 15);
            insertJob(tcsId, "Frontend Developer", "Build responsive web applications using React and modern JavaScript", "Hyderabad", "₹4.2 LPA", 6.5, new String[]{"React", "JavaScript", "HTML", "CSS", "Redux"}, 20);
            insertJob(tcsId, "Data Analyst", "Analyze business data and create insights using Python and SQL", "Mumbai", "₹4.8 LPA", 7.5, new String[]{"Python", "SQL", "Tableau", "Excel", "Statistics"}, 18);
            insertJob(tcsId, "DevOps Engineer", "Manage CI/CD pipelines and cloud infrastructure", "Pune", "₹5.5 LPA", 7.0, new String[]{"Docker", "Kubernetes", "AWS", "Jenkins", "Linux"}, 25);
            insertJob(tcsId, "QA Engineer", "Design and execute test cases for web and mobile applications", "Chennai", "₹3.8 LPA", 6.0, new String[]{"Selenium", "Java", "TestNG", "API Testing", "Agile"}, 12);
            insertJob(tcsId, "Business Analyst", "Gather requirements and bridge gap between business and technology", "Bangalore", "₹5.0 LPA", 7.5, new String[]{"SQL", "Excel", "JIRA", "Agile", "Communication"}, 22);

            // Insert Infosys jobs
            insertJob(infosysId, "Full Stack Developer", "Work on end-to-end web application development using MEAN/MERN stack", "Bangalore", "₹5.2 LPA", 7.0, new String[]{"Node.js", "React", "MongoDB", "Express", "JavaScript"}, 16);
            insertJob(infosysId, "Python Developer", "Develop backend services and APIs using Python and Django", "Hyderabad", "₹4.8 LPA", 6.8, new String[]{"Python", "Django", "PostgreSQL", "REST API", "Git"}, 19);
            insertJob(infosysId, "Cloud Engineer", "Design and implement cloud solutions on Azure platform", "Pune", "₹6.0 LPA", 7.5, new String[]{"Azure", "Cloud Computing", "Terraform", "Python", "Networking"}, 24);
            insertJob(infosysId, "Mobile App Developer", "Build native Android applications using Kotlin", "Chennai", "₹4.5 LPA", 6.5, new String[]{"Kotlin", "Android", "Java", "REST API", "Git"}, 14);
            insertJob(infosysId, "Machine Learning Engineer", "Develop ML models and deploy them in production", "Bangalore", "₹7.5 LPA", 8.0, new String[]{"Python", "TensorFlow", "Machine Learning", "Deep Learning", "SQL"}, 28);
            insertJob(infosysId, "Cybersecurity Analyst", "Monitor and protect systems from security threats", "Mumbai", "₹5.5 LPA", 7.0, new String[]{"Network Security", "Ethical Hacking", "Linux", "Python", "SIEM"}, 21);

            // Insert Wipro jobs
            insertJob(wiproId, "Java Backend Developer", "Build scalable microservices using Java and Spring ecosystem", "Bangalore", "₹4.6 LPA", 7.0, new String[]{"Java", "Spring Boot", "Microservices", "MySQL", "Kafka"}, 17);
            insertJob(wiproId, "UI/UX Developer", "Create beautiful and intuitive user interfaces", "Hyderabad", "₹4.0 LPA", 6.5, new String[]{"HTML", "CSS", "JavaScript", "Figma", "React"}, 13);
            insertJob(wiproId, "Data Engineer", "Build and maintain data pipelines and ETL processes", "Pune", "₹5.8 LPA", 7.5, new String[]{"Python", "Spark", "Hadoop", "SQL", "AWS"}, 26);
            insertJob(wiproId, "SAP Consultant", "Implement and customize SAP solutions for clients", "Mumbai", "₹6.5 LPA", 7.0, new String[]{"SAP", "ABAP", "Business Process", "SQL", "Communication"}, 23);
            insertJob(wiproId, "Network Engineer", "Design and manage enterprise network infrastructure", "Chennai", "₹4.2 LPA", 6.5, new String[]{"Networking", "Cisco", "Routing", "Switching", "Firewall"}, 15);
            insertJob(wiproId, "Automation Tester", "Automate testing processes using modern frameworks", "Bangalore", "₹4.4 LPA", 6.8, new String[]{"Selenium", "Python", "Pytest", "CI/CD", "API Testing"}, 20);

            return ResponseEntity.ok(Map.of("message", "Successfully created 3 companies with 18 jobs"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    private void insertJob(Long companyId, String title, String description, String location, 
                          String salaryPackage, Double minCgpa, String[] skills, int daysFromNow) {
        LocalDate interviewDate = LocalDate.now().plusDays(daysFromNow);
        
        // Convert String array to PostgreSQL array format
        String skillsArray = "{" + String.join(",", skills) + "}";
        
        jdbcTemplate.update(
            "INSERT INTO jobs (company_id, title, description, location, salary_package, min_cgpa, interview_date, status) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            companyId, title, description, location, salaryPackage, minCgpa, interviewDate, "ACTIVE"
        );
        
        // Get the job ID and insert skills separately
        Long jobId = jdbcTemplate.queryForObject(
            "SELECT id FROM jobs WHERE company_id = ? AND title = ? ORDER BY id DESC LIMIT 1",
            Long.class, companyId, title
        );
        
        // Insert skills into job_required_skills table
        for (String skill : skills) {
            jdbcTemplate.update(
                "INSERT INTO job_required_skills (job_id, skill) VALUES (?, ?)",
                jobId, skill
            );
        }
    }
}
