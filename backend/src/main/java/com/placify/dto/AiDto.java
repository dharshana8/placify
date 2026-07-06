package com.placify.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AiDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeAnalysisRequest {
        private Long studentId;
        private String resumeText;
        private String filePath;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeAnalysisResponse {
        private Long id;
        private Integer originalScore;
        private Integer atsScore;
        private List<String> improvements;
        private String optimizedFilePath;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PlacementPredictionRequest {
        private Long studentId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PlacementPredictionResponse {
        private Long id;
        private BigDecimal predictionScore;
        private BigDecimal confidence;
        private List<SkillGapDto> skillGaps;
        private String explanation;
        private LocalDateTime predictedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillGapDto {
        private String skill;
        private String importance; // HIGH, MEDIUM, LOW
        private String recommendation;
        private List<Long> recommendedResourceIds;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GeneratePathwayRequest {
        private Long studentId;
        private Long targetJobId;
        private String targetRole;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PathwayResponse {
        private Long id;
        private String targetRole;
        private List<WeekPlanDto> weeklyPlan;
        private List<String> skillGaps;
        private Integer progressPercentage;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WeekPlanDto {
        private Integer weekNumber;
        private String weekGoal;
        private List<DayPlanDto> days;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DayPlanDto {
        private Integer dayNumber;
        private String topic;
        private Integer estimatedHours;
        private List<String> resources;
        private String miniProject;
        private Boolean completed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobMatchRequest {
        private Long studentId;
        private Long jobId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobMatchResponse {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private String companyName;
        private BigDecimal matchScore;
        private BigDecimal skillMatchPercentage;
        private Boolean cgpaMatch;
        private String explanation;
    }
}
