package com.placify.controller;

import com.placify.model.Achievement;
import com.placify.model.PlacementDrive;
import com.placify.model.TrainingProgram;
import com.placify.model.StudentGroup;
import com.placify.model.Quiz;
import com.placify.model.QuizQuestion;
import com.placify.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/department")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping("/info")
    public ResponseEntity<?> getDeptInfo(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(departmentService.getDepartment(user.getUsername()));
    }

    @GetMapping("/students")
    public ResponseEntity<?> getStudents(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(departmentService.getDepartmentStudents(user.getUsername()));
    }

    @GetMapping("/students/filter")
    public ResponseEntity<?> filterStudents(@AuthenticationPrincipal UserDetails user,
                                             @RequestParam(required = false) Double minCgpa,
                                             @RequestParam(required = false) String skills,
                                             @RequestParam(required = false) Boolean isPlaced) {
        return ResponseEntity.ok(departmentService.filterStudents(user.getUsername(), minCgpa, skills, isPlaced));
    }

    @PutMapping("/students/{studentId}/notes")
    public ResponseEntity<?> addNotes(@AuthenticationPrincipal UserDetails user,
                                      @PathVariable Long studentId,
                                      @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(departmentService.addInternalNotes(user.getUsername(), studentId, body.get("notes")));
    }

    @PutMapping("/students/{studentId}/marks")
    public ResponseEntity<?> updateMarks(@AuthenticationPrincipal UserDetails user,
                                         @PathVariable Long studentId,
                                         @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(departmentService.updateInternalMarks(
                user.getUsername(), studentId, body.get("mockScore"), body.get("codingScore")));
    }

    @PutMapping("/students/{studentId}/recommend")
    public ResponseEntity<?> recommend(@AuthenticationPrincipal UserDetails user, @PathVariable Long studentId) {
        return ResponseEntity.ok(departmentService.recommendStudent(user.getUsername(), studentId));
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(departmentService.getDeptAnalytics(user.getUsername()));
    }

    @PostMapping("/announcements")
    public ResponseEntity<?> sendAnnouncement(@AuthenticationPrincipal UserDetails user,
                                               @RequestBody Map<String, String> body) {
        departmentService.sendDeptAnnouncement(user.getUsername(), body.get("message"));
        return ResponseEntity.ok(Map.of("message", "Announcement sent to department"));
    }

    @PostMapping("/upload-excel")
    public ResponseEntity<?> uploadExcel(@AuthenticationPrincipal UserDetails user,
                                          @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(Map.of("result", departmentService.uploadExcel(user.getUsername(), file)));
    }

    // Placement Drives
    @GetMapping("/placement-drives")
    public ResponseEntity<?> getPlacementDrives(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(departmentService.getPlacementDrives(user.getUsername()));
    }

    @PostMapping("/placement-drives")
    public ResponseEntity<?> createPlacementDrive(@AuthenticationPrincipal UserDetails user,
                                                   @RequestBody PlacementDrive drive) {
        return ResponseEntity.ok(departmentService.createPlacementDrive(user.getUsername(), drive));
    }

    @DeleteMapping("/placement-drives/{id}")
    public ResponseEntity<?> deletePlacementDrive(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        departmentService.deletePlacementDrive(user.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Drive deleted"));
    }

    // Training Programs
    @GetMapping("/training-programs")
    public ResponseEntity<?> getTrainingPrograms(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(departmentService.getTrainingPrograms(user.getUsername()));
    }

    @PostMapping("/training-programs")
    public ResponseEntity<?> createTrainingProgram(@AuthenticationPrincipal UserDetails user,
                                                    @RequestBody TrainingProgram program) {
        return ResponseEntity.ok(departmentService.createTrainingProgram(user.getUsername(), program));
    }

    @DeleteMapping("/training-programs/{id}")
    public ResponseEntity<?> deleteTrainingProgram(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        departmentService.deleteTrainingProgram(user.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Program deleted"));
    }

    // Student Groups
    @GetMapping("/student-groups")
    public ResponseEntity<?> getStudentGroups(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(departmentService.getStudentGroups(user.getUsername()));
    }

    @PostMapping("/student-groups")
    public ResponseEntity<?> createStudentGroup(@AuthenticationPrincipal UserDetails user,
                                                 @RequestBody StudentGroup group) {
        return ResponseEntity.ok(departmentService.createStudentGroup(user.getUsername(), group));
    }

    @DeleteMapping("/student-groups/{id}")
    public ResponseEntity<?> deleteStudentGroup(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        departmentService.deleteStudentGroup(user.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Group deleted"));
    }

    // Quizzes
    @GetMapping("/quizzes")
    public ResponseEntity<?> getQuizzes(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(departmentService.getQuizzes(user.getUsername()));
    }

    @PostMapping("/quizzes")
    public ResponseEntity<?> createQuiz(@AuthenticationPrincipal UserDetails user,
                                        @RequestBody Map<String, Object> payload) {
        Quiz quiz = Quiz.builder()
                .title((String) payload.get("title"))
                .description((String) payload.get("description"))
                .duration((Integer) payload.get("duration"))
                .totalMarks((Integer) payload.get("totalMarks"))
                .build();
        
        List<Map<String, Object>> questionsData = (List<Map<String, Object>>) payload.get("questions");
        List<QuizQuestion> questions = questionsData.stream().map(q -> QuizQuestion.builder()
                .question((String) q.get("question"))
                .option1((String) q.get("option1"))
                .option2((String) q.get("option2"))
                .option3((String) q.get("option3"))
                .option4((String) q.get("option4"))
                .correctOption((Integer) q.get("correctOption"))
                .marks((Integer) q.get("marks"))
                .build()).toList();
        
        return ResponseEntity.ok(departmentService.createQuiz(user.getUsername(), quiz, questions));
    }

    @DeleteMapping("/quizzes/{id}")
    public ResponseEntity<?> deleteQuiz(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        departmentService.deleteQuiz(user.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Quiz deleted"));
    }

    @GetMapping("/quizzes/{id}/attempts")
    public ResponseEntity<?> getQuizAttempts(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getQuizAttempts(user.getUsername(), id));
    }

    // Achievements
    @GetMapping("/achievements")
    public ResponseEntity<?> getDepartmentAchievements(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(departmentService.getDepartmentAchievements(user.getUsername()));
    }

    @GetMapping("/achievements/pending")
    public ResponseEntity<?> getPendingAchievements(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(departmentService.getPendingAchievements(user.getUsername()));
    }

    @PutMapping("/achievements/{id}/approve")
    public ResponseEntity<?> approveAchievement(@AuthenticationPrincipal UserDetails user,
                                                @PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(departmentService.approveAchievement(
                user.getUsername(), id, body.get("comments")));
    }

    @PutMapping("/achievements/{id}/reject")
    public ResponseEntity<?> rejectAchievement(@AuthenticationPrincipal UserDetails user,
                                               @PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(departmentService.rejectAchievement(
                user.getUsername(), id, body.get("comments")));
    }
}
