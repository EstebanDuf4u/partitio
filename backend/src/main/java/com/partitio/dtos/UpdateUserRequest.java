package com.partitio.dtos;

public record UpdateUserRequest(
        String firstName,
        String lastName,
        String email) {
}