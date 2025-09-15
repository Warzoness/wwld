package com.gateway.dto;

import com.gateway.entity.ItemType;
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
    private ItemType itemType;
    private String slug;
    private Long itemRank;

    public ItemDTO(Long id, String itemName, String itemDescription, String itemImage, String itemIcon, String itemFullInfor, ItemType itemType,String slug,Long itemRank) {
        this.id = id;
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemImage = itemImage;
        this.itemIcon = itemIcon;
        this.itemFullInfor = itemFullInfor;
        this.itemType = itemType;
        this.slug = slug;
        this.itemRank = itemRank;
    }
}
