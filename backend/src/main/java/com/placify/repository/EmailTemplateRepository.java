package com.placify.repository;

import com.placify.model.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {
    List<EmailTemplate> findByCompanyId(Long companyId);
    Optional<EmailTemplate> findByCompanyIdAndName(Long companyId, String name);
}
