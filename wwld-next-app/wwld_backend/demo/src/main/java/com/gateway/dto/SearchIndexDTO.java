package com.gateway.dto;

import com.gateway.entity.SearchEntityType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchIndexDTO {
    private Long id;
    private SearchEntityType entityType;
    private String display;
    private String slug;

    SearchIndexDTO(Long id,SearchEntityType entityType, String display, String slug) {
        this.id = id;
        this.entityType = entityType;
        this.display = display;
        this.slug = slug;
    }
}
