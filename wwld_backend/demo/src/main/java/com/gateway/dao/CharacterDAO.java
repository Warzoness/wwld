package com.gateway.dao;

import com.gateway.dto.CharacterDTO;
import com.gateway.entity.GameCharacter;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CharacterDAO extends JpaRepository<GameCharacter, Long> {
    // Additional query methods can be defined here if needed

    // Find character
    @Query("SELECT new com.gateway.dto.CharacterDTO(" +
            "c.id, c.name, c.avatar, c.imgFull, c.birthday," +
            "c.sex, c.information, c.mainQuestId, c.sideQuestId, c.eventQuestId," +
            "c.areaId, c.memeId, c.type" +
            ") FROM GameCharacter c " +
            "WHERE ( c.id = :id OR :id IS NULL ) " +
            "AND (c.name LIKE concat('%',:name,'%') OR :name = '' OR :name IS NULL )" +
            " ")
    List<CharacterDTO> findCharacters(
            @Param("id") Long id,
            @Param("name") String name
    );

    @Query("SELECT new com.gateway.dto.CharacterDTO(" +
            "c.id, c.name, c.avatar, c.imgFull, c.birthday," +
            "c.sex, c.information, c.mainQuestId, c.sideQuestId, c.eventQuestId," +
            "c.areaId, c.memeId, c.type" +
            ") FROM GameCharacter c " +
            "WHERE ( c.id = :id OR :id IS NULL ) " +
                " ")
    CharacterDTO findOneById(
            @Param("id") Long id
    );

}
