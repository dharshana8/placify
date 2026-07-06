package com.placify.repository;

import com.placify.model.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
    
    List<LearningResource> findByResourceType(LearningResource.ResourceType resourceType);
    
    List<LearningResource> findByDifficultyLevel(LearningResource.DifficultyLevel difficultyLevel);
    
    List<LearningResource> findByVerifiedTrue();
    
    @Query("SELECT lr FROM LearningResource lr WHERE :skill MEMBER OF lr.skillsCovered")
    List<LearningResource> findBySkill(@Param("skill") String skill);
    
    @Query("SELECT lr FROM LearningResource lr WHERE lr.resourceType = :type AND lr.difficultyLevel = :level")
    List<LearningResource> findByTypeAndLevel(
        @Param("type") LearningResource.ResourceType type,
        @Param("level") LearningResource.DifficultyLevel level
    );
    
    @Query("SELECT lr FROM LearningResource lr WHERE lr.verified = true ORDER BY lr.rating DESC")
    List<LearningResource> findTopRatedResources();
}
