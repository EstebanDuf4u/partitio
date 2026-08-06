package com.partitio.dtos;

import com.partitio.models.Ensemble;
import com.partitio.models.EnsembleInvitation;
import com.partitio.models.EnsembleMember;
import com.partitio.models.EnsembleRole;

public class EnsembleDto {
    private long id;
    private String name;
    private String type;
    private String role;
    private int members;
    private int pieces;
    private String nextDate;
    private String rehearsalLocation;
    private String status;
    private String initials;
    private String color;
    private Long membershipId;
    private Long invitationId;
    private String inviteCode;
    private String ensembleRole;
    private String ensembleRoleLabel;

    public EnsembleDto(long id, String name, String type, String role, int members, int pieces, String nextDate,
            String rehearsalLocation, String status, String initials, String color) {
        this(id, name, type, role, members, pieces, nextDate, rehearsalLocation, status, initials, color, null, null,
                null, null, null);
    }

    public EnsembleDto(long id, String name, String type, String role, int members, int pieces, String nextDate,
            String rehearsalLocation, String status, String initials, String color, Long membershipId, Long invitationId,
            String inviteCode, String ensembleRole, String ensembleRoleLabel) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.role = role;
        this.members = members;
        this.pieces = pieces;
        this.nextDate = nextDate;
        this.rehearsalLocation = rehearsalLocation;
        this.status = status;
        this.initials = initials;
        this.color = color;
        this.membershipId = membershipId;
        this.invitationId = invitationId;
        this.inviteCode = inviteCode;
        this.ensembleRole = ensembleRole;
        this.ensembleRoleLabel = ensembleRoleLabel;
    }

    public static EnsembleDto from(Ensemble ensemble) {
        return new EnsembleDto(
                ensemble.getId(),
                ensemble.getName(),
                ensemble.getType(),
                ensemble.getRole(),
                ensemble.getMembers(),
                ensemble.getPieces(),
                ensemble.getNextDate(),
                ensemble.getRehearsalLocation(),
                ensemble.getStatus(),
                ensemble.getInitials(),
                ensemble.getColor());
    }

    public static EnsembleDto fromMembership(EnsembleMember member, int membersCount) {
        Ensemble ensemble = member.getEnsemble();
        EnsembleRole ensembleRole = member.getEnsembleRole() == null
                ? EnsembleRole.PARTICIPANT
                : member.getEnsembleRole();

        return new EnsembleDto(
                ensemble.getId(),
                ensemble.getName(),
                ensemble.getType(),
                member.getRole(),
                membersCount,
                ensemble.getPieces(),
                ensemble.getNextDate(),
                ensemble.getRehearsalLocation(),
                statusLabel(member.getStatus()),
                ensemble.getInitials(),
                ensemble.getColor(),
                member.getId(),
                null,
                ensemble.getInviteCode(),
                ensembleRole.name(),
                ensembleRoleLabel(ensembleRole.name()));
    }

    public static EnsembleDto fromInvitation(EnsembleInvitation invitation, int membersCount) {
        Ensemble ensemble = invitation.getEnsemble();
        EnsembleRole ensembleRole = invitation.getEnsembleRole() == null
                ? EnsembleRole.PARTICIPANT
                : invitation.getEnsembleRole();

        return new EnsembleDto(
                ensemble.getId(),
                ensemble.getName(),
                ensemble.getType(),
                invitation.getRole(),
                membersCount,
                ensemble.getPieces(),
                ensemble.getNextDate(),
                ensemble.getRehearsalLocation(),
                "Invitation",
                ensemble.getInitials(),
                ensemble.getColor(),
                null,
                invitation.getId(),
                invitation.getInviteToken(),
                ensembleRole.name(),
                ensembleRoleLabel(ensembleRole.name()));
    }

    private static String statusLabel(String status) {
        if ("paused".equals(status)) {
            return "Pause";
        }
        return "Actif";
    }

    private static String ensembleRoleLabel(String role) {
        if ("ADMIN".equals(role)) {
            return "Admin";
        }
        return "Participant";
    }

    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getMembers() {
        return this.members;
    }

    public void setMembers(int members) {
        this.members = members;
    }

    public int getPieces() {
        return this.pieces;
    }

    public void setPieces(int pieces) {
        this.pieces = pieces;
    }

    public String getNextDate() {
        return this.nextDate;
    }

    public void setNextDate(String nextDate) {
        this.nextDate = nextDate;
    }

    public String getRehearsalLocation() {
        return this.rehearsalLocation;
    }

    public void setRehearsalLocation(String rehearsalLocation) {
        this.rehearsalLocation = rehearsalLocation;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getInitials() {
        return this.initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getColor() {
        return this.color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getMembershipId() {
        return this.membershipId;
    }

    public void setMembershipId(Long membershipId) {
        this.membershipId = membershipId;
    }

    public Long getInvitationId() {
        return this.invitationId;
    }

    public void setInvitationId(Long invitationId) {
        this.invitationId = invitationId;
    }

    public String getInviteCode() {
        return this.inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public String getEnsembleRole() {
        return this.ensembleRole;
    }

    public void setEnsembleRole(String ensembleRole) {
        this.ensembleRole = ensembleRole;
    }

    public String getEnsembleRoleLabel() {
        return this.ensembleRoleLabel;
    }

    public void setEnsembleRoleLabel(String ensembleRoleLabel) {
        this.ensembleRoleLabel = ensembleRoleLabel;
    }
}
