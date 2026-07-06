package com.placify.repository;

import com.placify.model.Quiz;
import com.placify.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByDepartmentAndStatus(Department department, Quiz.Status status);
    List<Quiz> findByDepartmentOrderByCreatedAtDesc(Department department);
}
