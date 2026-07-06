package com.placify.repository;

import com.placify.model.ResumeOptimization;
import com.placify.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeOptimizationRepository extends JpaRepository<ResumeOptimization, Long> {
    
    List<ResumeOptimization> findByStudentOrderByCreatedAtDesc(Student student);
    
    Optional<ResumeOptimization> findTopByStudentOrderByCreatedAtDesc(Student student);
    
    long countByStudent(Student student);
}
