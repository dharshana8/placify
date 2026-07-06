package com.placify.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "resume_optimizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeOptimization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "original_score")
    private Integer originalScore;

    @Column(name = "ats_score")
    private Integer atsScore;

    @Type(JsonType.class)
    @Column(name = "improvements", columnDefinition = "jsonb")
    private List<String> improvements;

    @Column(name = "original_file_path", length = 500)
    private String originalFilePath;

    @Column(name = "optimized_file_path", length = 500)
    private String optimizedFilePath;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
