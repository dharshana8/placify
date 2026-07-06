package com.placify.controller;

import com.placify.model.Announcement;
import com.placify.model.User;
import com.placify.model.Student;
import com.placify.repository.UserRepository;
import com.placify.repository.StudentRepository;
import com.placify.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        
        Announcement announcement = Announcement.builder()
                .title((String) request.get("title"))
                .message((String) request.get("message"))
                .targetAudience(Announcement.TargetAudience.valueOf((String) request.get("targetAudience")))
                .departmentName((String) request.get("departmentName"))
                .createdBy(user)
                .build();
        
        return ResponseEntity.ok(announcementService.createAnnouncement(announcement));
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getAnnouncements(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        
        if (user.getRole() == User.Role.ADMIN || user.getRole() == User.Role.DEPARTMENT) {
            return ResponseEntity.ok(announcementService.getAllAnnouncements());
        } else if (user.getRole() == User.Role.STUDENT) {
            Student student = studentRepository.findByUser(user).orElseThrow();
            String deptName = student.getDepartment() != null ? student.getDepartment().getName() : "";
            return ResponseEntity.ok(announcementService.getAnnouncementsForStudent(deptName));
        } else if (user.getRole() == User.Role.COMPANY) {
            return ResponseEntity.ok(announcementService.getAnnouncementsForCompany());
        }
        
        return ResponseEntity.ok(List.of());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok().build();
    }
}
