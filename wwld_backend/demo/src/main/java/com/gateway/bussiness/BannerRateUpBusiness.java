package com.gateway.bussiness;

import com.gateway.dto.BannerRateUpDTO;
import com.gateway.entity.BannerRateUp;
import com.gateway.request.BannerRateUpRequest.BannerRateUpRequest;

import java.util.List;

public interface BannerRateUpBusiness {
    List<BannerRateUpDTO> findAllBanner();
    BannerRateUpDTO findBannerById(BannerRateUpRequest request) throws Exception;
    BannerRateUp createBanner(BannerRateUpRequest request) throws Exception;
    BannerRateUp updateBanner(BannerRateUpRequest request) throws Exception;
    void deleteBanner(BannerRateUpRequest request) throws Exception;
}
