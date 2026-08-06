package com.partitio.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateEnsembleInvitationRequest(
        @NotBlank @Email String email,
        String role,
        String ensembleRole) {
}
