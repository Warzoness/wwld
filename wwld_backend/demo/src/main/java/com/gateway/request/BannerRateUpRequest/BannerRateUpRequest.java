package com.gateway.request.BannerRateUpRequest;

import com.gateway.entity.BannerType;
import com.gateway.request.BaseRequest;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BannerRateUpRequest extends BaseRequest {
    private Long id;
    private String bannerName;
    private BannerType bannerType; // CHARACTER hoặc WEAPON
    private String startAt;
    private String endAt;
    private Long rateup5starId;     // FK đến Character/Item
    private String rateup4starIds;  // "10,11,12"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
