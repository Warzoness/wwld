package com.gateway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name="game_character")
@Getter
@Setter

public class GameCharacter {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="name")
    private String name;

    @Column(name="avatar")
    private String avatar;

    @Column(name="imgFull")
    private String imgFull;

    @Column(name="birthday")
    private Date birthday;

    @Column(name="sex")
    private String sex;

    @Column(name="information")
    private String information;

    @Column(name="mainQuestId")
    private Long mainQuestId;

    @Column(name="sideQuestId")
    private Long sideQuestId;

    @Column(name="eventQuestId")
    private Long eventQuestId;

    @Column(name="areaId")
    private Long areaId;

    @Column(name="memeId")
    private Long memeId;

    @Column(name="type")
    private String type;
}
