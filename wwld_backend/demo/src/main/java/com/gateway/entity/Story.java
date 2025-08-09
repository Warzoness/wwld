package com.gateway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name="story")
@Getter
@Setter

public class Story {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="title", nullable = false)
    private String title;

    @Column(name="type")
    private Integer type;

    @Column(name="active")
    private Integer active;

    @Column(name="mainSectionId")
    private Long mainSectionId;

    @Column(name="areaId")
    private Long areaId;

    @Column(name="parentId")
    private Long parentId;

    @Column(name="time_started")
    private Date timeStarted;

    @Column(name="time_ended")
    private Date timeEnded;

    @Column(name="description")
    private String description;
}
