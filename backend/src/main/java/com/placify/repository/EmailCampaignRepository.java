package com.placify.repository;

import com.placify.model.EmailCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmailCampaignRepository extends JpaRepository<EmailCampaign, Long> {
    
    @Query("SELECT e FROM EmailCampaign e ORDER BY e.sentAt DESC")
    List<EmailCampaign> findAllOrderBySentAtDesc();
}
