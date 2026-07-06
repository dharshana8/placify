package com.placify.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class LearningDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResourceDto {
        private Long id;
        private String title;
        private String description;
        private String resourceType;
        private String url;
        private String platform;
        private String difficultyLevel;
        private List<String> skillsCovered;
        private Integer durationHours;
        private BigDecimal rating;
        private Boolean verified;
        private Integer enrolledCount;
        private Integer completedCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResourceProgressDto {
        private Long id;
        private Long resourceId;
        private String resourceTitle;
        private String status;
        private Integer completionPercentage;
        private Integer timeSpentMinutes;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateProgressRequest {
        private Long resourceId;
        private Long pathwayId;
        private String status;
        private Integer completionPercentage;
        private Integer timeSpentMinutes;
        private String notes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResourceFilterRequest {
        private String skill;
        private String resourceType;
        private String difficultyLevel;
        private Boolean verified;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LearningHubDashboard {
        private String currentPathwayGoal;
        private Integer overallProgress;
        private List<String> skillGaps;
        private List<ResourceDto> recommendedResources;
        private List<ResourceProgressDto> recentProgress;
        private Integer totalResourcesAssigned;
        private Integer completedResources;
        private Integer totalTimeSpentHours;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RateResourceRequest {
        private Long resourceId;
        private Integer rating;
        private String feedback;
    }
}
