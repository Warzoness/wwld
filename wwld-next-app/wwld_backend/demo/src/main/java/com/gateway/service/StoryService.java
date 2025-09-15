package com.gateway.service;


import com.gateway.bussiness.StoryBusiness;
import com.gateway.dto.StoryDTO;
import com.gateway.entity.Story;
import com.gateway.request.StoryRequest.StoryRequest;
import com.gateway.response.ApiResult;
import com.gateway.response.StoryResponse.GetStoryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/stories")
public class StoryService extends BaseFuntion {
    private static final Logger LOGGER = LoggerFactory.getLogger(StoryService.class);

    @Autowired
    private StoryBusiness storyBusinessImpl;

    @RequestMapping(value = "/getStories", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GetStoryResponse> searchStories(@RequestBody StoryRequest request) {
        GetStoryResponse response = new GetStoryResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                List<StoryDTO> stories = storyBusinessImpl.findStory(request);
                response.setStories(stories);
            }
        } catch (Exception e) {
            LOGGER.error("Error while searching stories", e);
        }
        return ResponseEntity.ok(response);
    };

    @RequestMapping(value = "insert", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GetStoryResponse> insert(@RequestBody StoryRequest request) {
        GetStoryResponse response = new GetStoryResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                Story story = storyBusinessImpl.createStory(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while inserting story", e);
        }
        return ResponseEntity.ok(response);
    };

    @RequestMapping(value = "update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GetStoryResponse> update(@RequestBody StoryRequest request) {
        System.out.println("Update story request: " + request.getMainSectionId());
        GetStoryResponse response = new GetStoryResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                Story story = storyBusinessImpl.updateStory(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            LOGGER.error("Error while updating story", e);
        }
        return ResponseEntity.ok(response);
    };

    @RequestMapping(value="delete", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GetStoryResponse> delete(@RequestBody StoryRequest request) {
        GetStoryResponse response = new GetStoryResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                StoryDTO storyDTO = storyBusinessImpl.findStory(request).stream().findFirst().orElse(null);
                if (storyDTO != null) {
                    storyBusinessImpl.deleteStory(storyDTO.getId());
                    response.setResult(ApiResult.Result.OK);
                } else {
                    response.setResult(ApiResult.Result.FAILD);
                }
            }
        } catch (Exception e) {
            LOGGER.error("Error while deleting story", e);
        }
        return ResponseEntity.ok(response);
    }
}
