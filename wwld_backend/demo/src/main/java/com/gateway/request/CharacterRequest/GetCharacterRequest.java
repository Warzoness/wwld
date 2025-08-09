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
    private Date birthday;
    private String sex;
    private String information;
    private Long mainQuestId;
    private Long sideQuestId;
    private Long eventQuestId;
    private Long areaId;
    private Long memeId;
    private String type;
}
