package com.gateway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter

@Entity
@Table(name = "banner_rateup")
public class BannerRateUp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bannerName;

    @Enumerated(EnumType.STRING)
    private BannerType bannerType; // CHARACTER hoặc WEAPON

    private String startAt;
    private String endAt;

    private Long rateup5starId;     // FK đến Character/Item

    @Column(length = 255)
    private String rateup4starIds;  // "10,11,12"

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

