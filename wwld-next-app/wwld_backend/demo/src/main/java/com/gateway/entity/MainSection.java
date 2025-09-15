package com.gateway.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "main_section")
public class MainSection {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="image")
    private String image;

    @Column(name="icon")
    private String icon;

    @Column(name="description")
    private String description;

    @Column(name="order_index")
    private Integer orderIndex;

    @Column(name="type")
    private String type;
}
