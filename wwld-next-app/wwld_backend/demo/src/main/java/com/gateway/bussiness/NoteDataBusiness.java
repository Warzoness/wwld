package com.gateway.bussiness;

import com.gateway.dto.NoteDataDTO;
import com.gateway.entity.NoteData;
import com.gateway.request.NoteDataRequest.NoteDataRequest;

import java.util.List;

public interface NoteDataBusiness {
    List<NoteDataDTO> findAllNoteData();
    NoteDataDTO findOneNoteData(NoteDataRequest request) throws Exception ;
    NoteData create(NoteDataRequest request) throws Exception;
    NoteData update(NoteDataRequest request) throws Exception;
    void delete(NoteDataRequest request) throws Exception;
}
