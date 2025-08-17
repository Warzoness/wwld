package com.gateway.service;


import com.gateway.bussiness.ItemBusiness;
import com.gateway.dto.CharacterDialogDTO;
import com.gateway.dto.ItemDTO;
import com.gateway.request.DialogRequest.DialogRequest;
import com.gateway.request.ItemRequest.ItemRequest;
import com.gateway.response.ApiResult;
import com.gateway.response.DialogResponse.GetDialogResponse;
import com.gateway.response.ItemResponse.ItemResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/items")
@RestController
public class ItemService extends BaseFuntion {
    Logger logger = LoggerFactory.getLogger(ItemService.class);

    @Autowired
    private ItemBusiness itemBusiness;

    @RequestMapping(value = "/getAllItems", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<ItemResponse> getAllItems(@RequestBody ItemRequest request) {
        ItemResponse response = new ItemResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                List<ItemDTO> listItems = itemBusiness.findAllItems();
                response.setListItems(listItems);
            }
        } catch (Exception e) {
            logger.error("Error while getting dialog", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/getItems", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<ItemResponse> getItems(@RequestBody ItemRequest request) {
        ItemResponse response = new ItemResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                List<ItemDTO> listItems = itemBusiness.findItems(request);
                response.setListItems(listItems);
            }
        } catch (Exception e) {
            logger.error("Error while getting list items", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/getItemById", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<ItemResponse> getItemById(@RequestBody ItemRequest request) {
        ItemResponse response = new ItemResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                ItemDTO dto = itemBusiness.findItemById(request);
                response.setItemDTO(dto);
            }
        } catch (Exception e) {
            logger.error("Error while getting item", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/insert", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<ItemResponse> insert(@RequestBody ItemRequest request) {
        ItemResponse response = new ItemResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                itemBusiness.create(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            logger.error("Error while inserting dialog", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<ItemResponse> update(@RequestBody ItemRequest request) {
        ItemResponse response = new ItemResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                itemBusiness.update(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            logger.error("Error while updating item", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/delete", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<ItemResponse> delete(@RequestBody ItemRequest request) {
        ItemResponse response = new ItemResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                itemBusiness.delete(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            logger.error("Error while deleting item", e);
        }
        return ResponseEntity.ok(response);
    }

}
