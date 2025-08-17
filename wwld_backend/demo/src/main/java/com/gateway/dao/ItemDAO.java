package com.gateway.dao;

import com.gateway.dto.ItemDTO;
import com.gateway.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemDAO extends JpaRepository<Item, Long> {
    @Query("SELECT new com.gateway.dto.ItemDTO(" +
            "i.id,i.itemName,i.itemDescription,i.itemImage, " +
            "i.itemIcon,i.itemFullInfor,i.type,i.slug ) " +
            "FROM Item i")
    List<ItemDTO> getAllItems();

    @Query("SELECT new com.gateway.dto.ItemDTO(" +
            "i.id,i.itemName,i.itemDescription,i.itemImage, " +
            "i.itemIcon,i.itemFullInfor,i.type,i.slug ) " +
            "FROM Item i WHERE " +
            " (i.id =:id OR :id IS NULL) " +
            "AND (i.itemName LIKE concat('%',:itemName,'%') OR :itemName IS NULL )")
    List<ItemDTO> findItems(@Param("id") Long id, @Param("itemName") String itemName);

    @Query("SELECT new com.gateway.dto.ItemDTO(" +
            "i.id,i.itemName,i.itemDescription,i.itemImage, " +
            "i.itemIcon,i.itemFullInfor,i.type,i.slug ) " +
            "FROM Item i WHERE i.id =:id")
    ItemDTO findOneItemById(@Param("id") Long id);
}
