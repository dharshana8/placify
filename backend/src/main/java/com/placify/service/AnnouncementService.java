package com.placify.service;

import com.placify.model.Announcement;
import com.placify.model.User;
import com.placify.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public Announcement createAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllOrderByCreatedAtDesc();
    }

    public List<Announcement> getAnnouncementsForStudent(String departmentName) {
        List<Announcement> allUserAnnouncements = announcementRepository.findByTargetAudience(Announcement.TargetAudience.ALL_STUDENTS);
        List<Announcement> deptAnnouncements = announcementRepository.findByDepartment(departmentName);
        allUserAnnouncements.addAll(deptAnnouncements);
        return allUserAnnouncements;
    }

    public List<Announcement> getAnnouncementsForCompany() {
        return announcementRepository.findByTargetAudience(Announcement.TargetAudience.ALL_COMPANIES);
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}
