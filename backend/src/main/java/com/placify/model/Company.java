package com.placify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "hr_name")
    private String hrName;

    @Column(name = "hr_email")
    private String hrEmail;

    @Column(name = "hr_phone")
    private String hrPhone;

    private String website;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String industry;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApprovalStatus status = ApprovalStatus.PENDING;

    public enum ApprovalStatus {
        PENDING, APPROVED, REJECTED
    }
}
