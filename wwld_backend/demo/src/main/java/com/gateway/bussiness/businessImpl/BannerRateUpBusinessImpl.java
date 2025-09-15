package com.gateway.bussiness.businessImpl;


import com.gateway.bussiness.BannerRateUpBusiness;
import com.gateway.dao.BannerRateUpDAO;
import com.gateway.dto.BannerRateUpDTO;
import com.gateway.entity.BannerRateUp;
import com.gateway.request.BannerRateUpRequest.BannerRateUpRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("bannerRateUpBusiness")
public class BannerRateUpBusinessImpl implements BannerRateUpBusiness {

    @Autowired
    BannerRateUpDAO bannerRateUpDAO;

    @Override
    public List<BannerRateUpDTO> findAllBanner() {
        return bannerRateUpDAO.findAllBanner();
    }

    @Override
    public BannerRateUpDTO findBannerById(BannerRateUpRequest request) throws Exception {
        BannerRateUpDTO bannerRateUpDTO = bannerRateUpDAO.findOneBannerById(request.getId());
        if (bannerRateUpDTO == null) {
            throw new Exception("BannerRateUp not found");
        }
        return bannerRateUpDTO;
    }

    @Override
    public BannerRateUp createBanner(BannerRateUpRequest request) throws Exception {
        BannerRateUp bannerRateUp = new BannerRateUp();
        if(request != null){
            setBannerRateUp(bannerRateUp, request);

            return bannerRateUpDAO.save(bannerRateUp);
        }else {
            throw new Exception("Error when creating banner");
        }
    }

    @Override
    public BannerRateUp updateBanner(BannerRateUpRequest request) throws Exception {
        BannerRateUpDTO bannerRateUpDTO = bannerRateUpDAO.findOneBannerById(request.getId());
        if(bannerRateUpDTO != null){
            BannerRateUp bannerRateUp = new BannerRateUp();
            setBannerRateUp(bannerRateUp, request);
            bannerRateUp.setId(bannerRateUpDTO.getId());

            bannerRateUpDAO.save(bannerRateUp);
            return bannerRateUp;
        }else {
            throw new Exception("Error when updating banner");
        }
    }

    @Override
    public void deleteBanner(BannerRateUpRequest request) throws Exception {
        BannerRateUpDTO bannerRateUpDTO = bannerRateUpDAO.findOneBannerById(request.getId());
        if(bannerRateUpDTO != null){
            BannerRateUp bannerRateUp = new BannerRateUp();
            setBannerRateUp(bannerRateUp, request);
            bannerRateUp.setId(bannerRateUpDTO.getId());

            bannerRateUpDAO.delete(bannerRateUp);
        }else{
            throw new Exception("Error when deleting banner");
        }
    }

    void setBannerRateUp(BannerRateUp bannerRateUp,BannerRateUpRequest request) throws Exception {
        bannerRateUp.setBannerName(request.getBannerName());
        bannerRateUp.setBannerType(request.getBannerType());
        bannerRateUp.setStartAt(request.getStartAt());
        bannerRateUp.setEndAt(request.getEndAt());
        bannerRateUp.setRateup5starId(request.getRateup5starId());
        bannerRateUp.setRateup4starIds(request.getRateup4starIds());
        bannerRateUp.setCreatedAt(request.getCreatedAt());
        bannerRateUp.setUpdatedAt(request.getUpdatedAt());
    }
}
