package com.placify.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentDepartment;
    private Double studentCgpa;
    private String studentPhone;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String salaryPackage;
    private String status;
    private Double aiScore;
    private Integer aiRank;
    private LocalDateTime appliedAt;
    private String resumeUrl;
    private List<String> skills;
    private Integer year;
    private String rollNumber;
    
    // Aliases for backward compatibility
    public Double getCgpa() { return studentCgpa; }
    public String getDepartment() { return studentDepartment; }
    public LocalDateTime getAppliedDate() { return appliedAt; }
}
