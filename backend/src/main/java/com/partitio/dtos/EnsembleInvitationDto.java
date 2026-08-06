package com.partitio.dtos;

import java.time.OffsetDateTime;

import com.partitio.models.EnsembleInvitation;
import com.partitio.models.EnsembleRole;

public record EnsembleInvitationDto(
        Long id,
        long ensembleId,
        String ensembleName,
        String email,
        String role,
        String ensembleRole,
        String ensembleRoleLabel,
        String inviteToken,
        String status,
        OffsetDateTime createdAt) {
    public static EnsembleInvitationDto from(EnsembleInvitation invitation) {
        EnsembleRole ensembleRole = invitation.getEnsembleRole() == null
                ? EnsembleRole.PARTICIPANT
                : invitation.getEnsembleRole();

        return new EnsembleInvitationDto(
                invitation.getId(),
                invitation.getEnsemble().getId(),
                invitation.getEnsemble().getName(),
                invitation.getEmail(),
                invitation.getRole(),
                ensembleRole.name(),
                ensembleRoleLabel(ensembleRole),
                invitation.getInviteToken(),
                invitation.getStatus(),
                invitation.getCreatedAt());
    }

    private static String ensembleRoleLabel(EnsembleRole role) {
        if (role == EnsembleRole.ADMIN) {
            return "Admin";
        }
        return "Participant";
    }
}
