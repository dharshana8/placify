package com.placify.repository;

import com.placify.model.StudentResourceProgress;
import com.placify.model.Student;
import com.placify.model.LearningResource;
import com.placify.model.LearningPathway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentResourceProgressRepository extends JpaRepository<StudentResourceProgress, Long> {
    
    List<StudentResourceProgress> findByStudent(Student student);
    
    List<StudentResourceProgress> findByStudentAndStatus(Student student, StudentResourceProgress.ProgressStatus status);
    
    List<StudentResourceProgress> findByPathway(LearningPathway pathway);
    
    Optional<StudentResourceProgress> findByStudentAndResourceAndPathway(
        Student student, 
        LearningResource resource, 
        LearningPathway pathway
    );
    
    @Query("SELECT AVG(srp.completionPercentage) FROM StudentResourceProgress srp WHERE srp.student = :student")
    Double getAverageCompletionPercentage(@Param("student") Student student);
    
    long countByStudentAndStatus(Student student, StudentResourceProgress.ProgressStatus status);
}
