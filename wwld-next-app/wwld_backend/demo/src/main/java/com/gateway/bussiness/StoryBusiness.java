package com.gateway.bussiness;

import com.gateway.dto.StoryDTO;
import com.gateway.entity.Story;
import com.gateway.request.StoryRequest.StoryRequest;

import java.util.List;

public interface StoryBusiness {
    List<StoryDTO> getAllStories();
    List<StoryDTO> findStory(StoryRequest request);
    Story createStory(StoryRequest request) throws Exception;
    Story updateStory(StoryRequest request) throws Exception;
    void deleteStory(Long id) throws Exception;
}
