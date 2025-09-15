package com.gateway.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class CharacterDialogDTO {
    private Long id;
    private Long characterId;
    private String characterName;
    private Long storyId;
    private String content;
    private String image;
    private Integer type;
    private Integer orderIndex;
    private String voice;
    private String noNameCharacter;
    private Long parentId;

    public CharacterDialogDTO(Long id, Long characterId,String characterName, Long storyId, String content,String image, Integer type, Integer orderIndex, String voice,String noNameCharacter, Long parentId) {
        this.id = id;
        this.characterId = characterId;
        this.characterName = characterName;
        this.storyId = storyId;
        this.content = content;
        this.type = type;
        this.orderIndex = orderIndex;
        this.voice = voice;
        this.image = image;
        this.noNameCharacter = noNameCharacter;
        this.parentId = parentId;
    }

}
