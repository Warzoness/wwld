package com.gateway.response.BannerRateUpResponse;

import com.gateway.dto.BannerRateUpDTO;
import com.gateway.response.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class BannerRateUpResponse extends BaseResponse {
    List<BannerRateUpDTO> bannerRateUpDTOS;
    BannerRateUpDTO bannerRateUpDTO;
}
