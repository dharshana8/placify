package com.placify.controller;

import com.placify.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted"));
    }

    @PutMapping("/students/{id}/permission")
    public ResponseEntity<?> updatePermission(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(adminService.updateStudentPermission(id, body.get("canApply")));
    }

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies() {
        return ResponseEntity.ok(adminService.getAllCompanies());
    }

    @GetMapping("/companies/pending")
    public ResponseEntity<?> getPendingCompanies() {
        return ResponseEntity.ok(adminService.getPendingCompanies());
    }

    @PutMapping("/companies/{id}/approve")
    public ResponseEntity<?> approveCompany(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveCompany(id));
    }

    @PutMapping("/companies/{id}/reject")
    public ResponseEntity<?> rejectCompany(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectCompany(id));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        adminService.deleteCompany(id);
        return ResponseEntity.ok(Map.of("message", "Company deleted"));
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs() {
        return ResponseEntity.ok(adminService.getAllJobs());
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(adminService.getAllApplications());
    }

    @GetMapping("/placements")
    public ResponseEntity<?> getAllPlacements() {
        return ResponseEntity.ok(adminService.getAllPlacements());
    }

    @PostMapping("/announcements")
    public ResponseEntity<?> sendAnnouncement(@RequestBody Map<String, String> body) {
        adminService.sendAnnouncement(body.get("message"));
        return ResponseEntity.ok(Map.of("message", "Announcement sent"));
    }

    @GetMapping("/department-stats")
    public ResponseEntity<?> getDeptStats() {
        return ResponseEntity.ok(adminService.getDepartmentStats());
    }

    @GetMapping("/risk-students")
    public ResponseEntity<?> getRiskStudents() {
        return ResponseEntity.ok(adminService.getRiskStudents());
    }
}
