package com.placify.repository;

import com.placify.model.Company;
import com.placify.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompany(Company company);
    List<Job> findByCompanyId(Long companyId);
    List<Job> findByStatus(Job.JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND " +
           "(:role IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :role, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Job> findActiveJobsWithFilters(@Param("role") String role, @Param("location") String location);
    
    // Simpler method to get all active jobs
    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE'")
    List<Job> findAllActiveJobs();
}
