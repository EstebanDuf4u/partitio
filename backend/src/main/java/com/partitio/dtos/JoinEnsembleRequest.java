package com.partitio.dtos;

import jakarta.validation.constraints.NotBlank;

public record JoinEnsembleRequest(
        @NotBlank String inviteCode,
        String role,
        String ensembleRole) {
}
