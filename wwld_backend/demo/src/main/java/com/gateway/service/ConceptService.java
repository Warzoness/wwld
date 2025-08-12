package com.gateway.service;


import com.gateway.bussiness.businessImpl.ConceptBusinessImpl;
import com.gateway.dto.ConceptDTO;
import com.gateway.entity.Concept;
import com.gateway.request.ConceptRequest;
import com.gateway.response.ApiResult;
import com.gateway.response.ConceptResponse.ConceptResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/concept")
public class ConceptService extends BaseFuntion{
    private static final Logger LOGGER = LoggerFactory.getLogger(ConceptService.class);

    @Autowired
    ConceptBusinessImpl conceptBusinessImpl;

    @RequestMapping(value = "findConcepts",method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<ConceptResponse> findConcepts(@RequestBody ConceptRequest request){
        ConceptResponse response = new ConceptResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                List<ConceptDTO> concepts = conceptBusinessImpl.findConcepts(request);
                response.setListConcepts(concepts);
            }
        } catch (Exception e) {
            LOGGER.error("Error while getting concepts ", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "insert", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<ConceptResponse> insert(@RequestBody ConceptRequest request) {
        ConceptResponse response = new ConceptResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                Concept concept = conceptBusinessImpl.createConcept(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while inserting concept", e);
        }
        return ResponseEntity.ok(response);
    };

    @RequestMapping(value = "update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<ConceptResponse> update(@RequestBody ConceptRequest request) {
        ConceptResponse response = new ConceptResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                Concept concept = conceptBusinessImpl.updateConcept(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while updating concept", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "delete", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<ConceptResponse> delete(@RequestBody ConceptRequest request) {
        ConceptResponse response = new ConceptResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                conceptBusinessImpl.deleteConcept(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while deleting concept", e);
        }
        return ResponseEntity.ok(response);
    };


}
