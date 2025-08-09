package com.gateway.bussiness.businessImpl;

import com.gateway.bussiness.StoryBusiness;
import com.gateway.dao.StoryDAO;
import com.gateway.dto.StoryDTO;
import com.gateway.entity.Story;
import com.gateway.request.StoryRequest.StoryRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service(value = "storyBusiness")
public class StoryBusinessImpl implements StoryBusiness {

    @Autowired
    private StoryDAO storyDAO;

    // find all stories
    @Override
    public List<StoryDTO> getAllStories() {
        return storyDAO.getAllStories();
    }

    // find stories
    @Override
    public List<StoryDTO> findStory(StoryRequest request) {
        return storyDAO.findStory(
                request.getId(),
                request.getTitle() != null ? request.getTitle() : "",
                request.getMainSectionId(),
                request.getParentId(),
                request.getAreaId(),
                request.getType()
        );
    }

    // create a new story
    @Override
    public Story createStory(StoryRequest request) throws Exception {
        Story story = new Story();
        setStory(request, story);
        story = storyDAO.save(story);

        return story;
    }

    // update an existing story
    @Override
    public Story updateStory(StoryRequest request) throws Exception {
        StoryDTO storyDTO = storyDAO.findOneById(request.getId());
        if (storyDTO != null) {
            Story story = new Story();
            story.setId(request.getId());
            setStory(request, story);
            return storyDAO.save(story);
        } else {
            throw new Exception();
        }
    }

    // Helper method to set story properties from request
    private void setStory(StoryRequest request, Story story) {
        story.setTitle(request.getTitle());
        story.setType(request.getType());
        story.setActive(request.getActive());
        story.setMainSectionId(request.getMainSectionId());
        story.setAreaId(request.getAreaId());
        story.setParentId(request.getParentId());
        story.setTimeStarted(request.getTimeStarted());
        story.setTimeEnded(request.getTimeEnded());
        story.setDescription(request.getDescription());
    }

    // delete a story (mark as inactive)
    @Override
    public void deleteStory(Long id) throws Exception {
        Story story = storyDAO.findById(id).orElse(null);
        if (story != null) {
            storyDAO.deleteById(id);
        } else {
            throw new Exception("Story not found");
        }
    }
}