package com.gateway.request.DialogRequest;

import com.gateway.request.BaseRequest;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString


public class DialogRequest extends BaseRequest {
    private Long id;
    private Long characterId;
    private Long storyId;
    private String content;
    private String image;
    private Integer type;
    private Integer orderIndex;
    private String voice;
    private String noNameCharacter;
}
