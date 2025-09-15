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
    private Long id; // id nhân vật

    @Column(name="name")
    private String name; // Tên nhân vật

    @Column(name="avatar")
    private String avatar; // avatar nhân vật

    @Column(name="imgFull")
    private String imgFull; // ảnh hồ sơ đầy đủ

    @Column(name="birthday")
    private String birthday; // Ngày sinh

    @Column(name="sex")
    private String sex; // Giới tính

    @Column(name="overview",columnDefinition = "TEXT")
    private String overview; // Tổng quan

    @Column(name="history",columnDefinition = "MEDIUMTEXT")  // Tiểu sử
    private String history;

    @Column(name="organization")
    private String organization; // Tổ chức hoạt động

    @Column(name="age")
    private Integer age; // Tuổi

    @Column(name="nation")
    private String nation;

    @Column(name="other_infomation")
    private String otherInformation;

    @Column(name="height")
    private Float height;

    @Column(name="combat_style")
    private String combatStyle;

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
