package com.gateway.request.StoryRequest;

import com.gateway.request.BaseRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter

public class StoryRequest extends BaseRequest {
    private Long id;
    private String title;
    private Integer type;
    private Integer active;
    private Long mainSectionId;
    private Long areaId;
    private Long parentId;
    private Date timeStarted;
    private Date timeEnded;
    private String description;
    private String image;

}
