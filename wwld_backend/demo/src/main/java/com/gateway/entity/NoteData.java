package com.gateway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="note_data")
@Getter
@Setter

public class NoteData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="note_name")
    private String noteName;

    @Column(name="note_content",columnDefinition = "TEXT")
    private String noteContent;

    @Column(name="story_id")
    private Long storyId;

    @Column(name="description")
    private String description;

    @Column(name="image")
    private String image;
}
