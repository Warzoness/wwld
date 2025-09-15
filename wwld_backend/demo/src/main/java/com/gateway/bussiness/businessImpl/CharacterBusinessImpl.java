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
    public List<CharacterDTO> findCharactersByRankAndisLimited(GetCharacterRequest request) {
        return characterDAO.findCharactersByRankAndisLimited(request.getId(), request.getName(), request.getCharacterRank(), request.getIsLimited());
    }

    @Override
    public GameCharacter createCharacter(GetCharacterRequest request) throws Exception {
        try {
            GameCharacter character = new GameCharacter();
            setCharacter(request, character);
            return characterDAO.save(character);
        } catch (Exception e) {
            throw new Exception();
        }
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

    @Override
    public CharacterDTO getCharacterById(Long id) throws Exception {
        CharacterDTO characterDTO = characterDAO.findOneById(id);
        if (characterDTO != null) {
            return characterDTO;
        } else {
            throw new Exception("Character not found");
        }
    }

    private void setCharacter(GetCharacterRequest request, GameCharacter character) {
        character.setName(request.getName());
        character.setAvatar(request.getAvatar());
        character.setImgFull(request.getImgFull());
        character.setBirthday(request.getBirthday());
        character.setSex(request.getSex());
        character.setOverview(request.getOverview());
        character.setHistory(request.getHistory());
        character.setOrganization(request.getOrganization());
        character.setAge(request.getAge());
        character.setNation(request.getNation());
        character.setOtherInformation(request.getOtherInformation());
        character.setHeight(request.getHeight());
        character.setCombatStyle(request.getCombatStyle());
        character.setCharacterType(request.getCharacterType());
        character.setCharacterRank(request.getCharacterRank());
        character.setIsLimited(request.getIsLimited());
    }
}
