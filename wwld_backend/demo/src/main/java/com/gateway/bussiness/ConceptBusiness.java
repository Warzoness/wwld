package com.gateway.bussiness;

import com.gateway.dto.ConceptDTO;
import com.gateway.entity.Concept;
import com.gateway.request.ConceptRequest;

import java.util.List;

public interface ConceptBusiness {
    List<ConceptDTO> findAllConcepts(ConceptRequest request);

    List<ConceptDTO> findConcepts(ConceptRequest request);

    ConceptDTO findConceptById(ConceptRequest request) throws Exception;

    Concept updateConcept(ConceptRequest request) throws Exception;

    void deleteConcept(ConceptRequest request) throws Exception;

    Concept createConcept(ConceptRequest request) throws Exception;
}
