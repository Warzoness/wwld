package com.gateway.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class NoteDataDTO {
    private Long id;
    private String noteName;
    private String noteContent;
    private Long storyId;
    private String description;
    private String image;

    public NoteDataDTO(Long id, String noteName, String noteContent, Long storyId,String description, String image) {
        this.id = id;
        this.noteName = noteName;
        this.noteContent = noteContent;
        this.storyId = storyId;
        this.description = description;
        this.image = image;
    }
}
