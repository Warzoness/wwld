package com.gateway.dao;

import com.gateway.dto.BannerRateUpDTO;
import com.gateway.entity.BannerRateUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BannerRateUpDAO extends JpaRepository<BannerRateUp, Long> {

    // Find banner
    @Query("SELECT new com.gateway.dto.BannerRateUpDTO(" +
            "b.id, b.bannerName,b.bannerType, b.startAt, b.endAt, b.rateup5starId, b.rateup4starIds, b.createdAt, " +
            "b.updatedAt) FROM BannerRateUp b ")
    List<BannerRateUpDTO> findAllBanner();

    @Query("SELECT new com.gateway.dto.BannerRateUpDTO(" +
            "b.id, b.bannerName,b.bannerType, b.startAt, b.endAt, b.rateup5starId, b.rateup4starIds, b.createdAt, " +
            "b.updatedAt) FROM BannerRateUp b WHERE (b.id =:id OR :id IS NULL)")
    BannerRateUpDTO findOneBannerById(@Param("id") Long id);
}
