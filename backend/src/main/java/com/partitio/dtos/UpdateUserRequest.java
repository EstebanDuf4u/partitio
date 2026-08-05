package com.partitio.dtos;

public record UpdateUserRequest(
                String firstName,
                String lastName,
                String email,
                String profileImageUrl,
                String phone,
                String town,
                String voiceType) {
}