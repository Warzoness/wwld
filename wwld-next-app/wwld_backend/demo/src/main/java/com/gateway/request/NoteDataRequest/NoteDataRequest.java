package com.gateway.request.NoteDataRequest;

import com.gateway.request.BaseRequest;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NoteDataRequest extends BaseRequest {
    private Long id;
    private String noteName;
    private String noteContent;
    private Long storyId;
    private String description;
    private String image;
}
