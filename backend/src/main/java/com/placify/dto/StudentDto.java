package com.placify.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class StudentDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String department;
    private Long departmentId;
    private String rollNumber;
    private Double cgpa;
    private Integer year;
    private String phone;
    private List<String> skills;
    private String resumeUrl;
    private boolean isPlaced;
    private boolean canApply;
    private Double placementProbability;
    private Double mockScore;
    private Double codingScore;
    private String internalNotes;
    private boolean isRecommended;
}
