package com.gateway.dao;

import com.gateway.dto.MainSectionDTO;
import com.gateway.entity.MainSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MainSectionDAO extends JpaRepository<MainSection, Long> {
    // findAll
    @Query("SELECT new com.gateway.dto.MainSectionDTO(" +
            "m.id, m.name, m.icon,m.image, m.description, m.orderIndex, m.type" +
            " ) FROM MainSection m")
    List<MainSectionDTO> getAllMainSections();

    // Find
    @Query("SELECT new com.gateway.dto.MainSectionDTO(" +
            "m.id, m.name, m.icon,m.image, m.description, m.orderIndex, m.type" +
            " ) FROM MainSection m " +
            "WHERE ( m.id = :section_id OR :section_id IS NULL ) " +
            "AND (m.name LIKE concat('%',:section_name,'%') OR :section_name = '' OR :section_name IS NULL )" +
            " ")
    List<MainSectionDTO> findMainSection(
            @Param("section_id") Long sectionId,
            @Param("section_name") String sectionName
    );


}
