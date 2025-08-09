package com.gateway.bussiness.businessImpl;

import com.gateway.bussiness.CharacterBusiness;
import com.gateway.dao.CharacterDAO;
import com.gateway.dto.CharacterDTO;
import com.gateway.entity.GameCharacter;
import com.gateway.request.CharacterRequest.GetCharacterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service(value = "characterBusiness")
public class CharacterBusinessImpl implements CharacterBusiness {
    @Autowired
    private CharacterDAO characterDAO;

    @Override
    public List<CharacterDTO> getCharacters(GetCharacterRequest request) {
        return characterDAO.findCharacters(request.getId(), request.getName());
    }

    @Override
    public GameCharacter createCharacter(GetCharacterRequest request) throws Exception {
        if (request.getId() == null) {
            throw new IllegalArgumentException("Character ID and Story ID must not be null");
        }
        GameCharacter character = new GameCharacter();
        setCharacter(request, character);
        return characterDAO.save(character);

    }

    @Override
    public GameCharacter updateCharacter(GetCharacterRequest request) throws Exception {
        CharacterDTO characterDTO = characterDAO.findOneById(request.getId());
        if (characterDTO != null) {
            GameCharacter character = new GameCharacter();
            character.setId(characterDTO.getId());
            setCharacter(request, character);
            return characterDAO.save(character);
        } else {
            throw new Exception("Character not found");
        }
    }

    @Override
    public void deleteCharacter(Long id) throws Exception {
        CharacterDTO characterDTO = characterDAO.findOneById(id);
        if (characterDTO != null) {
            characterDAO.deleteById(id);
        } else {
            throw new Exception("Character not found");
        }
    }

    private void setCharacter(GetCharacterRequest request, GameCharacter character) {
        character.setId(request.getId());
        character.setName(request.getName());
        character.setAvatar(request.getAvatar());
        character.setImgFull(request.getImgFull());
        character.setBirthday(request.getBirthday());
        character.setSex(request.getSex());
        character.setInformation(request.getInformation());
        character.setMainQuestId(request.getMainQuestId());
        character.setSideQuestId(request.getSideQuestId());
        character.setEventQuestId(request.getEventQuestId());
        character.setAreaId(request.getAreaId());
        character.setMemeId(request.getMemeId());
        character.setType(request.getType());
    }
}
