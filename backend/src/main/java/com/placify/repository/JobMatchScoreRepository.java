package com.placify.repository;

import com.placify.model.JobMatchScore;
import com.placify.model.Student;
import com.placify.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobMatchScoreRepository extends JpaRepository<JobMatchScore, Long> {
    
    List<JobMatchScore> findByStudentOrderByMatchScoreDesc(Student student);
    
    List<JobMatchScore> findByJobOrderByMatchScoreDesc(Job job);
    
    Optional<JobMatchScore> findByStudentAndJob(Student student, Job job);
    
    @Query("SELECT jms FROM JobMatchScore jms WHERE jms.student = :student AND jms.matchScore >= :minScore ORDER BY jms.matchScore DESC")
    List<JobMatchScore> findHighMatchingJobs(
        @Param("student") Student student, 
        @Param("minScore") Double minScore
    );
    
    @Query("SELECT jms FROM JobMatchScore jms WHERE jms.job = :job AND jms.matchScore >= :minScore ORDER BY jms.matchScore DESC")
    List<JobMatchScore> findTopCandidatesForJob(
        @Param("job") Job job, 
        @Param("minScore") Double minScore
    );
}
