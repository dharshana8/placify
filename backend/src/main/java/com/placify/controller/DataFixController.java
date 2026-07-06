package com.placify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class DataFixController {

    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/fix-departments")
    public ResponseEntity<?> fixDepartments() {
        try {
            // Insert or update departments
            String[] depts = {
                "(1, 'CSE', 'Computer Science and Engineering')",
                "(2, 'CSE(CY)', 'Computer Science and Engineering (Cyber Security)')",
                "(3, 'AIDS', 'Artificial Intelligence and Data Science')",
                "(4, 'AIML', 'Artificial Intelligence and Machine Learning')",
                "(5, 'IT', 'Information Technology')",
                "(6, 'CCE', 'Computer and Communication Engineering')",
                "(7, 'ECE', 'Electronics and Communication Engineering')",
                "(8, 'EEE', 'Electrical and Electronics Engineering')",
                "(9, 'CSBS', 'Computer Science and Business Systems')",
                "(10, 'MECH', 'Mechanical Engineering')"
            };
            
            for (String dept : depts) {
                try {
                    jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES " + dept + " ON CONFLICT (id) DO NOTHING");
                } catch (Exception e) {
                    // Ignore if already exists
                }
            }

            // Update ONLY NULL CGPAs with random values between 6.5 and 9.5
            jdbcTemplate.execute("UPDATE students SET cgpa = ROUND(CAST(6.5 + (RANDOM() * 3.0) AS numeric), 2) WHERE cgpa IS NULL");

            // Map departments based on email patterns from users table
            jdbcTemplate.execute("UPDATE students s SET dept_id = 9 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%csbs%'");
            jdbcTemplate.execute("UPDATE students s SET dept_id = 6 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%cce%'");
            jdbcTemplate.execute("UPDATE students s SET dept_id = 3 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%aids%'");
            jdbcTemplate.execute("UPDATE students s SET dept_id = 4 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%aiml%'");
            jdbcTemplate.execute("UPDATE students s SET dept_id = 2 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%cy%'");
            jdbcTemplate.execute("UPDATE students s SET dept_id = 1 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%cse%'");
            jdbcTemplate.execute("UPDATE students s SET dept_id = 7 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%ece%'");
            jdbcTemplate.execute("UPDATE students s SET dept_id = 8 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%eee%'");
            jdbcTemplate.execute("UPDATE students s SET dept_id = 10 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%mech%'");
            jdbcTemplate.execute("UPDATE students s SET dept_id = 5 FROM users u WHERE s.user_id = u.id AND s.dept_id IS NULL AND LOWER(u.email) LIKE '%it%'");
            
            // For students without matching pattern, assign random department (1-10)
            jdbcTemplate.execute("UPDATE students SET dept_id = FLOOR(1 + RANDOM() * 10)::int WHERE dept_id IS NULL");

            return ResponseEntity.ok(Map.of("message", "Departments and CGPAs fixed successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
