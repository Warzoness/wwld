package com.gateway.response.StoryResponse;

import com.gateway.dto.StoryDTO;
import com.gateway.response.PagingResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class GetStoryResponse extends PagingResponse {
    private List<StoryDTO> stories;
}
