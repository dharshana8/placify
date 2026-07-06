package com.placify.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_match_scores", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "job_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatchScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "match_score", precision = 5, scale = 2)
    private BigDecimal matchScore;

    @Column(name = "skill_match_percentage", precision = 5, scale = 2)
    private BigDecimal skillMatchPercentage;

    @Column(name = "experience_match")
    private Boolean experienceMatch;

    @Column(name = "cgpa_match")
    private Boolean cgpaMatch;

    @Column(name = "location_match")
    private Boolean locationMatch;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
