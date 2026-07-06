package com.placify.service;

import com.placify.dto.ApplicationDto;
import com.placify.dto.JobDto;
import com.placify.dto.StudentDto;
import com.placify.model.*;
import com.placify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationRepository notificationRepository;
    private final StudentService studentService;
    private final CompanyService companyService;
    private final SimpMessagingTemplate messagingTemplate;

    public Map<String, Object> getDashboardStats() {
        try {
            long totalStudents = studentRepository.count();
            long totalCompanies = companyRepository.findByStatus(Company.ApprovalStatus.APPROVED).size();
            long totalJobs = jobRepository.findByStatus(Job.JobStatus.ACTIVE).size();
            long totalPlacements = applicationRepository.countPlacements();
            long pendingCompanies = companyRepository.findByStatus(Company.ApprovalStatus.PENDING).size();
            double placementRate = totalStudents > 0 ? (double) totalPlacements / totalStudents * 100 : 0;

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalStudents", totalStudents);
            stats.put("totalCompanies", totalCompanies);
            stats.put("totalJobs", totalJobs);
            stats.put("totalPlacements", totalPlacements);
            stats.put("pendingCompanies", pendingCompanies);
            stats.put("placementRate", Math.round(placementRate * 10.0) / 10.0);
            stats.put("highestPackage", 0);
            return stats;
        } catch (Exception e) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalStudents", 0);
            stats.put("totalCompanies", 0);
            stats.put("totalJobs", 0);
            stats.put("totalPlacements", 0);
            stats.put("pendingCompanies", 0);
            stats.put("placementRate", 0);
            stats.put("highestPackage", 0);
            return stats;
        }
    }

    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream().map(studentService::toDto).collect(Collectors.toList());
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public List<Company> getPendingCompanies() {
        return companyRepository.findByStatus(Company.ApprovalStatus.PENDING);
    }

    @Transactional
    public Company approveCompany(Long companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        company.setStatus(Company.ApprovalStatus.APPROVED);
        companyRepository.save(company);

        Notification notif = Notification.builder()
                .user(company.getUser())
                .message("Your company " + company.getCompanyName() + " has been approved! You can now post jobs.")
                .type("COMPANY_APPROVED")
                .build();
        notificationRepository.save(notif);
        messagingTemplate.convertAndSendToUser(company.getUser().getEmail(), "/queue/notifications",
                Map.of("message", notif.getMessage()));
        return company;
    }

    @Transactional
    public Company rejectCompany(Long companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        company.setStatus(Company.ApprovalStatus.REJECTED);
        return companyRepository.save(company);
    }

    @Transactional
    public void deleteStudent(Long studentId) {
        studentRepository.deleteById(studentId);
    }

    @Transactional
    public void deleteCompany(Long companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        // Delete all applications for all jobs of this company first
        List<Job> jobs = jobRepository.findByCompany(company);
        jobs.forEach(job -> applicationRepository.deleteAll(applicationRepository.findByJob(job)));
        // Delete all jobs
        jobRepository.deleteAll(jobs);
        // Now delete company
        companyRepository.deleteById(companyId);
    }

    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream().map(companyService::toJobDto).collect(Collectors.toList());
    }

    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream().map(studentService::toAppDto).collect(Collectors.toList());
    }

    public List<ApplicationDto> getAllPlacements() {
        return applicationRepository.findAllPlacements().stream().map(studentService::toAppDto).collect(Collectors.toList());
    }

    @Transactional
    public void sendAnnouncement(String message) {
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.STUDENT).collect(Collectors.toList());
        students.forEach(user -> {
            Notification notif = Notification.builder()
                    .user(user)
                    .message(message)
                    .type("ANNOUNCEMENT")
                    .sentBy("Admin")
                    .sentByRole("ADMIN")
                    .build();
            notificationRepository.save(notif);
            messagingTemplate.convertAndSendToUser(user.getEmail(), "/queue/notifications",
                    Map.of("message", message, "type", "ANNOUNCEMENT"));
        });
    }

    public List<Map<String, Object>> getDepartmentStats() {
        List<String> validDepts = Arrays.asList("CSE", "CSE(CY)", "AIDS", "AIML", "IT", "CCE", "ECE", "EEE", "CSBS", "MECH");
        return departmentRepository.findAll().stream()
                .filter(dept -> validDepts.contains(dept.getName()))
                .map(dept -> {
                    long total = studentRepository.countByDept(dept.getId());
                    long placed = studentRepository.countPlacedByDept(dept.getId());
                    double rate = total > 0 ? (double) placed / total * 100 : 0;
                    Map<String, Object> map = new HashMap<>();
                    map.put("department", dept.getName());
                    map.put("departmentId", dept.getId());
                    map.put("total", total);
                    map.put("placed", placed);
                    map.put("placementRate", Math.round(rate * 10.0) / 10.0);
                    map.put("status", rate >= 70 ? "Excellent" : rate >= 50 ? "Good" : "Needs Improvement");
                    return map;
                }).collect(Collectors.toList());
    }

    public List<StudentDto> getRiskStudents() {
        return studentRepository.findRiskStudents().stream().map(studentService::toDto).collect(Collectors.toList());
    }

    @Transactional
    public StudentDto updateStudentPermission(Long studentId, boolean canApply) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        student.setCanApply(canApply);
        return studentService.toDto(studentRepository.save(student));
    }
}
