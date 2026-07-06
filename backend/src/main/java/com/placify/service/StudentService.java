package com.placify.service;

import com.placify.dto.ApplicationDto;
import com.placify.dto.StudentDto;
import com.placify.model.*;
import com.placify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final DepartmentRepository departmentRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final AchievementRepository achievementRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public StudentDto getProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        return toDto(student);
    }

    @Transactional
    public StudentDto updateProfile(String email, StudentDto dto, MultipartFile resumeFile) throws IOException {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) student.setPhone(dto.getPhone());
        if (dto.getCgpa() != null) student.setCgpa(dto.getCgpa());
        if (dto.getYear() != null) student.setYear(dto.getYear());
        if (dto.getSkills() != null) student.setSkills(dto.getSkills());
        if (dto.getRollNumber() != null) student.setRollNumber(dto.getRollNumber());

        if (dto.getDepartment() != null && !dto.getDepartment().isBlank()) {
            departmentRepository.findByName(dto.getDepartment())
                .ifPresent(student::setDepartment);
        }

        if (resumeFile != null && !resumeFile.isEmpty()) {
            String filename = "resume_" + student.getId() + "_" + System.currentTimeMillis()
                    + getExtension(resumeFile.getOriginalFilename());
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            Files.copy(resumeFile.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            student.setResumeUrl("/uploads/" + filename);
        }

        student.setPlacementProbability(calculateProbability(student));
        userRepository.save(user);
        return toDto(studentRepository.save(student));
    }

    @Transactional
    public ApplicationDto applyForJob(String email, Long jobId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (student.isPlaced() && !student.isCanApply()) {
            throw new RuntimeException("You are already placed. Request admin permission to apply.");
        }
        if (applicationRepository.existsByStudentAndJob(student, job)) {
            throw new RuntimeException("Already applied for this job");
        }

        double aiScore = calculateAiScore(student, job);
        Application app = Application.builder()
                .student(student)
                .job(job)
                .aiScore(aiScore)
                .build();
        app = applicationRepository.save(app);

        Notification notif = Notification.builder()
                .user(user)
                .message("Successfully applied for " + job.getTitle() + " at " + job.getCompany().getCompanyName())
                .type("APPLICATION")
                .build();
        notificationRepository.save(notif);

        return toAppDto(app);
    }

    public List<ApplicationDto> getApplications(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        return applicationRepository.findByStudent(student).stream()
                .map(this::toAppDto).collect(Collectors.toList());
    }

    public List<Notification> getNotifications(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public long getUnreadNotificationCount(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .filter(n -> !n.isRead()).count();
    }

    @Transactional
    public void markNotificationAsRead(String email, Long notificationId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllNotificationsAsRead(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void deleteNotification(String email, Long notificationId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        notificationRepository.delete(notification);
    }

    @Transactional
    public void contactAdmin(String email, String subject, String message) {
        User student = userRepository.findByEmail(email).orElseThrow();
        String content = "[Contact from " + student.getName() + "] " + (subject != null ? subject + ": " : "") + message;
        userRepository.findAll().stream()
            .filter(u -> u.getRole() == User.Role.ADMIN)
            .forEach(admin -> notificationRepository.save(
                Notification.builder().user(admin).message(content).type("CONTACT").build()
            ));
    }

    @Transactional
    public void requestPermission(String email, String reason) {
        User student = userRepository.findByEmail(email).orElseThrow();
        String content = "[Permission Request from " + student.getName() + "] " + (reason != null ? reason : "No reason provided");
        userRepository.findAll().stream()
            .filter(u -> u.getRole() == User.Role.ADMIN)
            .forEach(admin -> notificationRepository.save(
                Notification.builder().user(admin).message(content).type("PERMISSION_REQUEST").build()
            ));
    }

    private double calculateProbability(Student s) {
        double score = 0;
        if (s.getCgpa() != null) score += Math.min(s.getCgpa() / 10.0 * 40, 40);
        if (s.getSkills() != null) score += Math.min(s.getSkills().size() * 5, 30);
        if (s.getResumeUrl() != null) score += 15;
        if (s.getMockScore() != null) score += s.getMockScore() * 0.1;
        if (s.getCodingScore() != null) score += s.getCodingScore() * 0.05;
        return Math.min(score, 100);
    }

    private double calculateAiScore(Student s, Job job) {
        double score = 0;
        if (s.getCgpa() != null && job.getMinCgpa() != null) {
            score += (s.getCgpa() / 10.0) * 50;
        }
        if (s.getSkills() != null && job.getRequiredSkills() != null) {
            long matched = s.getSkills().stream()
                    .filter(sk -> job.getRequiredSkills().stream()
                            .anyMatch(rs -> rs.equalsIgnoreCase(sk))).count();
            score += (double) matched / Math.max(job.getRequiredSkills().size(), 1) * 50;
        }
        return Math.min(score, 100);
    }

    private String getExtension(String filename) {
        if (filename == null) return ".pdf";
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot) : ".pdf";
    }

    public StudentDto toDto(Student s) {
        StudentDto dto = new StudentDto();
        dto.setId(s.getId());
        dto.setUserId(s.getUser().getId());
        dto.setName(s.getUser().getName());
        dto.setEmail(s.getUser().getEmail());
        dto.setDepartment(s.getDepartment() != null ? s.getDepartment().getName() : null);
        dto.setDepartmentId(s.getDepartment() != null ? s.getDepartment().getId() : null);
        dto.setRollNumber(s.getRollNumber());
        dto.setCgpa(s.getCgpa());
        dto.setYear(s.getYear());
        dto.setPhone(s.getPhone());
        dto.setSkills(s.getSkills());
        dto.setResumeUrl(s.getResumeUrl());
        dto.setPlaced(s.isPlaced());
        dto.setCanApply(s.isCanApply());
        dto.setPlacementProbability(s.getPlacementProbability());
        dto.setMockScore(s.getMockScore());
        dto.setCodingScore(s.getCodingScore());
        dto.setRecommended(s.isRecommended());
        return dto;
    }

    public ApplicationDto toAppDto(Application a) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(a.getId());
        dto.setStudentId(a.getStudent().getId());
        dto.setStudentName(a.getStudent().getUser().getName());
        dto.setStudentEmail(a.getStudent().getUser().getEmail());
        dto.setStudentDepartment(a.getStudent().getDepartment() != null ? a.getStudent().getDepartment().getName() : null);
        dto.setStudentCgpa(a.getStudent().getCgpa());
        dto.setStudentPhone(a.getStudent().getPhone());
        dto.setJobId(a.getJob().getId());
        dto.setJobTitle(a.getJob().getTitle());
        dto.setCompanyName(a.getJob().getCompany().getCompanyName());
        dto.setSalaryPackage(a.getJob().getSalaryPackage());
        dto.setStatus(a.getStatus().name());
        dto.setAiScore(a.getAiScore());
        dto.setAiRank(a.getAiRank());
        dto.setAppliedAt(a.getAppliedAt());
        dto.setResumeUrl(a.getStudent().getResumeUrl());
        dto.setSkills(a.getStudent().getSkills());
        dto.setYear(a.getStudent().getYear());
        dto.setRollNumber(a.getStudent().getRollNumber());
        return dto;
    }

    // Quiz methods
    public List<Quiz> getAvailableQuizzes(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        if (student.getDepartment() == null) return List.of();
        return quizRepository.findByDepartmentAndStatus(student.getDepartment(), Quiz.Status.ACTIVE);
    }

    public Map<String, Object> getQuizQuestions(String email, Long quizId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        
        // Check if already attempted
        if (quizAttemptRepository.findByQuizAndStudent(quiz, student).isPresent()) {
            throw new RuntimeException("You have already attempted this quiz");
        }
        
        List<QuizQuestion> questions = quizQuestionRepository.findByQuiz(quiz);
        return Map.of(
            "quiz", quiz,
            "questions", questions
        );
    }

    @Transactional
    public QuizAttempt submitQuiz(String email, Long quizId, Map<Long, Integer> answers) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        
        // Check if already attempted
        if (quizAttemptRepository.findByQuizAndStudent(quiz, student).isPresent()) {
            throw new RuntimeException("You have already attempted this quiz");
        }
        
        List<QuizQuestion> questions = quizQuestionRepository.findByQuiz(quiz);
        int score = 0;
        
        for (QuizQuestion q : questions) {
            Integer selectedOption = answers.get(q.getId());
            if (selectedOption != null && selectedOption.equals(q.getCorrectOption())) {
                score += q.getMarks();
            }
        }
        
        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .student(student)
                .score(score)
                .totalMarks(quiz.getTotalMarks())
                .answers(answers.toString())
                .build();
        
        return quizAttemptRepository.save(attempt);
    }

    public List<QuizAttempt> getMyQuizAttempts(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        return quizAttemptRepository.findByStudent(student);
    }

    // Achievement methods
    @Transactional
    public Achievement submitAchievement(String email, Achievement achievement) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        achievement.setStudent(student);
        achievement.setStatus("PENDING");
        achievement.setSubmittedAt(LocalDateTime.now());
        return achievementRepository.save(achievement);
    }

    public List<Achievement> getMyAchievements(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        return achievementRepository.findByStudentOrderBySubmittedAtDesc(student);
    }

    @Transactional
    public void deleteAchievement(String email, Long achievementId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser(user).orElseThrow();
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement not found"));
        if (!achievement.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        achievementRepository.delete(achievement);
    }
}
