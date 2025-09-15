package com.gateway.bussiness;

import com.gateway.dto.CharacterDTO;
import com.gateway.entity.GameCharacter;
import com.gateway.request.CharacterRequest.GetCharacterRequest;

import java.util.List;


public interface CharacterBusiness {
    /**
     * Retrieves a list of characters based on the provided parameters.
     *
     * @return A list of CharacterDTO objects matching the search criteria.
     */
    List<CharacterDTO> getCharacters(GetCharacterRequest request);

    List<CharacterDTO> findCharactersByRankAndisLimited(GetCharacterRequest request);

    GameCharacter createCharacter(GetCharacterRequest request) throws Exception;

    GameCharacter updateCharacter(GetCharacterRequest request) throws Exception;

    void deleteCharacter(Long id) throws Exception;

    CharacterDTO getCharacterById(Long id) throws Exception;

}
