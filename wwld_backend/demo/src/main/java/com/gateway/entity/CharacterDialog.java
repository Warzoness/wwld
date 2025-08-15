package com.gateway.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="dialog")
@Getter
@Setter

public class CharacterDialog {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="characterId")
    private Long characterId;

    @Column(name="storyId")
    private Long storyId;

    @Column(name="content",columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name="image",columnDefinition = "MEDIUMTEXT")
    private String image;

    // type = 0 : image (characterId : null), type = 1 : text (characterId : not null), type = 2 : text ( main character)
    @Column(name="type")
    private Integer type;

    @Column(name="order_index")
    private Integer orderIndex;

    @Column(name="voice")
    private String voice;

    @Column(name="noNameCharacter")
    private String noNameCharacter;

    @Column(name="parentId")
    private Long parentId;
}
