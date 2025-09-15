package com.gateway.dao;

import com.gateway.dto.StoryDTO;
import com.gateway.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoryDAO extends JpaRepository<Story, Long> {
    // findAll
    @Query("SELECT distinct new com.gateway.dto.StoryDTO(s.id, s.title,s.type,s.active,s.mainSectionId," +
            " s.areaId,s.parentId,sp.title,s.timeStarted,s.timeEnded,s.description,s.image)" +
            " FROM Story s   LEFT JOIN Story sp ON sp.id = s.parentId ")
    List<StoryDTO> getAllStories();

    //find
    @Query("SELECT distinct new com.gateway.dto.StoryDTO(s.id, s.title, s.type, s.active," +
            " s.mainSectionId, s.areaId, s.parentId,sp.title, s.timeStarted, s.timeEnded,s.description,s.image) " +
            "FROM Story s " +
            "LEFT JOIN Story sp ON sp.id = s.parentId " +
            " WHERE (s.id = :id OR :id IS NULL) " +
            " AND (s.mainSectionId = :mainSectionId OR :mainSectionId IS NULL ) " +
            " AND (s.parentId =:parentId OR :parentId IS NULL ) " +
            " AND (s.areaId =:areaId OR :areaId IS NULL ) " +
            " AND (s.type =:type OR :type IS NULL ) " +
            " AND (s.title LIKE concat('%', :title, '%') OR :title = '' OR :title IS NULL)")
    List<StoryDTO> findStory(
            @Param("id") Long id,
            @Param("title") String storyTitle,
            @Param("mainSectionId") Long mainSectionId,
            @Param("parentId") Long parentId,
            @Param("areaId") Long areaId,
            @Param("type") Integer type
    );

    @Query("SELECT new com.gateway.dto.StoryDTO(s.id, s.title, s.type, s.active, " +
            "s.mainSectionId, s.areaId, s.parentId, sp.title, s.timeStarted, s.timeEnded, s.description,s.image) " +
            "FROM Story s " +
            "LEFT JOIN Story sp ON sp.id = s.parentId " +
            "WHERE s.id = :id")
    StoryDTO findOneById(@Param("id") Long id);


}
