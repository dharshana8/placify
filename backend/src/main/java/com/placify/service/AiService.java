package com.placify.service;

import com.placify.dto.AiDto.*;
import com.placify.model.*;
import com.placify.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final StudentRepository studentRepository;
    private final ResumeOptimizationRepository resumeOptimizationRepository;
    private final PlacementPredictionRepository placementPredictionRepository;
    private final JobMatchScoreRepository jobMatchScoreRepository;
    private final JobRepository jobRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final RestTemplate restTemplate;
    private final NotificationService notificationService;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public ResumeAnalysisResponse analyzeResume(Long studentId, MultipartFile file) throws IOException {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        // Save file
        String filename = "resume_" + studentId + "_" + System.currentTimeMillis() + ".pdf";
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Extract text from PDF (simple version - in production use Apache PDFBox)
        String resumeText = extractTextFromFile(filePath);

        // Call Python AI service
        Map<String, Object> request = new HashMap<>();
        request.put("resume_text", resumeText);
        request.put("student_id", studentId);

        try {
            Map<String, Object> response = restTemplate.postForObject(
                aiServiceUrl + "/api/optimize-resume",
                request,
                Map.class
            );

            // Save to database
            List<String> improvements = (List<String>) response.get("improvements");
            Integer originalScore = (Integer) response.get("original_score");
            Integer atsScore = (Integer) response.get("ats_score");

            ResumeOptimization optimization = ResumeOptimization.builder()
                .student(student)
                .originalScore(originalScore)
                .atsScore(atsScore)
                .improvements(improvements)
                .originalFilePath(filePath.toString())
                .optimizedFilePath(filePath.toString()) // In production, generate optimized version
                .build();

            optimization = resumeOptimizationRepository.save(optimization);

            // Send notification
            notificationService.sendNotification(
                student.getUser().getId(),
                "RESUME_ANALYZED",
                "Resume Analysis Complete",
                String.format("Your resume scored %d/100. ATS Score: %d/100", originalScore, atsScore),
                optimization.getId(),
                "RESUME_OPTIMIZATION"
            );

            return ResumeAnalysisResponse.builder()
                .id(optimization.getId())
                .originalScore(originalScore)
                .atsScore(atsScore)
                .improvements(improvements)
                .optimizedFilePath(optimization.getOptimizedFilePath())
                .createdAt(optimization.getCreatedAt())
                .build();

        } catch (Exception e) {
            log.error("Error calling AI service for resume analysis", e);
            // Fallback: Use basic scoring
            return performBasicResumeAnalysis(student, filePath, resumeText);
        }
    }

    @Transactional
    public PlacementPredictionResponse predictPlacement(Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        // Prepare student data for ML model
        Map<String, Object> request = new HashMap<>();
        request.put("student_id", studentId);
        request.put("cgpa", student.getCgpa() != null ? student.getCgpa() : 0.0);
        request.put("skills_count", student.getSkills() != null ? student.getSkills().size() : 0);
        request.put("resume_score", getLatestResumeScore(student));
        request.put("mock_score", student.getMockScore() != null ? student.getMockScore() : 0.0);
        request.put("coding_score", student.getCodingScore() != null ? student.getCodingScore() : 0.0);

        try {
            Map<String, Object> response = restTemplate.postForObject(
                aiServiceUrl + "/api/predict-placement",
                request,
                Map.class
            );

            BigDecimal predictionScore = new BigDecimal(response.get("prediction_score").toString());
            BigDecimal confidence = new BigDecimal(response.get("confidence").toString());
            String explanation = (String) response.get("explanation");
            List<Map<String, String>> skillGapsRaw = (List<Map<String, String>>) response.get("skill_gaps");

            List<PlacementPrediction.SkillGap> skillGaps = skillGapsRaw.stream()
                .map(sg -> new PlacementPrediction.SkillGap(
                    sg.get("skill"),
                    sg.get("importance"),
                    sg.get("recommendation")
                ))
                .collect(Collectors.toList());

            PlacementPrediction prediction = PlacementPrediction.builder()
                .student(student)
                .predictionScore(predictionScore)
                .confidence(confidence)
                .skillGaps(skillGaps)
                .explanation(explanation)
                .build();

            prediction = placementPredictionRepository.save(prediction);

            // Update student placement probability
            student.setPlacementProbability(predictionScore.doubleValue());
            studentRepository.save(student);

            // Send notification
            notificationService.sendNotification(
                student.getUser().getId(),
                "PLACEMENT_PREDICTED",
                "Placement Prediction Updated",
                String.format("Your placement probability: %.1f%%. %s", predictionScore, explanation),
                prediction.getId(),
                "PLACEMENT_PREDICTION"
            );

            // Convert to DTO
            List<SkillGapDto> skillGapDtos = skillGaps.stream()
                .map(sg -> SkillGapDto.builder()
                    .skill(sg.getSkill())
                    .importance(sg.getImportance())
                    .recommendation(sg.getRecommendation())
                    .recommendedResourceIds(findResourcesForSkill(sg.getSkill()))
                    .build())
                .collect(Collectors.toList());

            return PlacementPredictionResponse.builder()
                .id(prediction.getId())
                .predictionScore(predictionScore)
                .confidence(confidence)
                .skillGaps(skillGapDtos)
                .explanation(explanation)
                .predictedAt(prediction.getPredictedAt())
                .build();

        } catch (Exception e) {
            log.error("Error calling AI service for placement prediction", e);
            return performBasicPlacementPrediction(student);
        }
    }

    @Transactional
    public JobMatchResponse matchStudentToJob(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

        // Calculate match score
        BigDecimal matchScore = calculateMatchScore(student, job);
        BigDecimal skillMatch = calculateSkillMatch(student, job);
        Boolean cgpaMatch = checkCgpaMatch(student, job);
        
        String explanation = generateMatchExplanation(student, job, matchScore);

        JobMatchScore matchScoreEntity = jobMatchScoreRepository
            .findByStudentAndJob(student, job)
            .orElse(JobMatchScore.builder()
                .student(student)
                .job(job)
                .build());

        matchScoreEntity.setMatchScore(matchScore);
        matchScoreEntity.setSkillMatchPercentage(skillMatch);
        matchScoreEntity.setCgpaMatch(cgpaMatch);
        matchScoreEntity.setExplanation(explanation);

        matchScoreEntity = jobMatchScoreRepository.save(matchScoreEntity);

        // If high match, send notification
        if (matchScore.compareTo(new BigDecimal("70.0")) >= 0) {
            notificationService.sendNotification(
                student.getUser().getId(),
                "JOB_MATCH",
                "New High-Match Job Found!",
                String.format("%.0f%% match with %s at %s", matchScore, job.getTitle(), job.getCompany().getCompanyName()),
                job.getId(),
                "JOB"
            );
        }

        return JobMatchResponse.builder()
            .id(matchScoreEntity.getId())
            .jobId(job.getId())
            .jobTitle(job.getTitle())
            .companyName(job.getCompany().getCompanyName())
            .matchScore(matchScore)
            .skillMatchPercentage(skillMatch)
            .cgpaMatch(cgpaMatch)
            .explanation(explanation)
            .build();
    }

    public List<ResumeAnalysisResponse> getResumeHistory(Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        return resumeOptimizationRepository.findByStudentOrderByCreatedAtDesc(student).stream()
            .map(opt -> ResumeAnalysisResponse.builder()
                .id(opt.getId())
                .originalScore(opt.getOriginalScore())
                .atsScore(opt.getAtsScore())
                .improvements(opt.getImprovements())
                .optimizedFilePath(opt.getOptimizedFilePath())
                .createdAt(opt.getCreatedAt())
                .build())
            .collect(Collectors.toList());
    }

    public List<PlacementPredictionResponse> getPredictionHistory(Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        return placementPredictionRepository.findByStudentOrderByPredictedAtDesc(student).stream()
            .map(pred -> PlacementPredictionResponse.builder()
                .id(pred.getId())
                .predictionScore(pred.getPredictionScore())
                .confidence(pred.getConfidence())
                .explanation(pred.getExplanation())
                .predictedAt(pred.getPredictedAt())
                .build())
            .collect(Collectors.toList());
    }

    // Helper methods
    private String extractTextFromFile(Path filePath) {
        // Simplified - in production use Apache PDFBox
        try {
            return Files.readString(filePath);
        } catch (IOException e) {
            return "";
        }
    }

    private Integer getLatestResumeScore(Student student) {
        return resumeOptimizationRepository.findTopByStudentOrderByCreatedAtDesc(student)
            .map(ResumeOptimization::getOriginalScore)
            .orElse(50);
    }

    private List<Long> findResourcesForSkill(String skill) {
        return learningResourceRepository.findBySkill(skill).stream()
            .limit(5)
            .map(LearningResource::getId)
            .collect(Collectors.toList());
    }

    private BigDecimal calculateMatchScore(Student student, Job job) {
        double score = 0.0;
        
        // CGPA match (30%)
        if (student.getCgpa() != null && job.getMinCgpa() != null) {
            if (student.getCgpa() >= job.getMinCgpa()) {
                score += 30.0;
            } else {
                score += (student.getCgpa() / job.getMinCgpa()) * 30.0;
            }
        }
        
        // Skill match (50%)
        if (student.getSkills() != null && job.getRequiredSkills() != null && !job.getRequiredSkills().isEmpty()) {
            long matchedSkills = student.getSkills().stream()
                .filter(s -> job.getRequiredSkills().stream()
                    .anyMatch(rs -> rs.equalsIgnoreCase(s)))
                .count();
            score += (matchedSkills * 50.0) / job.getRequiredSkills().size();
        }
        
        // Resume score (20%)
        Integer resumeScore = getLatestResumeScore(student);
        score += (resumeScore / 100.0) * 20.0;
        
        return BigDecimal.valueOf(Math.min(score, 100.0));
    }

    private BigDecimal calculateSkillMatch(Student student, Job job) {
        if (student.getSkills() == null || job.getRequiredSkills() == null || job.getRequiredSkills().isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        long matchedSkills = student.getSkills().stream()
            .filter(s -> job.getRequiredSkills().stream()
                .anyMatch(rs -> rs.equalsIgnoreCase(s)))
            .count();
        
        return BigDecimal.valueOf((matchedSkills * 100.0) / job.getRequiredSkills().size());
    }

    private Boolean checkCgpaMatch(Student student, Job job) {
        if (student.getCgpa() == null || job.getMinCgpa() == null) {
            return null;
        }
        return student.getCgpa() >= job.getMinCgpa();
    }

    private String generateMatchExplanation(Student student, Job job, BigDecimal matchScore) {
        StringBuilder explanation = new StringBuilder();
        explanation.append(String.format("Match Score: %.1f%%. ", matchScore));
        
        if (matchScore.compareTo(new BigDecimal("80")) >= 0) {
            explanation.append("Excellent match! You meet most requirements. ");
        } else if (matchScore.compareTo(new BigDecimal("60")) >= 0) {
            explanation.append("Good match. Consider applying. ");
        } else {
            explanation.append("Below average match. Improve your skills. ");
        }
        
        return explanation.toString();
    }

    private ResumeAnalysisResponse performBasicResumeAnalysis(Student student, Path filePath, String resumeText) {
        // Fallback basic analysis
        int wordCount = resumeText.split("\\s+").length;
        int originalScore = Math.min(wordCount / 10, 100);
        int atsScore = Math.min(wordCount / 12, 100);
        
        List<String> improvements = List.of(
            "Add more quantifiable achievements",
            "Include relevant technical skills",
            "Optimize for ATS keywords",
            "Add project descriptions",
            "Include certifications"
        );
        
        ResumeOptimization optimization = ResumeOptimization.builder()
            .student(student)
            .originalScore(originalScore)
            .atsScore(atsScore)
            .improvements(improvements)
            .originalFilePath(filePath.toString())
            .optimizedFilePath(filePath.toString())
            .build();
        
        optimization = resumeOptimizationRepository.save(optimization);
        
        return ResumeAnalysisResponse.builder()
            .id(optimization.getId())
            .originalScore(originalScore)
            .atsScore(atsScore)
            .improvements(improvements)
            .optimizedFilePath(optimization.getOptimizedFilePath())
            .createdAt(optimization.getCreatedAt())
            .build();
    }

    private PlacementPredictionResponse performBasicPlacementPrediction(Student student) {
        // Basic fallback prediction
        double score = 0.0;
        if (student.getCgpa() != null) score += (student.getCgpa() / 10.0) * 40;
        if (student.getSkills() != null) score += Math.min(student.getSkills().size() * 5, 30);
        if (student.getResumeUrl() != null) score += 15;
        if (student.getMockScore() != null) score += (student.getMockScore() / 100.0) * 15;
        
        BigDecimal predictionScore = BigDecimal.valueOf(Math.min(score, 100));
        BigDecimal confidence = BigDecimal.valueOf(65.0);
        
        String explanation = String.format(
            "Based on your CGPA (%.1f), %d skills, and overall profile, your placement probability is %.1f%%.",
            student.getCgpa() != null ? student.getCgpa() : 0.0,
            student.getSkills() != null ? student.getSkills().size() : 0,
            predictionScore
        );
        
        List<PlacementPrediction.SkillGap> skillGaps = List.of(
            new PlacementPrediction.SkillGap("DSA", "HIGH", "Practice 100+ LeetCode problems"),
            new PlacementPrediction.SkillGap("System Design", "MEDIUM", "Study scalability patterns")
        );
        
        PlacementPrediction prediction = PlacementPrediction.builder()
            .student(student)
            .predictionScore(predictionScore)
            .confidence(confidence)
            .skillGaps(skillGaps)
            .explanation(explanation)
            .build();
        
        prediction = placementPredictionRepository.save(prediction);
        
        return PlacementPredictionResponse.builder()
            .id(prediction.getId())
            .predictionScore(predictionScore)
            .confidence(confidence)
            .skillGaps(new ArrayList<>())
            .explanation(explanation)
            .predictedAt(prediction.getPredictedAt())
            .build();
    }
}
