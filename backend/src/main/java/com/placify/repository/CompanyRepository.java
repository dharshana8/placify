package com.placify.repository;

import com.placify.model.Company;
import com.placify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUser(User user);
    Optional<Company> findByUserId(Long userId);
    List<Company> findByStatus(Company.ApprovalStatus status);
}
