package com.gateway.response.ItemResponse;

import com.gateway.dto.ItemDTO;
import com.gateway.response.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class ItemResponse extends BaseResponse {
    List<ItemDTO> listItems;
    ItemDTO itemDTO;
}
