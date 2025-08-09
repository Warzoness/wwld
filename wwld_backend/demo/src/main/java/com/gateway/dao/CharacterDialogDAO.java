package com.gateway.dao;

import com.gateway.dto.CharacterDialogDTO;
import com.gateway.entity.CharacterDialog;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface CharacterDialogDAO extends JpaRepository<CharacterDialog,Long> {

    // Find Dialog
    @Query("SELECT new com.gateway.dto.CharacterDialogDTO(" +
            "d.id, d.characterId,cha.name, d.storyId, d.content, d.image, d.type, d.orderIndex, d.voice,d.noNameCharacter) " +
            "FROM CharacterDialog d " +
            "LEFT JOIN GameCharacter cha ON cha.id = d.characterId " +
            "WHERE (:dialog_id IS NULL OR d.id = :dialog_id ) " +
            "AND (:story_id IS NULL OR d.storyId = :story_id) " +
            "ORDER BY d.orderIndex")
    List<CharacterDialogDTO> findDialog(@Param("dialog_id") Long storyId, @Param("story_id") Long characterId);

    // Find Dialog by ID
    @Query("SELECT new com.gateway.dto.CharacterDialogDTO(" +
            "d.id, d.characterId,cha.name, d.storyId, d.content," +
            " d.image, d.type, d.orderIndex, d.voice,d.noNameCharacter) " +
            "FROM CharacterDialog d " +
            "LEFT JOIN GameCharacter cha ON cha.id = d.characterId " +
            "WHERE d.id = :id")
    CharacterDialogDTO findDialogById(@Param("id") Long id);


    // Get order index max
    @Query("SELECT COALESCE(MAX(d.orderIndex), 0) FROM CharacterDialog d " +
            " WHERE d.storyId = :story_id")
    Integer getMaxOrderIndex(@Param("story_id") Long characterId);

    // update order index
    @Transactional
    @Modifying
    @Query("Update CharacterDialog d SET d.orderIndex = :orderIndex WHERE d.id = :id")
    void updateOrderIndex(@Param("id") Long id, @Param("orderIndex") Integer orderIndex );

}
