package com.placify.dto;

import lombok.*;
import java.time.LocalDateTime;

public class NotificationDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationResponse {
        private Long id;
        private String notificationType;
        private String title;
        private String message;
        private Long relatedEntityId;
        private String relatedEntityType;
        private Boolean isRead;
        private String priority;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateNotificationRequest {
        private Long userId;
        private String notificationType;
        private String title;
        private String message;
        private Long relatedEntityId;
        private String relatedEntityType;
        private String priority;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationSummary {
        private Long totalCount;
        private Long unreadCount;
        private LocalDateTime lastNotificationTime;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WebSocketNotification {
        private String type;
        private Object payload;
        private LocalDateTime timestamp;
    }
}
