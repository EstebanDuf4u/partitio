package com.partitio.dtos;

import java.time.LocalDateTime;
import java.util.List;

public class PieceDto {
    private long id;
    private String title;
    private String artist;
    private String category;
    private String language;
    private String description;
    private String coverUrl;
    private LocalDateTime dateAdded;
    private List<DocumentDto> documentDtoList;

    public PieceDto(long id, String title, String artist, String category, String language, String description, String coverUrl, LocalDateTime dateAdded, List<DocumentDto> documentDtoList) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.category = category;
        this.language = language;
        this.description = description;
        this.coverUrl = coverUrl;
        this.dateAdded = dateAdded;
        this.documentDtoList = documentDtoList;
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

    public List<DocumentDto> getDocumentDto() {
        return this.documentDtoList;
    }

    public void setDocumentDto(List<DocumentDto> documentDto) {
        this.documentDtoList = documentDto;
    }
}