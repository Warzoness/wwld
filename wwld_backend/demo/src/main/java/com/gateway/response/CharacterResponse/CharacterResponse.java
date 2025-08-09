package com.gateway.response.CharacterResponse;

import com.gateway.dto.CharacterDTO;
import com.gateway.response.BaseResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class CharacterResponse extends BaseResponse {
    // This class can be extended in the future to include specific character response fields
    // Currently, it serves as a base response for character-related operations
    List<CharacterDTO> listCharacters;
}
