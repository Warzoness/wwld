package com.gateway.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class ConceptDTO {
    private Long id;
    private String title;
    private String slug;
    private String contentMd;
    private String conceptImage;
    private String description;

    public ConceptDTO(Long id, String title, String slug, String contentMd, String conceptImage, String description) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.contentMd = contentMd;
        this.conceptImage = conceptImage;
        this.description = description;
    }
}
