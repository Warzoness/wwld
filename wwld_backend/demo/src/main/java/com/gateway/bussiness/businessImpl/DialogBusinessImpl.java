package com.gateway.bussiness.businessImpl;

import com.gateway.bussiness.CharacterDialogBusiness;
import com.gateway.dao.CharacterDialogDAO;
import com.gateway.dto.CharacterDialogDTO;
import com.gateway.entity.CharacterDialog;
import com.gateway.request.DialogRequest.DialogRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;


@Service(value = "dialogBusiness")

public class DialogBusinessImpl implements CharacterDialogBusiness {

    @Autowired
    private CharacterDialogDAO characterDialogDAO;

    @Override
    public List<CharacterDialogDTO> findDialog(DialogRequest request) {
        return characterDialogDAO.findDialog(request.getId(), request.getStoryId());
    }

    @Override
    public Page<CharacterDialogDTO> findDialogAndPagination(DialogRequest request) {
        return characterDialogDAO.findDialogAndPagination(
                PageRequest.of(request.getPageIndex(),request.getPageSize()),
                request.getId(),
                request.getStoryId()
        );
    }

    // order index = oldest index + 1
    @Override
    public CharacterDialog createDialog(DialogRequest request) throws Exception {
        if ( request.getStoryId() == null) {
            throw new IllegalArgumentException("Story ID must not be null");
        }
        CharacterDialog dialog = new CharacterDialog();
        Integer maxOrderIndex = characterDialogDAO.getMaxOrderIndex(request.getStoryId());
        if(maxOrderIndex == null){
            maxOrderIndex = 0;
        }
        dialog.setOrderIndex(maxOrderIndex+1);
        setDiaLog(request, dialog);
        return characterDialogDAO.save(dialog);
    }

    @Override
    public CharacterDialog updateDialog(DialogRequest request) throws Exception {
        CharacterDialogDTO dialogDTO = characterDialogDAO.findDialog(request.getId(), request.getStoryId())
                .stream().filter(d -> d.getId().equals(request.getId())).findFirst().orElse(null);
        if (dialogDTO != null) {
            CharacterDialog dialog = new CharacterDialog();
            dialog.setId(request.getId());
            dialog.setOrderIndex(request.getOrderIndex());
            setDiaLog(request, dialog);
            return characterDialogDAO.save(dialog);
        }else{
            throw new Exception("Dialog not found");
        }
    }

    @Override
    public void deleteDialog(Long id) throws Exception {
        CharacterDialogDTO dialogDTO = characterDialogDAO.findDialog(id, null)
                .stream().filter(d -> d.getId().equals(id)).findFirst().orElse(null);
        if (dialogDTO != null) {
            characterDialogDAO.deleteById(id);
        } else {
            throw new Exception("Dialog not found");
        }
    }

    @Override
    public void updateOrderIndex(DialogRequest request) throws Exception {
        CharacterDialogDTO dialogDTO = characterDialogDAO.findDialogById(request.getId());
        if (dialogDTO != null) {
            characterDialogDAO.updateOrderIndex(request.getId(),request.getOrderIndex());
        } else {
            throw new Exception("Dialog not found");
        }
    }

    private void setDiaLog(DialogRequest request, CharacterDialog dialog) {
        dialog.setCharacterId(request.getCharacterId());
        dialog.setStoryId(request.getStoryId());
        dialog.setImage(request.getImage());
        dialog.setContent(request.getContent());
        dialog.setType(request.getType());
        dialog.setVoice(request.getVoice());
        dialog.setNoNameCharacter(request.getNoNameCharacter());
    }
}
