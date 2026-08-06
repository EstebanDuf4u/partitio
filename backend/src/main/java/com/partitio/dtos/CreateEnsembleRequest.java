package com.partitio.dtos;

import jakarta.validation.constraints.NotBlank;

public record CreateEnsembleRequest(
        @NotBlank String name,
        String type,
        String role,
        String nextDate,
        String rehearsalLocation,
        String color) {
}
