package com.gateway.dao;

import com.gateway.dto.ConceptDTO;
import com.gateway.entity.Concept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConceptDAO extends JpaRepository<Concept, Long> {


    //    find all concept
    @Query("SELECT new com.gateway.dto.ConceptDTO(" +
            "c.id,c.title,c.slug,c.contentMd,c.conceptImage,c.description ) " +
            "FROM Concept c")
    List<ConceptDTO> getAllConcept();

//    find concepts

    @Query("SELECT new com.gateway.dto.ConceptDTO(" +
            "c.id,c.title,c.slug,c.contentMd,c.conceptImage,c.description ) " +
            "FROM Concept c " +
            " WHERE (c.title LIKE concat('%',:title,'%') OR :title = '' OR :title IS NULL)"
    )
    List<ConceptDTO> findConcepts(
            @Param("title") String title
    );

    // find concept by id
    @Query("SELECT new com.gateway.dto.ConceptDTO(" +
            "c.id,c.title,c.slug,c.contentMd,c.conceptImage,c.description ) " +
            "FROM Concept c " +
            " WHERE (c.id =: id)"
    )
    ConceptDTO findConceptById(
            @Param("id") Long id
    );

}
