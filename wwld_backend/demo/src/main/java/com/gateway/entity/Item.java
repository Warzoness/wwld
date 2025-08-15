package com.gateway.entity;


import jakarta.persistence.*;

@Entity
@Table(name="items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="item_name")
    private String itemName;

    @Column(name="item_image")
    private String itemImage;

    @Column(name="item_description")
    private String itemDescription;

    @Column(name="item_icon")
    private String itemIcon;

    @Column(name="item_full_infor")
    private String itemFullInfor;

    @Column(name="type")
    private String type;
}
