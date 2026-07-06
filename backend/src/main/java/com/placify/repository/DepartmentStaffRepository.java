package com.placify.repository;

import com.placify.model.DepartmentStaff;
import com.placify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DepartmentStaffRepository extends JpaRepository<DepartmentStaff, Long> {
    Optional<DepartmentStaff> findByUser(User user);
    Optional<DepartmentStaff> findByUserId(Long userId);
}
