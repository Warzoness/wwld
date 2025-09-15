package com.gateway.mapper;


import com.gateway.dto.CharacterDTO;
import com.gateway.entity.GameCharacter;
import com.gateway.request.CharacterRequest.GetCharacterRequest;
import org.mapstruct.*;


@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface CharacterMapper {


    CharacterDTO toDto(GameCharacter entity);


    GameCharacter toEntity(GetCharacterRequest req);


    // Update into existing entity (only non-null from req will override)
    void updateEntityFromRequest(GetCharacterRequest req, @MappingTarget GameCharacter entity);
}