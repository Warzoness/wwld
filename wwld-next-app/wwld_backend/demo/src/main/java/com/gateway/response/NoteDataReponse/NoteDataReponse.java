package com.gateway.response.NoteDataReponse;

import com.gateway.dto.NoteDataDTO;
import com.gateway.response.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter


public class NoteDataReponse extends BaseResponse {
    public List<NoteDataDTO> listNoteData;
    public NoteDataDTO noteDataDTO;
}
