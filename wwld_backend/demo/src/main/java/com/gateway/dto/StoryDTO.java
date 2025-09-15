package com.gateway.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter

public class StoryDTO {
    private Long id;
    private String title;
    private Integer type;
    private Integer active;
    private Long mainSectionId;
    private Long areaId;
    private Long parentId;
    private String parentTitle;
    private Date timeStarted;
    private Date timeEnded;
    private String description;
    private String image;

    public StoryDTO(Long id, String title, Integer type, Integer active,
                    Long mainSectionId, Long areaId,
                    Long parentId,String parentTitle, Date timeStarted, Date timeEnded,String description,String image) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.active = active;
        this.mainSectionId = mainSectionId;
        this.areaId = areaId;
        this.parentId = parentId;
        this.parentTitle = parentTitle;
        this.timeStarted = timeStarted;
        this.timeEnded = timeEnded;
        this.description = description;
        this.image = image;
    }
}
