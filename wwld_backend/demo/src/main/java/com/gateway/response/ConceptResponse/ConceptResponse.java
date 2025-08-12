package com.gateway.response.ConceptResponse;

import com.gateway.dto.ConceptDTO;
import com.gateway.response.BaseResponse;
import com.gateway.response.PagingResponse;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString

public class ConceptResponse extends PagingResponse {
    public List<ConceptDTO> listConcepts;
    public ConceptDTO conceptDTO;

}
