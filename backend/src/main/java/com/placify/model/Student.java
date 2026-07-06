package com.placify.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    private String rollNumber;

    private Double cgpa;

    private Integer year;

    private String phone;

    @ElementCollection
    @CollectionTable(name = "student_skills", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "skill")
    private List<String> skills;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "is_placed")
    @Builder.Default
    private boolean isPlaced = false;

    @Column(name = "can_apply")
    @Builder.Default
    private boolean canApply = true;

    @Column(name = "placement_probability")
    private Double placementProbability;

    @Column(name = "mock_score")
    private Double mockScore;

    @Column(name = "coding_score")
    private Double codingScore;

    @Column(columnDefinition = "TEXT")
    private String internalNotes;

    @Column(name = "is_recommended")
    @Builder.Default
    private boolean isRecommended = false;
}
