package com.placify.repository;

import com.placify.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    @Query("SELECT a FROM Announcement a ORDER BY a.createdAt DESC")
    List<Announcement> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT a FROM Announcement a WHERE a.targetAudience = 'ALL_USERS' OR a.targetAudience = :audience ORDER BY a.createdAt DESC")
    List<Announcement> findByTargetAudience(Announcement.TargetAudience audience);
    
    @Query("SELECT a FROM Announcement a WHERE a.targetAudience = 'SPECIFIC_DEPARTMENT' AND a.departmentName = :dept ORDER BY a.createdAt DESC")
    List<Announcement> findByDepartment(String dept);
}
