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
    private Date birthday;
    private String sex;
    private String information;
    private Long mainQuestId;
    private Long sideQuestId;
    private Long eventQuestId;
    private Long areaId;
    private Long memeId;
    private String type;

    public CharacterDTO(Long id, String name, String avatar, String imgFull, Date birthday, String sex, String information, Long mainQuestId, Long sideQuestId, Long eventQuestId, Long areaId, Long memeId, String type) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.imgFull = imgFull;
        this.birthday = birthday;
        this.sex = sex;
        this.information = information;
        this.mainQuestId = mainQuestId;
        this.sideQuestId = sideQuestId;
        this.eventQuestId = eventQuestId;
        this.areaId = areaId;
        this.memeId = memeId;
        this.type = type;
    }


}
