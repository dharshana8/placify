package com.placify.controller;

import com.placify.dto.JobDto;
import com.placify.model.Company;
import com.placify.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(companyService.getProfile(user.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails user, @RequestBody Company req) {
        return ResponseEntity.ok(companyService.updateProfile(user.getUsername(), req));
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getJobs(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(companyService.getJobs(user.getUsername()));
    }

    @PostMapping("/jobs")
    public ResponseEntity<?> postJob(@AuthenticationPrincipal UserDetails user, @RequestBody JobDto dto) {
        return ResponseEntity.ok(companyService.postJob(user.getUsername(), dto));
    }

    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<?> updateJob(@AuthenticationPrincipal UserDetails user,
                                       @PathVariable Long jobId, @RequestBody JobDto dto) {
        return ResponseEntity.ok(companyService.updateJob(user.getUsername(), jobId, dto));
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<?> deleteJob(@AuthenticationPrincipal UserDetails user, @PathVariable Long jobId) {
        companyService.deleteJob(user.getUsername(), jobId);
        return ResponseEntity.ok(Map.of("message", "Job deleted"));
    }

    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<?> getApplicants(@AuthenticationPrincipal UserDetails user, @PathVariable Long jobId) {
        return ResponseEntity.ok(companyService.getApplicants(user.getUsername(), jobId));
    }

    @PutMapping("/jobs/{jobId}/applicants/{applicationId}")
    public ResponseEntity<?> updateStatus(@AuthenticationPrincipal UserDetails user,
                                          @PathVariable Long jobId,
                                          @PathVariable Long applicationId,
                                          @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(companyService.updateApplicantStatus(
                user.getUsername(), jobId, applicationId, body.get("status")));
    }

    @PostMapping("/jobs/{jobId}/bulk-action")
    public ResponseEntity<?> bulkAction(@AuthenticationPrincipal UserDetails user,
                                        @PathVariable Long jobId,
                                        @RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Long> ids = (List<Long>) body.get("applicationIds");
        String status = (String) body.get("status");
        companyService.bulkUpdateStatus(user.getUsername(), jobId, ids, status);
        return ResponseEntity.ok(Map.of("message", "Bulk action completed"));
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(companyService.getAnalytics(user.getUsername()));
    }

    @PostMapping("/contact-admin")
    public ResponseEntity<?> contactAdmin(@AuthenticationPrincipal UserDetails user,
                                          @RequestBody Map<String, String> body) {
        companyService.contactAdmin(user.getUsername(), body.get("subject"), body.get("message"));
        return ResponseEntity.ok(Map.of("message", "Message sent to admin successfully"));
    }

    @GetMapping("/email-templates")
    public ResponseEntity<?> getEmailTemplates(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(companyService.getEmailTemplates(user.getUsername()));
    }

    @PutMapping("/email-templates/{templateId}")
    public ResponseEntity<?> updateEmailTemplate(@AuthenticationPrincipal UserDetails user,
                                                  @PathVariable Long templateId,
                                                  @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(companyService.updateEmailTemplate(
                user.getUsername(), templateId, body.get("subject"), body.get("body")));
    }

    @PostMapping("/send-bulk-email")
    public ResponseEntity<?> sendBulkEmail(@AuthenticationPrincipal UserDetails user,
                                           @RequestBody Map<String, Object> body) {
        String templateName = (String) body.get("templateName");
        @SuppressWarnings("unchecked")
        List<Long> applicationIds = (List<Long>) body.get("applicationIds");
        companyService.sendBulkEmail(user.getUsername(), templateName, applicationIds);
        return ResponseEntity.ok(Map.of("message", "Emails sent successfully"));
    }
}
