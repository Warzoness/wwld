package com.gateway.bussiness;

import com.gateway.dto.ItemDTO;
import com.gateway.entity.Item;
import com.gateway.request.ItemRequest.ItemRequest;

import java.util.List;

public interface ItemBusiness {
    List<ItemDTO> findAllItems();
    List<ItemDTO> findItems(ItemRequest request);
    List<ItemDTO> findWeapons(ItemRequest request);
    ItemDTO findItemById(ItemRequest request) throws Exception;
    Item create(ItemRequest request) throws Exception;
    Item update(ItemRequest request) throws Exception;
    void delete(ItemRequest request) throws Exception;
}
