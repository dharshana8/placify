package com.placify.service;

import com.placify.dto.StudentDto;
import com.placify.model.*;
import com.placify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentStaffRepository staffRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final StudentService studentService;
    private final ExcelService excelService;
    private final PlacementDriveRepository driveRepository;
    private final TrainingProgramRepository trainingRepository;
    private final StudentGroupRepository groupRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final AchievementRepository achievementRepository;

    public Department getDepartment(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        DepartmentStaff staff = staffRepository.findByUser(user).orElseThrow();
        return staff.getDepartment();
    }

    public List<StudentDto> getDepartmentStudents(String email) {
        Department dept = getDepartment(email);
        return studentRepository.findByDepartment(dept).stream()
                .map(studentService::toDto).collect(Collectors.toList());
    }

    public List<StudentDto> filterStudents(String email, Double minCgpa, String skills, Boolean isPlaced) {
        Department dept = getDepartment(email);
        return studentRepository.findByDepartment(dept).stream()
                .filter(s -> minCgpa == null || (s.getCgpa() != null && s.getCgpa() >= minCgpa))
                .filter(s -> skills == null || (s.getSkills() != null &&
                        s.getSkills().stream().anyMatch(sk -> sk.equalsIgnoreCase(skills))))
                .filter(s -> isPlaced == null || s.isPlaced() == isPlaced)
                .map(studentService::toDto).collect(Collectors.toList());
    }

    @Transactional
    public StudentDto addInternalNotes(String email, Long studentId, String notes) {
        Department dept = getDepartment(email);
        Student student = studentRepository.findById(studentId).orElseThrow();
        if (!student.getDepartment().getId().equals(dept.getId())) throw new RuntimeException("Unauthorized");
        student.setInternalNotes(notes);
        return studentService.toDto(studentRepository.save(student));
    }

    @Transactional
    public StudentDto updateInternalMarks(String email, Long studentId, Double mockScore, Double codingScore) {
        Department dept = getDepartment(email);
        Student student = studentRepository.findById(studentId).orElseThrow();
        if (!student.getDepartment().getId().equals(dept.getId())) throw new RuntimeException("Unauthorized");
        if (mockScore != null) student.setMockScore(mockScore);
        if (codingScore != null) student.setCodingScore(codingScore);
        return studentService.toDto(studentRepository.save(student));
    }

    @Transactional
    public StudentDto recommendStudent(String email, Long studentId) {
        Department dept = getDepartment(email);
        Student student = studentRepository.findById(studentId).orElseThrow();
        if (!student.getDepartment().getId().equals(dept.getId())) throw new RuntimeException("Unauthorized");
        student.setRecommended(true);
        return studentService.toDto(studentRepository.save(student));
    }

    @Transactional
    public void sendDeptAnnouncement(String email, String message) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Department dept = getDepartment(email);
        studentRepository.findByDepartment(dept).forEach(student -> {
            Notification notif = Notification.builder()
                    .user(student.getUser())
                    .message("[" + dept.getName() + "] " + message)
                    .type("DEPT_ANNOUNCEMENT")
                    .sentBy(user.getName())
                    .sentByRole("DEPARTMENT")
                    .build();
            notificationRepository.save(notif);
        });
    }

    public Map<String, Object> getDeptAnalytics(String email) {
        Department dept = getDepartment(email);
        List<Student> students = studentRepository.findByDepartment(dept);
        long total = students.size();
        long placed = students.stream().filter(Student::isPlaced).count();
        long eligible = students.stream().filter(s -> s.getCgpa() != null && s.getCgpa() >= 6.0).count();
        double avgCgpa = students.stream().filter(s -> s.getCgpa() != null)
                .mapToDouble(Student::getCgpa).average().orElse(0);
        double placementRate = total > 0 ? (double) placed / total * 100 : 0;

        Map<String, Long> skillFreq = new HashMap<>();
        students.stream().filter(s -> s.getSkills() != null)
                .flatMap(s -> s.getSkills().stream())
                .forEach(sk -> skillFreq.merge(sk, 1L, Long::sum));

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalStudents", total);
        analytics.put("placedStudents", placed);
        analytics.put("eligibleStudents", eligible);
        analytics.put("ineligibleStudents", total - eligible);
        analytics.put("avgCgpa", Math.round(avgCgpa * 100.0) / 100.0);
        analytics.put("placementRate", Math.round(placementRate * 10.0) / 10.0);
        analytics.put("avgPackage", 0);
        analytics.put("placementPercentage", Math.round(placementRate * 10.0) / 10.0);
        analytics.put("topSkills", skillFreq.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10).collect(Collectors.toList()));
        analytics.put("highPotentialStudents", students.stream()
                .filter(s -> s.getCgpa() != null && s.getCgpa() >= 8.0)
                .map(studentService::toDto).collect(Collectors.toList()));
        return analytics;
    }

    public String uploadExcel(String email, MultipartFile file) throws IOException {
        Department dept = getDepartment(email);
        return excelService.processExcel(file, dept);
    }

    // Placement Drives
    public List<PlacementDrive> getPlacementDrives(String email) {
        Department dept = getDepartment(email);
        return driveRepository.findByDepartmentOrderByDriveDateDesc(dept);
    }

    @Transactional
    public PlacementDrive createPlacementDrive(String email, PlacementDrive drive) {
        Department dept = getDepartment(email);
        drive.setDepartment(dept);
        return driveRepository.save(drive);
    }

    @Transactional
    public void deletePlacementDrive(String email, Long driveId) {
        Department dept = getDepartment(email);
        PlacementDrive drive = driveRepository.findById(driveId).orElseThrow();
        if (!drive.getDepartment().getId().equals(dept.getId())) throw new RuntimeException("Unauthorized");
        driveRepository.deleteById(driveId);
    }

    // Training Programs
    public List<TrainingProgram> getTrainingPrograms(String email) {
        Department dept = getDepartment(email);
        return trainingRepository.findByDepartmentOrderByStartDateDesc(dept);
    }

    @Transactional
    public TrainingProgram createTrainingProgram(String email, TrainingProgram program) {
        Department dept = getDepartment(email);
        program.setDepartment(dept);
        return trainingRepository.save(program);
    }

    @Transactional
    public void deleteTrainingProgram(String email, Long programId) {
        Department dept = getDepartment(email);
        TrainingProgram program = trainingRepository.findById(programId).orElseThrow();
        if (!program.getDepartment().getId().equals(dept.getId())) throw new RuntimeException("Unauthorized");
        trainingRepository.deleteById(programId);
    }

    // Student Groups
    public List<StudentGroup> getStudentGroups(String email) {
        Department dept = getDepartment(email);
        return groupRepository.findByDepartment(dept);
    }

    @Transactional
    public StudentGroup createStudentGroup(String email, StudentGroup group) {
        Department dept = getDepartment(email);
        group.setDepartment(dept);
        return groupRepository.save(group);
    }

    @Transactional
    public void deleteStudentGroup(String email, Long groupId) {
        Department dept = getDepartment(email);
        StudentGroup group = groupRepository.findById(groupId).orElseThrow();
        if (!group.getDepartment().getId().equals(dept.getId())) throw new RuntimeException("Unauthorized");
        groupRepository.deleteById(groupId);
    }

    // Quizzes
    public List<Quiz> getQuizzes(String email) {
        Department dept = getDepartment(email);
        return quizRepository.findByDepartmentOrderByCreatedAtDesc(dept);
    }

    @Transactional
    public Quiz createQuiz(String email, Quiz quiz, List<QuizQuestion> questions) {
        Department dept = getDepartment(email);
        quiz.setDepartment(dept);
        Quiz savedQuiz = quizRepository.save(quiz);
        
        for (QuizQuestion q : questions) {
            q.setQuiz(savedQuiz);
            quizQuestionRepository.save(q);
        }
        
        return savedQuiz;
    }

    @Transactional
    public void deleteQuiz(String email, Long quizId) {
        Department dept = getDepartment(email);
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        if (!quiz.getDepartment().getId().equals(dept.getId())) throw new RuntimeException("Unauthorized");
        quizQuestionRepository.deleteAll(quizQuestionRepository.findByQuiz(quiz));
        quizAttemptRepository.deleteAll(quizAttemptRepository.findByQuiz(quiz));
        quizRepository.deleteById(quizId);
    }

    public List<QuizAttempt> getQuizAttempts(String email, Long quizId) {
        Department dept = getDepartment(email);
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        if (!quiz.getDepartment().getId().equals(dept.getId())) throw new RuntimeException("Unauthorized");
        return quizAttemptRepository.findByQuiz(quiz);
    }

    // Achievements
    public List<Achievement> getDepartmentAchievements(String email) {
        Department dept = getDepartment(email);
        return achievementRepository.findByDepartment(dept.getName());
    }

    public List<Achievement> getPendingAchievements(String email) {
        Department dept = getDepartment(email);
        return achievementRepository.findByDepartmentAndStatus(dept.getName(), "PENDING");
    }

    @Transactional
    public Achievement approveAchievement(String email, Long achievementId, String comments) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Department dept = getDepartment(email);
        Achievement achievement = achievementRepository.findById(achievementId).orElseThrow();
        
        if (!achievement.getStudent().getDepartment().getId().equals(dept.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        achievement.setStatus("APPROVED");
        achievement.setReviewedAt(java.time.LocalDateTime.now());
        achievement.setReviewedBy(user.getName());
        achievement.setReviewComments(comments);
        
        // Notify student
        Notification notif = Notification.builder()
                .user(achievement.getStudent().getUser())
                .message("Your achievement '" + achievement.getTitle() + "' has been approved!")
                .type("ACHIEVEMENT_APPROVED")
                .build();
        notificationRepository.save(notif);
        
        return achievementRepository.save(achievement);
    }

    @Transactional
    public Achievement rejectAchievement(String email, Long achievementId, String comments) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Department dept = getDepartment(email);
        Achievement achievement = achievementRepository.findById(achievementId).orElseThrow();
        
        if (!achievement.getStudent().getDepartment().getId().equals(dept.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        achievement.setStatus("REJECTED");
        achievement.setReviewedAt(java.time.LocalDateTime.now());
        achievement.setReviewedBy(user.getName());
        achievement.setReviewComments(comments);
        
        // Notify student
        Notification notif = Notification.builder()
                .user(achievement.getStudent().getUser())
                .message("Your achievement '" + achievement.getTitle() + "' was not approved. Reason: " + comments)
                .type("ACHIEVEMENT_REJECTED")
                .build();
        notificationRepository.save(notif);
        
        return achievementRepository.save(achievement);
    }
}