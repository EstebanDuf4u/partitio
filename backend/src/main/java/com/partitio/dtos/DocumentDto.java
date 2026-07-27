package com.partitio.dtos;

import java.time.LocalDate;

public class DocumentDto {
    private long id;
    private String name;
    private String voiceType;
    private String documentType;
    private LocalDate dateAdded;
    private LocalDate dateModified;
    private String documentUrl;
    private PieceIdDto pieceId;

    public DocumentDto(long id, String name, String voiceType, String documentType, LocalDate dateAdded, LocalDate dateModified, String documentUrl, PieceIdDto pieceId) {
        this.id = id;
        this.name = name;
        this.voiceType = voiceType;
        this.documentType = documentType;
        this.dateAdded = dateAdded;
        this.dateModified = dateModified;
        this.documentUrl = documentUrl;
        this.pieceId = pieceId;
    }

    // getters et setters
    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVoiceType() {
        return this.voiceType;
    }
        
    public void setVoiceType(String voiceType) {
        this.voiceType = voiceType;
    }

    public String getDocumentType() {
        return this.documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public LocalDate getDateAdded() {
        return this.dateAdded;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }

    public LocalDate getDateModified() {
        return this.dateModified;
    }

    public void setDateModified(LocalDate dateModified) {
        this.dateModified = dateModified;
    }

    public String getDocumentUrl() {
        return this.documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public PieceIdDto getPieceId() {
        return this.pieceId;
    }

    public void setPieceId(PieceIdDto pieceId) {
        this.pieceId = pieceId;
    }
}
