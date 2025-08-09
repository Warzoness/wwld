package com.gateway.service;


import com.gateway.bussiness.businessImpl.DialogBusinessImpl;
import com.gateway.dto.CharacterDialogDTO;
import com.gateway.request.DialogRequest.DialogRequest;
import com.gateway.response.ApiResult;
import com.gateway.response.DialogResponse.GetDialogResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dialog")
public class DialogService extends BaseFuntion {

    private static final Logger LOGGER = LoggerFactory.getLogger(StoryService.class);

    @Autowired
    private DialogBusinessImpl dialogBusinessImpl;


    @RequestMapping(value = "/getDialogs", produces = MediaType.APPLICATION_JSON_VALUE,method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<GetDialogResponse> getDialog(@RequestBody DialogRequest request) {
        GetDialogResponse response = new GetDialogResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                List<CharacterDialogDTO> dialogs = dialogBusinessImpl.findDialog(request);
                response.setListDialogs(dialogs);
            }
        } catch (Exception e) {
            LOGGER.error("Error while getting dialog", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/insert", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<GetDialogResponse> insert(@RequestBody DialogRequest request) {
        GetDialogResponse response = new GetDialogResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                dialogBusinessImpl.createDialog(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while inserting dialog", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<GetDialogResponse> update(@RequestBody DialogRequest request) {
        GetDialogResponse response = new GetDialogResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                dialogBusinessImpl.updateDialog(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while updating dialog", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/delete", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<GetDialogResponse> delete(@RequestBody DialogRequest request) {
        GetDialogResponse response = new GetDialogResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                dialogBusinessImpl.deleteDialog(request.getId());
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while deleting dialog", e);
        }
        return ResponseEntity.ok(response);
    }

    // Update order index
    @RequestMapping(value = "/updateOrderIndex", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<GetDialogResponse> updateOrderIndex(@RequestBody DialogRequest request) {
        GetDialogResponse response = new GetDialogResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                dialogBusinessImpl.updateOrderIndex(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while updating order index", e);
        }
        return ResponseEntity.ok(response);
    }
}
