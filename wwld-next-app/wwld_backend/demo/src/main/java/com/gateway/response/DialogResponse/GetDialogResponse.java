package com.gateway.response.DialogResponse;

import com.gateway.dto.CharacterDialogDTO;
import com.gateway.response.BaseResponse;
import com.gateway.response.PagingResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class GetDialogResponse extends PagingResponse {
    private List<CharacterDialogDTO> listDialogs;
    private int pageNumber;
    private int pageSize;
}
