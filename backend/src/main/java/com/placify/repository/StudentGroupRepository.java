package com.placify.repository;

import com.placify.model.StudentGroup;
import com.placify.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentGroupRepository extends JpaRepository<StudentGroup, Long> {
    List<StudentGroup> findByDepartment(Department department);
}
