package com.partitio.models;

import java.time.OffsetDateTime;

public record User(
    long id,
    String firstName,
    String lastName,
    String email,
    String passwordHash,
    OffsetDateTime createdAt) {
}
