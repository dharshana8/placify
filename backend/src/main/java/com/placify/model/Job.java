package com.placify.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Column(name = "salary_package")
    private String salaryPackage;

    @Column(name = "min_cgpa")
    private Double minCgpa;

    @ElementCollection
    @CollectionTable(name = "job_required_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> requiredSkills;

    @ElementCollection
    @CollectionTable(name = "job_eligible_depts", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "department")
    private List<String> eligibleDepartments;

    @Column(name = "interview_date")
    private LocalDate interviewDate;

    @Column(name = "last_date")
    private LocalDate lastDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum JobStatus {
        ACTIVE, CLOSED, DRAFT
    }
}
