package com.placify.repository;

import com.placify.model.RealTimeNotification;
import com.placify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RealTimeNotificationRepository extends JpaRepository<RealTimeNotification, Long> {
    
    List<RealTimeNotification> findByUserOrderByCreatedAtDesc(User user);
    
    List<RealTimeNotification> findByUserAndIsReadOrderByCreatedAtDesc(User user, Boolean isRead);
    
    long countByUserAndIsReadFalse(User user);
    
    @Query("SELECT rtn FROM RealTimeNotification rtn WHERE rtn.user = :user AND rtn.createdAt >= :since ORDER BY rtn.createdAt DESC")
    List<RealTimeNotification> findRecentNotifications(
        @Param("user") User user, 
        @Param("since") LocalDateTime since
    );
    
    void deleteByUserAndCreatedAtBefore(User user, LocalDateTime before);
}
