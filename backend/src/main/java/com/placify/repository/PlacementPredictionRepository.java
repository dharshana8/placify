package com.placify.repository;

import com.placify.model.PlacementPrediction;
import com.placify.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementPredictionRepository extends JpaRepository<PlacementPrediction, Long> {
    
    List<PlacementPrediction> findByStudentOrderByPredictedAtDesc(Student student);
    
    Optional<PlacementPrediction> findTopByStudentOrderByPredictedAtDesc(Student student);
    
    long countByStudent(Student student);
}
