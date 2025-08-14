package com.gateway.dao;

import com.gateway.dto.NoteDataDTO;
import com.gateway.entity.NoteData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoteDataDAO extends JpaRepository<NoteData, Long> {
    @Query("select new com.gateway.dto.NoteDataDTO(" +
            "n.id,n.noteName,n.noteContent,n.storyId,n.description,n.image" +
            ") FROM NoteData n")
    List<NoteDataDTO> findAllNoteData();

    @Query("select new com.gateway.dto.NoteDataDTO(" +
            "n.id,n.noteName,n.noteContent,n.storyId,n.description,n.image" +
            ") FROM NoteData n WHERE n.id =:id ")
    NoteDataDTO findOneNoteData(@Param("id") Long id);
}
