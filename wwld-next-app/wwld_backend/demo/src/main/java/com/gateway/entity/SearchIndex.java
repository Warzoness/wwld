package com.gateway.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name="search_index")
@Entity
public class SearchIndex {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name="entity_type")
    private SearchEntityType searchEntityType;

    @Column(name="display",nullable=false, length=255)
    private String display;

    @Column(name="slug")
    private String slug;
}
