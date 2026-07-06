package com.placify.repository;

import com.placify.model.Application;
import com.placify.model.Job;
import com.placify.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(Student student);
    List<Application> findByJob(Job job);
    List<Application> findByJobId(Long jobId);
    Optional<Application> findByStudentAndJob(Student student, Job job);
    boolean existsByStudentAndJob(Student student, Job job);

    @Query("SELECT a FROM Application a WHERE a.job.company.id = :companyId")
    List<Application> findByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = 'SELECTED'")
    long countPlacements();

    @Query("SELECT a FROM Application a WHERE a.status = 'SELECTED'")
    List<Application> findAllPlacements();

    @Query("SELECT a FROM Application a WHERE a.job.company.id = :companyId AND a.job.id = :jobId ORDER BY a.aiScore DESC")
    List<Application> findByCompanyAndJobRanked(@Param("companyId") Long companyId, @Param("jobId") Long jobId);
}
