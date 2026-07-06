package com.placify.dto;

import lombok.Data;

@Data
public class CompanyDto {
    private Long id;
    private Long userId;
    private String companyName;
    private String hrName;
    private String hrEmail;
    private String hrPhone;
    private String website;
    private String description;
    private String industry;
    private String status;
    private int totalJobs;
    private int totalApplicants;
    private int totalSelected;
}