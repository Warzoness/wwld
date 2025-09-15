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
    private String characterType;
    private Long characterRank;
    private Boolean isLimited;

    public CharacterDTO(Long id, String name, String avatar, String imgFull, String birthday, String sex, String overview,String history,String organization,Integer age,String nation,String otherInformation,Float height, String combatStyle,  String characterType,Long characterRank,Boolean isLimited) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.imgFull = imgFull;
        this.birthday = birthday;
        this.sex = sex;
        this.overview = overview;
        this.characterType = characterType;
        this.characterRank = characterRank;
        this.history = history;
        this.organization = organization;
        this.age = age;
        this.nation = nation;
        this.otherInformation = otherInformation;
        this.height = height;
        this.combatStyle = combatStyle;
        this.isLimited = isLimited;
    }


}
