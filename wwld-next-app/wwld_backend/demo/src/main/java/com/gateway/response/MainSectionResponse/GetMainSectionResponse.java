package com.gateway.response.MainSectionResponse;


import com.gateway.dto.MainSectionDTO;
import com.gateway.response.PagingResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GetMainSectionResponse extends PagingResponse {
    private List<MainSectionDTO> mainSections;
}
