package com.placify.repository;

import com.placify.model.Department;
import com.placify.model.Student;
import com.placify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByUserId(Long userId);
    List<Student> findByDepartment(Department department);
    List<Student> findByDepartmentId(Long deptId);
    List<Student> findByIsPlaced(boolean isPlaced);

    @Query("SELECT s FROM Student s WHERE s.placementProbability < 40")
    List<Student> findRiskStudents();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.department.id = :deptId AND s.isPlaced = true")
    long countPlacedByDept(Long deptId);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.department.id = :deptId")
    long countByDept(Long deptId);
}
