package com.gateway.request;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ConceptRequest extends BaseRequest {
    private Long id;
    private String title;
    private String slug;
    private String contentMd;
    private String conceptImage;
    private String description;
}
