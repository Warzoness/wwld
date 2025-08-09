package com.gateway.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class MainSectionDTO {
    private Long id;
    private String name;
    private String icon;
    private String image;
    private String description;
//    private int active;
    private Integer orderIndex;
    private String type;

    public MainSectionDTO(Long id, String name, String icon, String image, String description,Integer orderIndex, String type) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.image = image;
        this.description = description;
//        this.active = active;
        this.orderIndex = orderIndex;
        this.type = type;
    }

    // Getters and setters
}