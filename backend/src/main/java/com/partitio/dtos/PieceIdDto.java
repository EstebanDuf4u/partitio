package com.partitio.dtos;

public class PieceIdDto {
    private long id;

    public PieceIdDto(long id) {
        this.id = id;
    }

    // getters et setters
    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }
}