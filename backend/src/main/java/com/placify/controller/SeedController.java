package com.placify.controller;

import com.placify.model.*;
import com.placify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class SeedController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/seed-data")
    public ResponseEntity<?> seedData() {
        try {
            // Create TCS
            User tcsUser = createCompanyUser("TCS Recruiter", "hr@tcs.com");
            Company tcs = createCompany(tcsUser, "Tata Consultancy Services", "IT Services", "https://www.tcs.com", "Rajesh Kumar", "hr@tcs.com", "9876543210");
            createJob(tcs, "Software Engineer", "Develop and maintain enterprise applications using Java and Spring Boot", "Bangalore", "₹4.5 LPA", 7.0, Arrays.asList("Java", "Spring Boot", "MySQL", "REST API"), 15);
            createJob(tcs, "Frontend Developer", "Build responsive web applications using React and modern JavaScript", "Hyderabad", "₹4.2 LPA", 6.5, Arrays.asList("React", "JavaScript", "HTML", "CSS", "Redux"), 20);
            createJob(tcs, "Data Analyst", "Analyze business data and create insights using Python and SQL", "Mumbai", "₹4.8 LPA", 7.5, Arrays.asList("Python", "SQL", "Tableau", "Excel", "Statistics"), 18);
            createJob(tcs, "DevOps Engineer", "Manage CI/CD pipelines and cloud infrastructure", "Pune", "₹5.5 LPA", 7.0, Arrays.asList("Docker", "Kubernetes", "AWS", "Jenkins", "Linux"), 25);
            createJob(tcs, "QA Engineer", "Design and execute test cases for web and mobile applications", "Chennai", "₹3.8 LPA", 6.0, Arrays.asList("Selenium", "Java", "TestNG", "API Testing", "Agile"), 12);
            createJob(tcs, "Business Analyst", "Gather requirements and bridge gap between business and technology", "Bangalore", "₹5.0 LPA", 7.5, Arrays.asList("SQL", "Excel", "JIRA", "Agile", "Communication"), 22);

            // Create Infosys
            User infosysUser = createCompanyUser("Infosys Recruiter", "hr@infosys.com");
            Company infosys = createCompany(infosysUser, "Infosys Limited", "IT Services", "https://www.infosys.com", "Priya Sharma", "hr@infosys.com", "9876543211");
            createJob(infosys, "Full Stack Developer", "Work on end-to-end web application development using MEAN/MERN stack", "Bangalore", "₹5.2 LPA", 7.0, Arrays.asList("Node.js", "React", "MongoDB", "Express", "JavaScript"), 16);
            createJob(infosys, "Python Developer", "Develop backend services and APIs using Python and Django", "Hyderabad", "₹4.8 LPA", 6.8, Arrays.asList("Python", "Django", "PostgreSQL", "REST API", "Git"), 19);
            createJob(infosys, "Cloud Engineer", "Design and implement cloud solutions on Azure platform", "Pune", "₹6.0 LPA", 7.5, Arrays.asList("Azure", "Cloud Computing", "Terraform", "Python", "Networking"), 24);
            createJob(infosys, "Mobile App Developer", "Build native Android applications using Kotlin", "Chennai", "₹4.5 LPA", 6.5, Arrays.asList("Kotlin", "Android", "Java", "REST API", "Git"), 14);
            createJob(infosys, "Machine Learning Engineer", "Develop ML models and deploy them in production", "Bangalore", "₹7.5 LPA", 8.0, Arrays.asList("Python", "TensorFlow", "Machine Learning", "Deep Learning", "SQL"), 28);
            createJob(infosys, "Cybersecurity Analyst", "Monitor and protect systems from security threats", "Mumbai", "₹5.5 LPA", 7.0, Arrays.asList("Network Security", "Ethical Hacking", "Linux", "Python", "SIEM"), 21);

            // Create Wipro
            User wiproUser = createCompanyUser("Wipro Recruiter", "hr@wipro.com");
            Company wipro = createCompany(wiproUser, "Wipro Technologies", "IT Services", "https://www.wipro.com", "Amit Patel", "hr@wipro.com", "9876543212");
            createJob(wipro, "Java Backend Developer", "Build scalable microservices using Java and Spring ecosystem", "Bangalore", "₹4.6 LPA", 7.0, Arrays.asList("Java", "Spring Boot", "Microservices", "MySQL", "Kafka"), 17);
            createJob(wipro, "UI/UX Developer", "Create beautiful and intuitive user interfaces", "Hyderabad", "₹4.0 LPA", 6.5, Arrays.asList("HTML", "CSS", "JavaScript", "Figma", "React"), 13);
            createJob(wipro, "Data Engineer", "Build and maintain data pipelines and ETL processes", "Pune", "₹5.8 LPA", 7.5, Arrays.asList("Python", "Spark", "Hadoop", "SQL", "AWS"), 26);
            createJob(wipro, "SAP Consultant", "Implement and customize SAP solutions for clients", "Mumbai", "₹6.5 LPA", 7.0, Arrays.asList("SAP", "ABAP", "Business Process", "SQL", "Communication"), 23);
            createJob(wipro, "Network Engineer", "Design and manage enterprise network infrastructure", "Chennai", "₹4.2 LPA", 6.5, Arrays.asList("Networking", "Cisco", "Routing", "Switching", "Firewall"), 15);
            createJob(wipro, "Automation Tester", "Automate testing processes using modern frameworks", "Bangalore", "₹4.4 LPA", 6.8, Arrays.asList("Selenium", "Python", "Pytest", "CI/CD", "API Testing"), 20);

            return ResponseEntity.ok(Map.of("message", "Successfully created 3 companies with 18 jobs!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    private User createCompanyUser(String name, String email) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) return existing.get();
        
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(User.Role.COMPANY);
        user.setActive(true);
        return userRepository.save(user);
    }

    private Company createCompany(User user, String name, String industry, String website, String hrName, String hrEmail, String hrPhone) {
        Optional<Company> existing = companyRepository.findByUser(user);
        if (existing.isPresent()) return existing.get();
        
        Company company = Company.builder()
            .user(user)
            .companyName(name)
            .industry(industry)
            .website(website)
            .hrName(hrName)
            .hrEmail(hrEmail)
            .hrPhone(hrPhone)
            .description("Leading IT services company")
            .status(Company.ApprovalStatus.APPROVED)
            .build();
        return companyRepository.save(company);
    }

    private void createJob(Company company, String title, String description, String location, String salary, Double minCgpa, List<String> skills, int daysFromNow) {
        Job job = Job.builder()
            .company(company)
            .title(title)
            .description(description)
            .location(location)
            .salaryPackage(salary)
            .minCgpa(minCgpa)
            .requiredSkills(skills)
            .interviewDate(LocalDate.now().plusDays(daysFromNow))
            .status(Job.JobStatus.ACTIVE)
            .build();
        jobRepository.save(job);
    }
}
