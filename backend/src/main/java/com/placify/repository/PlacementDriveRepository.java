package com.placify.repository;

import com.placify.model.PlacementDrive;
import com.placify.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {
    List<PlacementDrive> findByDepartment(Department department);
    List<PlacementDrive> findByDepartmentOrderByDriveDateDesc(Department department);
}
