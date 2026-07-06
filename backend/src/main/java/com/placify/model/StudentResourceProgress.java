package com.placify.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_resource_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "resource_id", "pathway_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResourceProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private LearningResource resource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pathway_id")
    private LearningPathway pathway;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    @Builder.Default
    private ProgressStatus status = ProgressStatus.PENDING;

    @Column(name = "completion_percentage")
    @Builder.Default
    private Integer completionPercentage = 0;

    @Column(name = "time_spent_minutes")
    @Builder.Default
    private Integer timeSpentMinutes = 0;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum ProgressStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }
}
