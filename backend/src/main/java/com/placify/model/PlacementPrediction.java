package com.placify.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "placement_predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "prediction_score", precision = 5, scale = 2)
    private BigDecimal predictionScore;

    @Column(name = "confidence", precision = 5, scale = 2)
    private BigDecimal confidence;

    @Type(JsonType.class)
    @Column(name = "skill_gaps", columnDefinition = "jsonb")
    private List<SkillGap> skillGaps;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @CreationTimestamp
    @Column(name = "predicted_at", updatable = false)
    private LocalDateTime predictedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGap {
        private String skill;
        private String importance;
        private String recommendation;
    }
}
