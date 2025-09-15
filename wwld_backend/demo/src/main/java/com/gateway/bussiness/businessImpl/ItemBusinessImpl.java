package com.gateway.bussiness.businessImpl;


import com.gateway.bussiness.ItemBusiness;
import com.gateway.dao.ItemDAO;
import com.gateway.dto.ItemDTO;
import com.gateway.entity.Item;
import com.gateway.entity.ItemType;
import com.gateway.request.ItemRequest.ItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("itemBusiness")
public class ItemBusinessImpl implements ItemBusiness {

    @Autowired
    private ItemDAO itemDAO;

    @Override
    public List<ItemDTO> findAllItems() {
        return itemDAO.getAllItems();
    }

    @Override
    public List<ItemDTO> findItems(ItemRequest request) {
        return itemDAO.findItems(request.getId(), request.getItemName());
    }

    @Override
    public List<ItemDTO> findWeapons(ItemRequest request) {
        return itemDAO.findWeapons(ItemType.WEAPON,request.getItemRank());
    }

    @Override
    public ItemDTO findItemById(ItemRequest request) throws Exception {
        return itemDAO.findOneItemById(request.getId());
    }

    @Override
    public Item create(ItemRequest request) throws Exception {
        Item item = new Item();
        if (request != null) {
            setItem(request, item);
            itemDAO.save(item);
        }
        return item;
    }

    @Override
    public Item update(ItemRequest request) throws Exception {
        ItemDTO itemDTO = itemDAO.findOneItemById(request.getId());
        Item item = new Item();

        if (itemDTO != null) {
            setItem(request, item);
            item.setId(itemDTO.getId());

            itemDAO.save(item);
        } else {
            throw new Exception();
        }
        return item;
    }

    @Override
    public void delete(ItemRequest request) throws Exception {
        ItemDTO itemDTO = itemDAO.findOneItemById(request.getId());
        Item item = new Item();

        if (itemDTO != null) {
            setItem(request, item);
            item.setId(itemDTO.getId());

            itemDAO.delete(item);
        } else {
            throw new Exception();
        }
    }


    void setItem(ItemRequest request, Item item) throws Exception {
        item.setItemName(request.getItemName());
        item.setItemDescription(request.getItemDescription());
        item.setItemIcon(request.getItemIcon());
        item.setItemImage(request.getItemImage());
        item.setItemFullInfor(request.getItemFullInfor());
        item.setItemType(request.getItemType());
        item.setSlug(request.getSlug());
        item.setItemRank(request.getItemRank());
    }
}
