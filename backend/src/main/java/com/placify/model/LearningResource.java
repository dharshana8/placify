package com.placify.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "learning_resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", length = 50)
    private ResourceType resourceType;

    @Column(name = "url", length = 1000)
    private String url;

    @Column(name = "platform", length = 100)
    private String platform;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", length = 20)
    private DifficultyLevel difficultyLevel;

    @Type(JsonType.class)
    @Column(name = "skills_covered", columnDefinition = "jsonb")
    private List<String> skillsCovered;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(name = "rating", precision = 3, scale = 1)
    private BigDecimal rating;

    @Column(name = "verified")
    @Builder.Default
    private Boolean verified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ResourceType {
        COURSE, VIDEO, ARTICLE, PROBLEM_SET, TUTORIAL, BOOK
    }

    public enum DifficultyLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}
