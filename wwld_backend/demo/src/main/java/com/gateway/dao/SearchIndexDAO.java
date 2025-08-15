package com.gateway.dao;

import com.gateway.dto.NoteDataDTO;
import com.gateway.dto.SearchIndexDTO;
import com.gateway.entity.SearchIndex;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SearchIndexDAO extends JpaRepository<SearchIndex, Long> {

    // Lấy tất cả index
    @Query("""
      select new com.gateway.dto.SearchIndexDTO(
        s.id, s.searchEntityType, s.display, s.slug
      )
      from SearchIndex s
      order by s.display asc
      """)
    List<SearchIndexDTO> searchIndexAll();

    // Tìm mọi loại theo từ khóa (auto-complete), ưu tiên prefix
    @Query("""
      select new com.gateway.dto.SearchIndexDTO(
        s.id, s.searchEntityType, s.display, s.slug
      )
      from SearchIndex s
      where lower(s.display) like lower(concat('%', :q, '%'))
      order by
        case when lower(s.display) like lower(concat(:q, '%')) then 0 else 1 end,
        length(s.display),
        s.display
      """)
    Slice<SearchIndexDTO> searchAll(@Param("q") String q, Pageable pageable);
}
