package com.gateway.entity;


import jakarta.persistence.*;

@Entity
@Table(name="wwtag")

public class WwTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="slug")
    private String slug;

    @Column(name="name")
    private String name;

}
