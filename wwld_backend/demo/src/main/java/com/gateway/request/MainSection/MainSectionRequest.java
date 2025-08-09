package com.gateway.request.MainSection;

import com.gateway.request.BaseRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class MainSectionRequest extends BaseRequest {
    private Long id;
    private String name;
    private String icon;
    private String image;
    private String description;
//    private int active;
    private Integer orderIndex;
    private String type;
}
