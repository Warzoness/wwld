package com.gateway.bussiness.businessImpl;

import com.gateway.bussiness.NoteDataBusiness;
import com.gateway.dao.NoteDataDAO;
import com.gateway.dto.NoteDataDTO;
import com.gateway.entity.NoteData;
import com.gateway.request.NoteDataRequest.NoteDataRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("noteDataBusiness")
public class NoteDataBusinessImpl implements NoteDataBusiness {
    @Autowired
    private NoteDataDAO noteDataDAO;

    @Override
    public List<NoteDataDTO> findAllNoteData() {
        return noteDataDAO.findAllNoteData();
    }

    @Override
    public NoteDataDTO findOneNoteData(NoteDataRequest request) throws Exception {
        return noteDataDAO.findOneNoteData(request.getId());
    }

    @Override
    public NoteData create(NoteDataRequest request) throws Exception {
        NoteData noteData = new NoteData();
        setNoteData(request, noteData);
        return noteDataDAO.save(noteData);
    }

    @Override
    public NoteData update(NoteDataRequest request) throws Exception {
        NoteDataDTO noteDataDTO = noteDataDAO.findOneNoteData(request.getId());
        NoteData noteData = new NoteData();
        if (noteDataDTO != null) {
            setNoteData(request, noteData);
            noteData.setId(noteDataDTO.getId());
        }
        return noteDataDAO.save(noteData);
    }

    @Override
    public void delete(NoteDataRequest request) throws Exception {
        NoteDataDTO noteDataDTO = noteDataDAO.findOneNoteData(request.getId());
        NoteData noteData = new NoteData();
        if (noteDataDTO != null) {
            setNoteData(request, noteData);
            noteData.setId(noteDataDTO.getId());
        }

        noteDataDAO.delete(noteData);
    }

    void setNoteData(NoteDataRequest request, NoteData noteData) throws Exception {
        noteData.setNoteName(request.getNoteName());
        noteData.setNoteContent(request.getNoteContent());
        noteData.setStoryId(request.getStoryId());
        noteData.setDescription(request.getDescription());
        noteData.setImage(request.getImage());
    }
}
