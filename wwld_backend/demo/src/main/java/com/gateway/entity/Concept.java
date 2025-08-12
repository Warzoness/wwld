package com.gateway.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name="concept")
public class Concept {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private long id;

    @Column(name="title")
    private String title;

    @Column(name="slug")
    private String slug;

    @Column(name="contentMd",columnDefinition = "TEXT")
    private String contentMd;

    @Column(name="concept_image")
    private String conceptImage;

    @Column(name="description",columnDefinition = "TEXT")
    private String description;
}
