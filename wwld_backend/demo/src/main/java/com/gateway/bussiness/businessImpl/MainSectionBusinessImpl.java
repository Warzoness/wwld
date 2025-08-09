package com.gateway.bussiness.businessImpl;

import com.gateway.bussiness.MainSectionBusiness;
import com.gateway.dao.MainSectionDAO;
import com.gateway.dto.MainSectionDTO;
import com.gateway.entity.MainSection;
import com.gateway.request.MainSection.MainSectionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service(value = "mainSectionBusiness")
public class MainSectionBusinessImpl implements MainSectionBusiness {
    @Autowired
    private MainSectionDAO mainSectionDAO;

    @Override
    public List<MainSectionDTO> getAllMainSections() {
        return mainSectionDAO.getAllMainSections();
    }

    @Override
    public List<MainSectionDTO> findMainSection(MainSectionRequest request) {
        return mainSectionDAO.findMainSection(
                request.getId(),
                request.getName() != null ? request.getName() : ""
        );
    }

    @Override
    public MainSection createMainSection(MainSectionRequest request) throws Exception {
        MainSection mainSection = new MainSection();
        setMainSection(request, mainSection);
        mainSection = mainSectionDAO.save(mainSection);
        return mainSection;
    }

    @Override
    public MainSection updateMainSection(MainSectionRequest request) throws Exception {
        MainSectionDTO mainSectionDTO = mainSectionDAO.findMainSection(request.getId(), null).stream().findFirst().orElse(null);
        if (mainSectionDTO != null) {
            MainSection mainSection = new MainSection();
            mainSection.setId(request.getId());
            setMainSection(request, mainSection);
            return mainSectionDAO.save(mainSection);
        } else {
            throw new Exception("Main section not found");
        }
    }

    @Override
    public MainSectionDTO deleteMainSection(Long id) throws Exception {
        MainSectionDTO mainSectionDTO = mainSectionDAO.findMainSection(id, null).stream().findFirst().orElse(null);
        if (mainSectionDTO != null) {
            mainSectionDAO.deleteById(id);
            return mainSectionDTO;
        } else {
            throw new Exception("Main section not found");
        }
    }

    private void setMainSection(MainSectionRequest request, MainSection mainSection) throws Exception {
        mainSection.setName(request.getName());
        mainSection.setImage(request.getImage());
        mainSection.setIcon(request.getIcon());
        mainSection.setDescription(request.getDescription());
//        mainSection.setActive(request.getActive());
        mainSection.setOrderIndex(request.getOrderIndex());
        mainSection.setType(request.getType());
    }
}
