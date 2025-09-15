package com.gateway.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ItemDTO {
    private Long id;
    private String itemName;
    private String itemDescription;
    private String itemImage;
    private String itemIcon;
    private String itemFullInfor;
    private String type;
    private String slug;

    public ItemDTO(Long id, String itemName, String itemDescription, String itemImage, String itemIcon, String itemFullInfor, String type,String slug) {
        this.id = id;
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemImage = itemImage;
        this.itemIcon = itemIcon;
        this.itemFullInfor = itemFullInfor;
        this.type = type;
        this.slug = slug;
    }
}
