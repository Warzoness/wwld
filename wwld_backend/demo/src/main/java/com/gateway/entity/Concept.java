package com.gateway.entity;


import jakarta.persistence.*;

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

    @Lob
    @Column(name="contentHtml",columnDefinition = "TEXT" )
    private String contentHtml;

}
