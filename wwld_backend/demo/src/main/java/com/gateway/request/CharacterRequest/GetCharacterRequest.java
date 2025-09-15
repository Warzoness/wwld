package com.gateway.request.CharacterRequest;

import com.gateway.request.BaseRequest;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class GetCharacterRequest extends BaseRequest {
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
}
