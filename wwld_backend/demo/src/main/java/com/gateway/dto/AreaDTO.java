package com.gateway.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class AreaDTO {
    private Long id;
    private String name;
    private String description;
    private String image;
    private String icon;

    public AreaDTO(Long id, String name, String description, String image, String icon) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.icon = icon;
    }
}
