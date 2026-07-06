package com.placify.controller;

import com.placify.model.EmailCampaign;
import com.placify.model.User;
import com.placify.repository.UserRepository;
import com.placify.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/email-campaigns")
@RequiredArgsConstructor
public class EmailCampaignController {

    private final EmailService emailService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<EmailCampaign> sendEmailCampaign(
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        
        EmailCampaign campaign = EmailCampaign.builder()
                .subject((String) request.get("subject"))
                .body((String) request.get("body"))
                .targetAudience(EmailCampaign.TargetAudience.valueOf((String) request.get("targetAudience")))
                .departmentName((String) request.get("departmentName"))
                .minCgpa(request.get("minCgpa") != null ? ((Number) request.get("minCgpa")).doubleValue() : null)
                .maxCgpa(request.get("maxCgpa") != null ? ((Number) request.get("maxCgpa")).doubleValue() : null)
                .sentBy(user)
                .build();
        
        return ResponseEntity.ok(emailService.sendEmailCampaign(campaign));
    }

    @GetMapping
    public ResponseEntity<List<EmailCampaign>> getAllCampaigns() {
        return ResponseEntity.ok(emailService.getAllCampaigns());
    }
}
