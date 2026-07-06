package com.placify.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TargetAudience targetAudience;

    private String departmentName; // For DEPARTMENT target
    private Double minCgpa; // For CGPA filter
    private Double maxCgpa; // For CGPA filter

    @Column(nullable = false)
    private Integer recipientCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.SENT;

    @CreationTimestamp
    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;

    @ManyToOne
    @JoinColumn(name = "sent_by")
    private User sentBy;

    public enum TargetAudience {
        ALL_STUDENTS, ALL_COMPANIES, SPECIFIC_DEPARTMENT, CGPA_RANGE, ALL_USERS
    }

    public enum Status {
        SENT, FAILED
    }
}
