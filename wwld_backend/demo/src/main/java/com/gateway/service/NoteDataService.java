package com.gateway.service;


import com.gateway.bussiness.NoteDataBusiness;
import com.gateway.dto.ConceptDTO;
import com.gateway.dto.NoteDataDTO;
import com.gateway.entity.Concept;
import com.gateway.entity.NoteData;
import com.gateway.request.ConceptRequest;
import com.gateway.request.NoteDataRequest.NoteDataRequest;
import com.gateway.response.ApiResult;
import com.gateway.response.ConceptResponse.ConceptResponse;
import com.gateway.response.NoteDataReponse.NoteDataReponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/noteData")
@RestController

public class NoteDataService extends BaseFuntion {
    private static final Logger LOGGER = LoggerFactory.getLogger(NoteDataService.class);

    @Autowired
    NoteDataBusiness noteDataBusiness;

    @RequestMapping(value = "/listNoteDatas",method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<NoteDataReponse> findAllNoteData(@RequestBody NoteDataRequest noteDataRequest){
        NoteDataReponse response = new NoteDataReponse();
        response.setBaseResponse(getBase(noteDataRequest));
        try {
            if (response.getResult().isOk()) {
                List<NoteDataDTO> noteDataDTOS = noteDataBusiness.findAllNoteData();
                response.setListNoteData(noteDataDTOS);
            }
        } catch (Exception e) {
            LOGGER.error("Error while getting note data ", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "getOneById",method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<NoteDataReponse> getOneById(@RequestBody NoteDataRequest request){
        NoteDataReponse response = new NoteDataReponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                NoteDataDTO noteDataDTO = noteDataBusiness.findOneNoteData(request);
                response.setNoteDataDTO(noteDataDTO);
            }
        } catch (Exception e) {
            LOGGER.error("Error while getting note data ", e);
        }
        return ResponseEntity.ok(response);
    }
    @RequestMapping(value = "insert", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<NoteDataReponse> insert(@RequestBody NoteDataRequest request) {
        NoteDataReponse response = new NoteDataReponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                NoteData noteData = noteDataBusiness.create(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while inserting note data", e);
        }
        return ResponseEntity.ok(response);
    };

    @RequestMapping(value = "update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<NoteDataReponse> update(@RequestBody NoteDataRequest request) {
        NoteDataReponse response = new NoteDataReponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                NoteData noteData = noteDataBusiness.update(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while updating note data", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "delete", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<NoteDataReponse> delete(@RequestBody NoteDataRequest request) {
        NoteDataReponse response = new NoteDataReponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                noteDataBusiness.delete(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while deleting note data", e);
        }
        return ResponseEntity.ok(response);
    };


}
