package com.placify.repository;

import com.placify.model.TrainingProgram;
import com.placify.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
    List<TrainingProgram> findByDepartment(Department department);
    List<TrainingProgram> findByDepartmentOrderByStartDateDesc(Department department);
}
