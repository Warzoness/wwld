package com.gateway.bussiness;

import com.gateway.dto.MainSectionDTO;
import com.gateway.entity.MainSection;
import com.gateway.request.MainSection.MainSectionRequest;

import java.util.List;

public interface MainSectionBusiness {
    List<MainSectionDTO> getAllMainSections();
    List<MainSectionDTO> findMainSection(MainSectionRequest request);
    MainSection createMainSection(MainSectionRequest request) throws Exception;
    MainSection updateMainSection(MainSectionRequest request) throws Exception;
    MainSectionDTO deleteMainSection(Long id) throws Exception;
}
