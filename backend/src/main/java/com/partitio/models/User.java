package com.partitio.models;

import java.time.OffsetDateTime;

public record User(
    long id,
    String firstName,
    String lastName,
    String email,
    String passwordHash,
    boolean emailVerified,
    String emailVerificationToken,
    OffsetDateTime emailVerificationExpiresAt,
    OffsetDateTime createdAt) {
}