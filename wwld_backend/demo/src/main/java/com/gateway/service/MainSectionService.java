package com.gateway.service;


import com.gateway.bussiness.MainSectionBusiness;
import com.gateway.dto.MainSectionDTO;
import com.gateway.entity.MainSection;
import com.gateway.request.MainSection.MainSectionRequest;
import com.gateway.response.ApiResult;
import com.gateway.response.MainSectionResponse.GetMainSectionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mainSections")
public class MainSectionService extends BaseFuntion {
    private static final Logger LOGGER = LoggerFactory.getLogger(MainSectionService.class);

    @Autowired
    private MainSectionBusiness mainSectionBusinessImpl;

    @RequestMapping(value = "/getMainSections", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GetMainSectionResponse> searchStories(@RequestBody MainSectionRequest request) {
        GetMainSectionResponse response = new GetMainSectionResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                List<MainSectionDTO> mainSections = mainSectionBusinessImpl.findMainSection(request);
                response.setMainSections(mainSections);
            }
        } catch (Exception e) {
            LOGGER.error("Error while searching main sections", e);
        }
        return ResponseEntity.ok(response);
    }

    ;

    @RequestMapping(value = "insert", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GetMainSectionResponse> insert(@RequestBody MainSectionRequest request) {
        GetMainSectionResponse response = new GetMainSectionResponse();
        response.setBaseResponse(getBase(request));
        System.out.println("Request to insert main section: " + request.getImage());
        try {
            if (response.getResult().isOk()) {
                MainSection mainSection = mainSectionBusinessImpl.createMainSection(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while inserting main section", e);
        }
        return ResponseEntity.ok(response);
    }

    ;

    @RequestMapping(value = "update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GetMainSectionResponse> update(@RequestBody MainSectionRequest request) {
        GetMainSectionResponse response = new GetMainSectionResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                MainSection mainSection = mainSectionBusinessImpl.updateMainSection(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while updating main section", e);
        }
        return ResponseEntity.ok(response);
    }

    ;

    @RequestMapping(value = "delete", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GetMainSectionResponse> delete(@RequestBody MainSectionRequest request) {
        GetMainSectionResponse response = new GetMainSectionResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                MainSectionDTO mainSectionDTO = mainSectionBusinessImpl.deleteMainSection(request.getId());
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while deleting main section", e);
        }
        return ResponseEntity.ok(response);
    }

    ;

    @PostMapping("/testAll")
    public ResponseEntity<List<MainSectionDTO>> testAll() {
        return ResponseEntity.ok(mainSectionBusinessImpl.getAllMainSections());
    }


}
