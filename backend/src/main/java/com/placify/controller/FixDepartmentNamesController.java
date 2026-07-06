package com.placify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class FixDepartmentNamesController {

    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/fix-department-names")
    public ResponseEntity<?> fixDepartmentNames() {
        try {
            // Delete all existing departments
            jdbcTemplate.execute("DELETE FROM departments");
            
            // Insert correct 10 departments
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (1, 'CSE', 'Computer Science and Engineering') ON CONFLICT (id) DO UPDATE SET name = 'CSE', description = 'Computer Science and Engineering'");
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (2, 'CSE(CY)', 'Computer Science and Engineering (Cyber Security)') ON CONFLICT (id) DO UPDATE SET name = 'CSE(CY)', description = 'Computer Science and Engineering (Cyber Security)'");
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (3, 'AIDS', 'Artificial Intelligence and Data Science') ON CONFLICT (id) DO UPDATE SET name = 'AIDS', description = 'Artificial Intelligence and Data Science'");
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (4, 'AIML', 'Artificial Intelligence and Machine Learning') ON CONFLICT (id) DO UPDATE SET name = 'AIML', description = 'Artificial Intelligence and Machine Learning'");
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (5, 'IT', 'Information Technology') ON CONFLICT (id) DO UPDATE SET name = 'IT', description = 'Information Technology'");
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (6, 'CCE', 'Computer and Communication Engineering') ON CONFLICT (id) DO UPDATE SET name = 'CCE', description = 'Computer and Communication Engineering'");
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (7, 'ECE', 'Electronics and Communication Engineering') ON CONFLICT (id) DO UPDATE SET name = 'ECE', description = 'Electronics and Communication Engineering'");
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (8, 'EEE', 'Electrical and Electronics Engineering') ON CONFLICT (id) DO UPDATE SET name = 'EEE', description = 'Electrical and Electronics Engineering'");
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (9, 'CSBS', 'Computer Science and Business Systems') ON CONFLICT (id) DO UPDATE SET name = 'CSBS', description = 'Computer Science and Business Systems'");
            jdbcTemplate.execute("INSERT INTO departments (id, name, description) VALUES (10, 'MECH', 'Mechanical Engineering') ON CONFLICT (id) DO UPDATE SET name = 'MECH', description = 'Mechanical Engineering'");
            
            // Get counts
            var counts = jdbcTemplate.queryForList(
                "SELECT d.name, COUNT(s.id) as student_count FROM departments d " +
                "LEFT JOIN students s ON d.id = s.dept_id " +
                "GROUP BY d.id, d.name ORDER BY d.id"
            );

            return ResponseEntity.ok(Map.of(
                "message", "Department names fixed successfully!",
                "departments", counts
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
