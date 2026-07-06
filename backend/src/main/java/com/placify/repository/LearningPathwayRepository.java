package com.placify.repository;

import com.placify.model.LearningPathway;
import com.placify.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPathwayRepository extends JpaRepository<LearningPathway, Long> {
    
    List<LearningPathway> findByStudentOrderByCreatedAtDesc(Student student);
    
    Optional<LearningPathway> findTopByStudentAndStatusOrderByCreatedAtDesc(Student student, String status);
    
    List<LearningPathway> findByStatus(String status);
    
    long countByStudent(Student student);
}
