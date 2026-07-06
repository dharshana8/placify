package com.placify.service;

import com.placify.dto.ApplicationDto;
import com.placify.dto.JobDto;
import com.placify.model.*;
import com.placify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final StudentService studentService;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailTemplateRepository emailTemplateRepository;
    private final StudentRepository studentRepository;

    public Company getProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return companyRepository.findByUser(user).orElseThrow();
    }

    @Transactional
    public Company updateProfile(String email, Company req) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        if (req.getCompanyName() != null) company.setCompanyName(req.getCompanyName());
        if (req.getHrName() != null) company.setHrName(req.getHrName());
        if (req.getHrEmail() != null) company.setHrEmail(req.getHrEmail());
        if (req.getHrPhone() != null) company.setHrPhone(req.getHrPhone());
        if (req.getWebsite() != null) company.setWebsite(req.getWebsite());
        if (req.getDescription() != null) company.setDescription(req.getDescription());
        if (req.getIndustry() != null) company.setIndustry(req.getIndustry());
        return companyRepository.save(company);
    }

    public List<JobDto> getJobs(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        return jobRepository.findByCompany(company).stream().map(this::toJobDto).collect(Collectors.toList());
    }

    @Transactional
    public JobDto postJob(String email, JobDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        if (company.getStatus() != Company.ApprovalStatus.APPROVED) {
            throw new RuntimeException("Company not approved yet");
        }
        Job job = Job.builder()
                .company(company)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .salaryPackage(dto.getSalaryPackage())
                .minCgpa(dto.getMinCgpa())
                .requiredSkills(dto.getRequiredSkills())
                .eligibleDepartments(dto.getEligibleDepartments())
                .interviewDate(dto.getInterviewDate())
                .lastDate(dto.getLastDate())
                .status(Job.JobStatus.ACTIVE)
                .build();
        return toJobDto(jobRepository.save(job));
    }

    @Transactional
    public JobDto updateJob(String email, Long jobId, JobDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();
        if (!job.getCompany().getId().equals(company.getId())) throw new RuntimeException("Unauthorized");

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setSalaryPackage(dto.getSalaryPackage());
        job.setMinCgpa(dto.getMinCgpa());
        job.setRequiredSkills(dto.getRequiredSkills());
        job.setEligibleDepartments(dto.getEligibleDepartments());
        job.setInterviewDate(dto.getInterviewDate());
        job.setLastDate(dto.getLastDate());
        return toJobDto(jobRepository.save(job));
    }

    @Transactional
    public void deleteJob(String email, Long jobId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();
        if (!job.getCompany().getId().equals(company.getId())) throw new RuntimeException("Unauthorized");
        jobRepository.delete(job);
    }

    public List<ApplicationDto> getApplicants(String email, Long jobId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();
        if (!job.getCompany().getId().equals(company.getId())) throw new RuntimeException("Unauthorized");
        return applicationRepository.findByJob(job).stream()
                .sorted(Comparator.comparingDouble(a -> -(a.getAiScore() != null ? a.getAiScore() : 0)))
                .map(studentService::toAppDto).collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto updateApplicantStatus(String email, Long jobId, Long applicationId, String status) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        if (!app.getJob().getCompany().getId().equals(company.getId())) throw new RuntimeException("Unauthorized");

        app.setStatus(Application.ApplicationStatus.valueOf(status));
        app.setUpdatedAt(LocalDateTime.now());

        if ("SELECTED".equals(status)) {
            app.getStudent().setPlaced(true);
            app.getStudent().setCanApply(false);
        }

        applicationRepository.save(app);

        Notification notif = Notification.builder()
                .user(app.getStudent().getUser())
                .message("Your application for " + app.getJob().getTitle() + " at " +
                        company.getCompanyName() + " is now: " + status)
                .type("STATUS_UPDATE")
                .build();
        notificationRepository.save(notif);

        messagingTemplate.convertAndSendToUser(
                app.getStudent().getUser().getEmail(),
                "/queue/notifications",
                Map.of("message", notif.getMessage(), "type", "STATUS_UPDATE")
        );

        return studentService.toAppDto(app);
    }

    @Transactional
    public void bulkUpdateStatus(String email, Long jobId, List<Long> applicationIds, String status) {
        applicationIds.forEach(id -> updateApplicantStatus(email, jobId, id, status));
    }

    public Map<String, Object> getAnalytics(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        List<Job> jobs = jobRepository.findByCompany(company);
        long totalApplicants = jobs.stream().mapToLong(j -> applicationRepository.findByJob(j).size()).sum();
        long selected = jobs.stream().flatMap(j -> applicationRepository.findByJob(j).stream())
                .filter(a -> a.getStatus() == Application.ApplicationStatus.SELECTED).count();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalJobs", jobs.size());
        analytics.put("totalApplicants", totalApplicants);
        analytics.put("totalSelected", selected);
        analytics.put("avgApplicantsPerJob", jobs.isEmpty() ? 0 : (double) totalApplicants / jobs.size());
        return analytics;
    }

    public List<EmailTemplate> getEmailTemplates(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        List<EmailTemplate> templates = emailTemplateRepository.findByCompanyId(company.getId());
        if (templates.isEmpty()) {
            templates = createDefaultTemplates(company);
        }
        return templates;
    }

    @Transactional
    public EmailTemplate updateEmailTemplate(String email, Long templateId, String subject, String body) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        EmailTemplate template = emailTemplateRepository.findById(templateId).orElseThrow();
        if (!template.getCompany().getId().equals(company.getId())) throw new RuntimeException("Unauthorized");
        template.setSubject(subject);
        template.setBody(body);
        template.setUpdatedAt(LocalDateTime.now());
        return emailTemplateRepository.save(template);
    }

    @Transactional
    public void sendBulkEmail(String email, String templateName, List<Long> applicationIds) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(user).orElseThrow();
        EmailTemplate template = emailTemplateRepository.findByCompanyIdAndName(company.getId(), templateName)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        for (Long appId : applicationIds) {
            Application app = applicationRepository.findById(appId).orElseThrow();
            if (!app.getJob().getCompany().getId().equals(company.getId())) continue;

            String personalizedSubject = replaceVariables(template.getSubject(), app, company);
            String personalizedBody = replaceVariables(template.getBody(), app, company);

            Notification notif = Notification.builder()
                    .user(app.getStudent().getUser())
                    .message(personalizedSubject + "\n\n" + personalizedBody)
                    .type("EMAIL_" + templateName)
                    .sentBy(company.getCompanyName())
                    .sentByRole("COMPANY")
                    .build();
            notificationRepository.save(notif);
        }
    }

    private String replaceVariables(String text, Application app, Company company) {
        return text
                .replace("{{candidateName}}", app.getStudent().getUser().getName())
                .replace("{{jobTitle}}", app.getJob().getTitle())
                .replace("{{companyName}}", company.getCompanyName())
                .replace("{{package}}", app.getJob().getSalaryPackage())
                .replace("{{location}}", app.getJob().getLocation())
                .replace("{{interviewDate}}", app.getJob().getInterviewDate() != null ? app.getJob().getInterviewDate().toString() : "TBD")
                .replace("{{interviewTime}}", "10:00 AM")
                .replace("{{joiningDate}}", "TBD")
                .replace("{{timeframe}}", "2 weeks");
    }

    private List<EmailTemplate> createDefaultTemplates(Company company) {
        List<EmailTemplate> templates = new ArrayList<>();
        
        EmailTemplate interview = new EmailTemplate();
        interview.setCompany(company);
        interview.setName("INTERVIEW_INVITATION");
        interview.setSubject("Interview Invitation - {{jobTitle}}");
        interview.setBody("Dear {{candidateName}},\n\nCongratulations! We are pleased to invite you for an interview for the position of {{jobTitle}}.\n\nInterview Details:\nDate: {{interviewDate}}\nTime: {{interviewTime}}\nLocation: {{location}}\n\nPlease confirm your availability.\n\nBest regards,\n{{companyName}}");
        templates.add(emailTemplateRepository.save(interview));

        EmailTemplate shortlisted = new EmailTemplate();
        shortlisted.setCompany(company);
        shortlisted.setName("SHORTLISTED");
        shortlisted.setSubject("Application Shortlisted - {{jobTitle}}");
        shortlisted.setBody("Dear {{candidateName}},\n\nGreat news! Your application for the {{jobTitle}} position at {{companyName}} has been shortlisted.\n\nWe were impressed with your profile and would like to proceed to the next stage of our selection process. We will contact you soon with further details.\n\nThank you for your interest in joining our team.\n\nBest regards,\n{{companyName}}");
        templates.add(emailTemplateRepository.save(shortlisted));

        EmailTemplate rejection = new EmailTemplate();
        rejection.setCompany(company);
        rejection.setName("REJECTION");
        rejection.setSubject("Application Status - {{jobTitle}}");
        rejection.setBody("Dear {{candidateName}},\n\nThank you for your interest in the {{jobTitle}} position at {{companyName}}. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe appreciate the time you invested in the application process and wish you the best in your job search.\n\nBest regards,\n{{companyName}}");
        templates.add(emailTemplateRepository.save(rejection));

        EmailTemplate offer = new EmailTemplate();
        offer.setCompany(company);
        offer.setName("OFFER_LETTER");
        offer.setSubject("Job Offer - {{jobTitle}}");
        offer.setBody("Dear {{candidateName}},\n\nWe are delighted to offer you the position of {{jobTitle}} at {{companyName}}.\n\nPackage: {{package}}\nJoining Date: {{joiningDate}}\nLocation: {{location}}\n\nPlease review the attached offer letter and respond within 7 days.\n\nWe look forward to welcoming you to our team!\n\nBest regards,\n{{companyName}}");
        templates.add(emailTemplateRepository.save(offer));

        EmailTemplate followup = new EmailTemplate();
        followup.setCompany(company);
        followup.setName("FOLLOW_UP");
        followup.setSubject("Application Follow-up - {{jobTitle}}");
        followup.setBody("Dear {{candidateName}},\n\nThank you for applying to the {{jobTitle}} position at {{companyName}}. We wanted to update you that your application is currently under review.\n\nWe will get back to you within {{timeframe}}.\n\nThank you for your patience.\n\nBest regards,\n{{companyName}}");
        templates.add(emailTemplateRepository.save(followup));

        return templates;
    }

    @Transactional
    public void contactAdmin(String email, String subject, String message) {
        User companyUser = userRepository.findByEmail(email).orElseThrow();
        Company company = companyRepository.findByUser(companyUser).orElse(null);
        String companyName = company != null ? company.getCompanyName() : email;
        String content = "[Company Contact: " + companyName + "] " + (subject != null ? subject + ": " : "") + message;
        userRepository.findAll().stream()
            .filter(u -> u.getRole() == User.Role.ADMIN)
            .forEach(admin -> notificationRepository.save(
                Notification.builder().user(admin).message(content).type("CONTACT").build()
            ));
    }

    public JobDto toJobDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setSalaryPackage(job.getSalaryPackage());
        dto.setMinCgpa(job.getMinCgpa());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setEligibleDepartments(job.getEligibleDepartments());
        dto.setInterviewDate(job.getInterviewDate());
        dto.setLastDate(job.getLastDate());
        dto.setStatus(job.getStatus().name());
        dto.setCompanyName(job.getCompany().getCompanyName());
        dto.setCompanyId(job.getCompany().getId());
        dto.setCompanyWebsite(job.getCompany().getWebsite());
        dto.setCompanyDescription(job.getCompany().getDescription());
        dto.setApplicantCount(applicationRepository.findByJob(job).size());
        return dto;
    }
}
