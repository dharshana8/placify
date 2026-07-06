package com.placify.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "learning_pathways")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPathway {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_job_id")
    private Job targetJob;

    @Column(name = "target_role", length = 200)
    private String targetRole;

    @Type(JsonType.class)
    @Column(name = "weekly_plan", columnDefinition = "jsonb")
    private List<WeekPlan> weeklyPlan;

    @Type(JsonType.class)
    @Column(name = "skill_gaps", columnDefinition = "jsonb")
    private List<String> skillGaps;

    @Type(JsonType.class)
    @Column(name = "resources_assigned", columnDefinition = "jsonb")
    private List<Long> resourcesAssigned;

    @Column(name = "progress_percentage")
    @Builder.Default
    private Integer progressPercentage = 0;

    @Column(name = "status", length = 50)
    @Builder.Default
    private String status = "ACTIVE";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeekPlan {
        private Integer weekNumber;
        private String weekGoal;
        private List<DayPlan> days;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayPlan {
        private Integer dayNumber;
        private String topic;
        private Integer estimatedHours;
        private List<String> resources;
        private String miniProject;
        private Boolean completed;
    }
}
