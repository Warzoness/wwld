package com.gateway.dto;

import com.gateway.entity.BannerType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BannerRateUpDTO {
    private Long id;
    private String bannerName;
    private BannerType bannerType; // CHARACTER hoặc WEAPON
    private String startAt;
    private String endAt;
    private Long rateup5starId;     // FK đến Character/Item
    private String rateup4starIds;  // "10,11,12"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BannerRateUpDTO(Long id, String bannerName, BannerType bannerType, String startAt, String endAt, Long rateup5starId, String rateup4starIds, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.bannerName = bannerName;
        this.bannerType = bannerType;
        this.startAt = startAt;
        this.endAt = endAt;
        this.rateup5starId = rateup5starId;
        this.rateup4starIds = rateup4starIds;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
