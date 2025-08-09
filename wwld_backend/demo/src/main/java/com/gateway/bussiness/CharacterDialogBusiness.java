package com.gateway.bussiness;

import com.gateway.dto.CharacterDialogDTO;
import com.gateway.entity.CharacterDialog;
import com.gateway.request.DialogRequest.DialogRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CharacterDialogBusiness {
    List<CharacterDialogDTO> findDialog(DialogRequest request);
    Page<CharacterDialogDTO> findDialogAndPagination(DialogRequest request);
    CharacterDialog createDialog(DialogRequest request) throws Exception;
    CharacterDialog updateDialog(DialogRequest request) throws Exception;
    void deleteDialog(Long id) throws Exception;
    void updateOrderIndex(DialogRequest request) throws Exception;
}
