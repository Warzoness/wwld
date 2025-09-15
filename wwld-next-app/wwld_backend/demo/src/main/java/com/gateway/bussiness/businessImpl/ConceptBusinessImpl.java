package com.gateway.bussiness.businessImpl;

import com.gateway.bussiness.ConceptBusiness;
import com.gateway.dao.ConceptDAO;
import com.gateway.dto.ConceptDTO;
import com.gateway.entity.Concept;
import com.gateway.request.ConceptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("conceptBusiness")
public class ConceptBusinessImpl implements ConceptBusiness {

    @Autowired
    private ConceptDAO conceptDAO;

    @Override
    public List<ConceptDTO> findAllConcepts(ConceptRequest request) {
        return conceptDAO.getAllConcept();
    }

    @Override
    public List<ConceptDTO> findConcepts(ConceptRequest request) {
        return conceptDAO.findConcepts(request.getTitle());
    }

    @Override
    public ConceptDTO findConceptById(ConceptRequest request) throws Exception {
        ConceptDTO dto = conceptDAO.findConceptById(request.getId());
        if (dto == null) {
            throw new Exception("Concept not found");
        }
        return dto;
    }

    @Override
    public Concept updateConcept(ConceptRequest request) throws Exception {
        ConceptDTO dto = conceptDAO.findConceptById(request.getId());
        Concept concept = new Concept();
        if (dto != null) {
            setConcept(request,concept);
            concept.setId(dto.getId());
            conceptDAO.save(concept);
        }

        return concept;
    }

    @Override
    public void deleteConcept(ConceptRequest request) throws Exception {
        ConceptDTO dto = conceptDAO.findConceptById(request.getId());
        if (dto == null) {
            conceptDAO.deleteById(request.getId());
        }
    }

    @Override
    public Concept createConcept(ConceptRequest request) throws Exception {
        Concept concept = new Concept();
        if(request.getId() != null) {
            setConcept(request, concept);
            conceptDAO.save(concept);
        }
        return concept;
    }

    void setConcept(ConceptRequest request, Concept concept) throws Exception {
        concept.setId(request.getId());
        concept.setSlug(request.getSlug());
        concept.setTitle(request.getTitle());
        concept.setDescription(request.getDescription());
        concept.setContentMd(request.getContentMd());
        concept.setConceptImage(request.getConceptImage());
    }
}
