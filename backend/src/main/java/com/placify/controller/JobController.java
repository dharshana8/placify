package com.placify.controller;

import com.placify.model.Student;
import com.placify.model.User;
import com.placify.repository.ApplicationRepository;
import com.placify.repository.JobRepository;
import com.placify.repository.StudentRepository;
import com.placify.repository.UserRepository;
import com.placify.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;
    private final CompanyService companyService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;

    @GetMapping
    public ResponseEntity<?> getActiveJobs(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String location) {
        System.out.println("=== Getting Active Jobs ===");
        System.out.println("Role filter: " + role);
        System.out.println("Location filter: " + location);
        
        try {
            List<com.placify.model.Job> allJobs = jobRepository.findAll();
            System.out.println("Total jobs in database: " + allJobs.size());
            allJobs.forEach(j -> System.out.println("Job: " + j.getTitle() + ", Status: " + j.getStatus() + ", Company: " + (j.getCompany() != null ? j.getCompany().getCompanyName() : "NULL")));
            
            // Try to get active jobs
            List<com.placify.model.Job> activeJobs;
            if (role != null || location != null) {
                activeJobs = jobRepository.findActiveJobsWithFilters(role, location);
            } else {
                // Use simpler method when no filters
                activeJobs = jobRepository.findAllActiveJobs();
            }
            System.out.println("Active jobs found: " + activeJobs.size());
            
            // Check if user is a student and mark applied jobs
            Student student = null;
            if (userDetails != null) {
                try {
                    User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
                    if (user != null && user.getRole() == User.Role.STUDENT) {
                        student = studentRepository.findByUser(user).orElse(null);
                    }
                } catch (Exception e) {
                    System.out.println("Could not fetch student: " + e.getMessage());
                }
            }
            
            final Student finalStudent = student;
            List<com.placify.dto.JobDto> jobDtos = activeJobs.stream().map(job -> {
                var dto = companyService.toJobDto(job);
                if (finalStudent != null) {
                    dto.setApplied(applicationRepository.existsByStudentAndJob(finalStudent, job));
                }
                return dto;
            }).collect(Collectors.toList());
            
            System.out.println("Returning " + jobDtos.size() + " jobs to frontend");
            return ResponseEntity.ok(jobDtos);
        } catch (Exception e) {
            System.err.println("Error fetching jobs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch jobs: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJob(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(j -> ResponseEntity.ok(companyService.toJobDto(j)))
                .orElse(ResponseEntity.notFound().build());
    }
}
