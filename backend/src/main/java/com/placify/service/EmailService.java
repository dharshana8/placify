package com.placify.service;

import com.placify.model.EmailCampaign;
import com.placify.model.Student;
import com.placify.model.Company;
import com.placify.model.User;
import com.placify.repository.EmailCampaignRepository;
import com.placify.repository.StudentRepository;
import com.placify.repository.CompanyRepository;
import com.placify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailCampaignRepository emailCampaignRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public EmailCampaign sendEmailCampaign(EmailCampaign campaign) {
        List<String> recipients = getRecipients(campaign);
        
        try {
            for (String email : recipients) {
                sendEmail(email, campaign.getSubject(), campaign.getBody());
            }
            campaign.setRecipientCount(recipients.size());
            campaign.setStatus(EmailCampaign.Status.SENT);
            log.info("Email campaign sent to {} recipients", recipients.size());
        } catch (Exception e) {
            campaign.setStatus(EmailCampaign.Status.FAILED);
            log.error("Failed to send email campaign", e);
        }
        
        return emailCampaignRepository.save(campaign);
    }

    private List<String> getRecipients(EmailCampaign campaign) {
        return switch (campaign.getTargetAudience()) {
            case ALL_STUDENTS -> studentRepository.findAll().stream()
                    .map(s -> s.getUser().getEmail())
                    .collect(Collectors.toList());
            case ALL_COMPANIES -> companyRepository.findAll().stream()
                    .map(c -> c.getUser().getEmail())
                    .collect(Collectors.toList());
            case SPECIFIC_DEPARTMENT -> studentRepository.findAll().stream()
                    .filter(s -> s.getDepartment() != null && 
                            s.getDepartment().getName().equals(campaign.getDepartmentName()))
                    .map(s -> s.getUser().getEmail())
                    .collect(Collectors.toList());
            case CGPA_RANGE -> studentRepository.findAll().stream()
                    .filter(s -> s.getCgpa() >= campaign.getMinCgpa() && 
                            s.getCgpa() <= campaign.getMaxCgpa())
                    .map(s -> s.getUser().getEmail())
                    .collect(Collectors.toList());
            case ALL_USERS -> userRepository.findAll().stream()
                    .map(User::getEmail)
                    .collect(Collectors.toList());
        };
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("noreply@placify.com");
        mailSender.send(message);
    }

    public List<EmailCampaign> getAllCampaigns() {
        return emailCampaignRepository.findAllOrderBySentAtDesc();
    }
}
