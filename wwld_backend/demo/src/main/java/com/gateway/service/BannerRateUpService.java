package com.gateway.service;


import com.gateway.bussiness.BannerRateUpBusiness;
import com.gateway.request.BannerRateUpRequest.BannerRateUpRequest;
import com.gateway.response.ApiResult;
import com.gateway.response.BannerRateUpResponse.BannerRateUpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bannerRateUp")
public class BannerRateUpService extends BaseFuntion{

    private static final Logger LOGGER = LoggerFactory.getLogger(BannerRateUpService.class);
    
    @Autowired
    private BannerRateUpBusiness bannerRateUpBusiness;

    @RequestMapping(value = "/getBanners", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<BannerRateUpResponse> getBanners(@RequestBody BannerRateUpRequest request) {
        BannerRateUpResponse response = new BannerRateUpResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                response.setBannerRateUpDTOS(bannerRateUpBusiness.findAllBanner());
            }else{
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while getting banners", e);
        };

        return new ResponseEntity<>(response, HttpStatus.OK);
    };

    @RequestMapping(value = "/insert", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<BannerRateUpResponse> insert(@RequestBody BannerRateUpRequest request) {
        BannerRateUpResponse response = new BannerRateUpResponse();
        response.setBaseResponse(getBase(request));
        System.out.println("request : " + request.toString());
        try {
            if (response.getResult().isOk()) {
                bannerRateUpBusiness.createBanner(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while inserting character", e);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // update character
    @RequestMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<BannerRateUpResponse> update(@RequestBody BannerRateUpRequest request) {
        BannerRateUpResponse response = new BannerRateUpResponse();
        response.setBaseResponse(getBase(request));
        LOGGER.info("request : " + request.toString());
        try {
            if (response.getResult().isOk()) {
                bannerRateUpBusiness.updateBanner(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while updating character", e);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // delete character
    @RequestMapping(value = "/delete", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<BannerRateUpResponse> delete(@RequestBody BannerRateUpRequest request) {
        BannerRateUpResponse response = new BannerRateUpResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                bannerRateUpBusiness.deleteBanner(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while deleting character", e);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Get one character
    @RequestMapping(value = "/getBannerById", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<BannerRateUpResponse> getOneBanner(@RequestBody BannerRateUpRequest request) {
        BannerRateUpResponse response = new BannerRateUpResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                response.setBannerRateUpDTO(bannerRateUpBusiness.findBannerById(request));
            }else{
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while getting banners", e);
        };

        return new ResponseEntity<>(response, HttpStatus.OK);
    };
}
