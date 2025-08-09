package com.gateway.response.DialogResponse;

import com.gateway.dto.CharacterDialogDTO;
import com.gateway.response.BaseResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class GetDialogResponse extends BaseResponse {
    private List<CharacterDialogDTO> listDialogs;
}
