package com.partitio.dtos;

import java.time.OffsetDateTime;

import com.partitio.models.User;

public record UserResponse(Long id, String firstName, String lastName, String email, OffsetDateTime createdAt,
    boolean is_admin, String profileImageUrl, String phone,
    String town,
    String voiceType) {

  public static UserResponse from(User user) {
    return new UserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail(),
        user.getCreatedAt(),
        user.getIsAdmin(),
        user.getProfileImageUrl(),
        user.getPhone(),
        user.getTown(),
        user.getVoiceType());
  }
}