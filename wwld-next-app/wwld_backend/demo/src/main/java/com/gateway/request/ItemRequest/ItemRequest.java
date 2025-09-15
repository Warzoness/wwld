package com.gateway.request.ItemRequest;

import com.gateway.request.BaseRequest;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class ItemRequest extends BaseRequest {
    private Long id;
    private String itemName;
    private String itemDescription;
    private String itemImage;
    private String itemIcon;
    private String itemFullInfor;
    private String type;
    private String slug;

}
