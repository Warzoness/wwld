package com.gateway.dao;

import com.gateway.dto.AreaDTO;
import com.gateway.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AreaDAO extends JpaRepository<Area, Long> {
    // findAll
    @Query("SELECT a FROM Area a WHERE a.active = true")
    List<AreaDTO> findAllAreas();

    // Find
    @Query("SELECT new com.gateway.dto.AreaDTO(" +
            "a.id, a.name, a.description, a.image, a.icon" +
            ") FROM Area a " +
            "WHERE ( a.id = :area_id OR :area_id IS NULL ) " +
            "AND (a.name LIKE concat('%',:area_name,'%') OR :area_name = '' OR :area_name IS NULL )" +
            "AND a.active = true")
    List<AreaDTO> findArea(
            @Param("area_id") Long areaId,
            @Param("area_name") String areaName
    );


}
