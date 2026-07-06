package com.placify.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class JobDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String salaryPackage;
    private Double minCgpa;
    private List<String> requiredSkills;
    private List<String> eligibleDepartments;
    private LocalDate interviewDate;
    private LocalDate lastDate;
    private String status;
    private String companyName;
    private Long companyId;
    private String companyWebsite;
    private String companyDescription;
    private int applicantCount;
    private boolean applied;
}
