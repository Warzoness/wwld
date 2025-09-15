package com.gateway.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter

public class CharacterDTO {
    private Long id;
    private String name;
    private String avatar;
    private String imgFull;
    private String birthday;
    private String sex;
    private String overview;
    private String history;
    private String organization;
    private Integer age;
    private String nation;
    private String otherInformation;
    private Float height;
    private String combatStyle;
    private Long mainQuestId;
    private Long sideQuestId;
    private Long eventQuestId;
    private Long areaId;
    private Long memeId;
    private String type;

    public CharacterDTO(Long id, String name, String avatar, String imgFull, String birthday, String sex, String overview,String history,String organization,Integer age,String nation,String otherInformation,Float height, String combatStyle, Long mainQuestId, Long sideQuestId, Long eventQuestId, Long areaId, Long memeId, String type) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.imgFull = imgFull;
        this.birthday = birthday;
        this.sex = sex;
        this.overview = overview;
        this.mainQuestId = mainQuestId;
        this.sideQuestId = sideQuestId;
        this.eventQuestId = eventQuestId;
        this.areaId = areaId;
        this.memeId = memeId;
        this.type = type;
        this.history = history;
        this.organization = organization;
        this.age = age;
        this.nation = nation;
        this.otherInformation = otherInformation;
        this.height = height;
        this.combatStyle = combatStyle;
    }


}
