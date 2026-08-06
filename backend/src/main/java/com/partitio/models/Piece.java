package com.partitio.models;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "pieces")
public class Piece {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name = "artist")
    private String artist;

    @Column(name = "category")
    private String category;

    @Column(name = "language")
    private String language;

    @Column(name = "description")
    private String description;

    @Column(name = "cover_url")
    private String coverUrl;

    @CreationTimestamp
    @Column(name = "date_added", updatable = false)
    private LocalDateTime dateAdded;

    // Association de type "OneToMany" : un morceau peut avoir plusieurs documents
    @OneToMany(targetEntity = Document.class, mappedBy = "piece")
    private List<Document> documents;

    // constructeur vide --> obligatoire pour l'utilisation d'un ORM
    public Piece() {

    }

    // getters et setters
    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return this.artist;
    }
        
    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category){
        this.category = category;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language){
        this.language = language;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String desc){
        this.description = desc;
    }

    public String getCoverUrl() {
        return this.coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public LocalDateTime getDateAdded() {
        return this.dateAdded;
    }

    public void setDateAdded(LocalDateTime dateAdded) {
        this.dateAdded = dateAdded;
    }

    public List<Document> getDocuments() {
        return this.documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }
}
