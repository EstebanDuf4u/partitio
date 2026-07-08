package com.partitio.dtos;

import com.partitio.models.User;
import java.time.OffsetDateTime;

public record UserResponse(
    long id,
    String firstName,
    String lastName,
    String email,
    OffsetDateTime createdAt,
    boolean is_admin) {
  public static UserResponse from(User user) {
    return new UserResponse(
        user.id(),
        user.firstName(),
        user.lastName(),
        user.email(),
        user.createdAt(),
        user.is_admin());
  }
}