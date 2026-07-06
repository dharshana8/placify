package com.placify.controller;

import com.placify.dto.StudentDto;
import com.placify.model.Achievement;
import com.placify.model.Quiz;
import com.placify.model.QuizQuestion;
import com.placify.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.getProfile(user.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails user,
            @RequestPart("data") StudentDto dto,
            @RequestPart(value = "resume", required = false) MultipartFile resume) throws Exception {
        return ResponseEntity.ok(studentService.updateProfile(user.getUsername(), dto, resume));
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> apply(@AuthenticationPrincipal UserDetails user, @PathVariable Long jobId) {
        return ResponseEntity.ok(studentService.applyForJob(user.getUsername(), jobId));
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.getApplications(user.getUsername()));
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.getNotifications(user.getUsername()));
    }

    @GetMapping("/notifications/unread-count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(Map.of("count", studentService.getUnreadNotificationCount(user.getUsername())));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<?> markAsRead(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        studentService.markNotificationAsRead(user.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PutMapping("/notifications/mark-all-read")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal UserDetails user) {
        studentService.markAllNotificationsAsRead(user.getUsername());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<?> deleteNotification(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        studentService.deleteNotification(user.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }

    @PostMapping("/contact-admin")
    public ResponseEntity<?> contactAdmin(@AuthenticationPrincipal UserDetails user,
                                          @RequestBody Map<String, String> body) {
        studentService.contactAdmin(user.getUsername(), body.get("subject"), body.get("message"));
        return ResponseEntity.ok(Map.of("message", "Message sent to admin successfully"));
    }

    @PostMapping("/request-permission")
    public ResponseEntity<?> requestPermission(@AuthenticationPrincipal UserDetails user,
                                               @RequestBody Map<String, String> body) {
        studentService.requestPermission(user.getUsername(), body.get("reason"));
        return ResponseEntity.ok(Map.of("message", "Permission request submitted successfully"));
    }

    // Quizzes
    @GetMapping("/quizzes")
    public ResponseEntity<?> getAvailableQuizzes(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.getAvailableQuizzes(user.getUsername()));
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<?> getQuizQuestions(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        return ResponseEntity.ok(studentService.getQuizQuestions(user.getUsername(), id));
    }

    @PostMapping("/quizzes/{id}/submit")
    public ResponseEntity<?> submitQuiz(@AuthenticationPrincipal UserDetails user,
                                        @PathVariable Long id,
                                        @RequestBody Map<String, Object> payload) {
        Map<Long, Integer> answers = new java.util.HashMap<>();
        Object answersObj = payload.get("answers");
        
        if (answersObj instanceof Map) {
            Map<?, ?> answersMap = (Map<?, ?>) answersObj;
            for (Map.Entry<?, ?> entry : answersMap.entrySet()) {
                Long questionId = Long.valueOf(entry.getKey().toString());
                Integer selectedOption = Integer.valueOf(entry.getValue().toString());
                answers.put(questionId, selectedOption);
            }
        }
        
        return ResponseEntity.ok(studentService.submitQuiz(user.getUsername(), id, answers));
    }

    @GetMapping("/quiz-attempts")
    public ResponseEntity<?> getMyQuizAttempts(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.getMyQuizAttempts(user.getUsername()));
    }

    // Achievements
    @PostMapping("/achievements")
    public ResponseEntity<?> submitAchievement(@AuthenticationPrincipal UserDetails user,
                                               @RequestBody Achievement achievement) {
        return ResponseEntity.ok(studentService.submitAchievement(user.getUsername(), achievement));
    }

    @GetMapping("/achievements")
    public ResponseEntity<?> getMyAchievements(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(studentService.getMyAchievements(user.getUsername()));
    }

    @DeleteMapping("/achievements/{id}")
    public ResponseEntity<?> deleteAchievement(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        studentService.deleteAchievement(user.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Achievement deleted successfully"));
    }
}
