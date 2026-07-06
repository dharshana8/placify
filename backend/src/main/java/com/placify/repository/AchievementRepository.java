package com.placify.repository;

import com.placify.model.Achievement;
import com.placify.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    
    List<Achievement> findByStudentOrderBySubmittedAtDesc(Student student);
    
    List<Achievement> findByStatusOrderBySubmittedAtDesc(String status);
    
    @Query("SELECT a FROM Achievement a WHERE a.student.department = :department ORDER BY a.submittedAt DESC")
    List<Achievement> findByDepartment(@Param("department") String department);
    
    @Query("SELECT a FROM Achievement a WHERE a.student.department = :department AND a.status = :status ORDER BY a.submittedAt DESC")
    List<Achievement> findByDepartmentAndStatus(@Param("department") String department, @Param("status") String status);
    
    long countByStudentAndStatus(Student student, String status);
}
