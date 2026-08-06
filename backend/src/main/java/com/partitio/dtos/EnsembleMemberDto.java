package com.partitio.dtos;

import java.time.OffsetDateTime;

import com.partitio.models.EnsembleMember;
import com.partitio.models.EnsembleRole;
import com.partitio.models.User;

public record EnsembleMemberDto(
        Long id,
        Long userId,
        String firstName,
        String lastName,
        String email,
        String role,
        String ensembleRole,
        String ensembleRoleLabel,
        String status,
        boolean currentUser,
        OffsetDateTime joinedAt) {
    public static EnsembleMemberDto from(EnsembleMember member, Long currentUserId) {
        User user = member.getUser();
        EnsembleRole ensembleRole = member.getEnsembleRole() == null
                ? EnsembleRole.PARTICIPANT
                : member.getEnsembleRole();

        return new EnsembleMemberDto(
                member.getId(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                member.getRole(),
                ensembleRole.name(),
                ensembleRoleLabel(ensembleRole),
                member.getStatus(),
                user.getId().equals(currentUserId),
                member.getJoinedAt());
    }

    private static String ensembleRoleLabel(EnsembleRole role) {
        if (role == EnsembleRole.ADMIN) {
            return "Admin";
        }
        return "Participant";
    }
}
