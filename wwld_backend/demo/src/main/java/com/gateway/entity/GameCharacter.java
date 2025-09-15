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

    @Column(name="character_type")
    private String characterType;

    @Column(name="character_rank")
    private Long characterRank;

    @Column(name="is_limited")
    private Boolean isLimited;
}
