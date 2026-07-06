package com.placify.service;

import com.placify.model.*;
import com.placify.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        fixDatabaseSchema();
        
        if (userRepository.count() > 0) {
            log.info("Data already exists, skipping initialization");
            return;
        }

        log.info("Initializing sample data...");
        initializeDepartments();
        initializeAdmin();
        initializeSampleCompany();
        initializeSampleStudent();
        log.info("Sample data initialization completed");
    }

    private void fixDatabaseSchema() {
        try {
            log.info("Applying database schema fixes (if required)...");
            jdbcTemplate.execute("ALTER TABLE department_staff ALTER COLUMN dept_id DROP NOT NULL");
        } catch (Exception e) {
            log.debug("department_staff alter skipped: {}", e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN email TYPE varchar(255)");
        } catch (Exception e) {
            log.debug("users table email alter skipped: {}", e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE jobs ALTER COLUMN title TYPE varchar(255)");
            jdbcTemplate.execute("ALTER TABLE jobs ALTER COLUMN location TYPE varchar(255)");
        } catch (Exception e) {
            log.debug("jobs table alter skipped: {}", e.getMessage());
        }
        
        try {
            log.info("Fixing NULL isActive values in users table...");
            jdbcTemplate.execute("UPDATE users SET is_active = true WHERE is_active IS NULL");
        } catch (Exception e) {
            log.debug("users isActive fix skipped: {}", e.getMessage());
        }
    }

    private void initializeDepartments() {
        List<String> deptNames = Arrays.asList(
            "Computer Science", "Information Technology", "Electronics", 
            "Mechanical", "Civil", "Electrical", "Chemical"
        );
        
        for (String name : deptNames) {
            if (!departmentRepository.existsByName(name)) {
                departmentRepository.save(Department.builder().name(name).build());
            }
        }
    }

    private void initializeAdmin() {
        // Create default admin
        if (!userRepository.existsByEmail("admin@placify.com")) {
            User admin = User.builder()
                .name("System Admin")
                .email("admin@placify.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .isActive(true)
                .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@placify.com / admin123");
        }
        
        // Create placement cell admin
        if (!userRepository.existsByEmail("placementcell@sece.ac.in")) {
            User placementAdmin = User.builder()
                .name("Placement Cell")
                .email("placementcell@sece.ac.in")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .isActive(true)
                .build();
            userRepository.save(placementAdmin);
            log.info("Placement Cell admin created: placementcell@sece.ac.in / admin123");
        }
    }

    private void initializeSampleCompany() {
        if (!userRepository.existsByEmail("hr@techcorp.com")) {
            User companyUser = User.builder()
                .name("TechCorp HR")
                .email("hr@techcorp.com")
                .password(passwordEncoder.encode("company123"))
                .role(User.Role.COMPANY)
                .isActive(true)
                .build();
            companyUser = userRepository.save(companyUser);

            Company company = Company.builder()
                .user(companyUser)
                .companyName("TechCorp Solutions")
                .hrName("John Smith")
                .hrEmail("hr@techcorp.com")
                .hrPhone("+1-555-0123")
                .website("https://techcorp.com")
                .description("Leading technology solutions provider")
                .industry("Information Technology")
                .status(Company.ApprovalStatus.APPROVED)
                .build();
            company = companyRepository.save(company);

            // Create sample job
            Job job = Job.builder()
                .company(company)
                .title("Software Developer")
                .description("Full-stack developer position with React and Spring Boot")
                .location("Bangalore")
                .salaryPackage("8-12 LPA")
                .minCgpa(7.0)
                .requiredSkills(Arrays.asList("Java", "React", "Spring Boot", "PostgreSQL"))
                .eligibleDepartments(Arrays.asList("Computer Science", "Information Technology"))
                .interviewDate(LocalDate.now().plusDays(15))
                .lastDate(LocalDate.now().plusDays(7))
                .build();
            jobRepository.save(job);

            log.info("Sample company created: hr@techcorp.com / company123");
        }
    }

    private void initializeSampleStudent() {
        if (!userRepository.existsByEmail("student@college.edu")) {
            User studentUser = User.builder()
                .name("Alice Johnson")
                .email("student@college.edu")
                .password(passwordEncoder.encode("student123"))
                .role(User.Role.STUDENT)
                .isActive(true)
                .build();
            studentUser = userRepository.save(studentUser);

            Department csDept = departmentRepository.findByName("Computer Science").orElse(null);
            Student student = Student.builder()
                .user(studentUser)
                .department(csDept)
                .rollNumber("CS2021001")
                .cgpa(8.5)
                .year(4)
                .phone("+1-555-0456")
                .skills(Arrays.asList("Java", "Python", "React", "Node.js"))
                .build();
            studentRepository.save(student);

            log.info("Sample student created: student@college.edu / student123");
        }
    }
}