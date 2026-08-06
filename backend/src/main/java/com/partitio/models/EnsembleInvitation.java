package com.partitio.models;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ensemble_invitations")
public class EnsembleInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ensemble_id", nullable = false)
    private Ensemble ensemble;

    @Column(name = "email")
    private String email;

    @Column(name = "member_role")
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(name = "ensemble_role")
    private EnsembleRole ensembleRole;

    @Column(name = "invite_token")
    private String inviteToken;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "invited_by_user_id")
    private User invitedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "responded_at")
    private OffsetDateTime respondedAt;

    public EnsembleInvitation() {

    }

    public EnsembleInvitation(Ensemble ensemble, String email, String role, String inviteToken, String status,
            User invitedBy) {
        this(ensemble, email, role, EnsembleRole.PARTICIPANT, inviteToken, status, invitedBy);
    }

    public EnsembleInvitation(Ensemble ensemble, String email, String role, EnsembleRole ensembleRole, String inviteToken,
            String status, User invitedBy) {
        this.ensemble = ensemble;
        this.email = email;
        this.role = role;
        this.ensembleRole = ensembleRole;
        this.inviteToken = inviteToken;
        this.status = status;
        this.invitedBy = invitedBy;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ensemble getEnsemble() {
        return this.ensemble;
    }

    public void setEnsemble(Ensemble ensemble) {
        this.ensemble = ensemble;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public EnsembleRole getEnsembleRole() {
        return this.ensembleRole;
    }

    public void setEnsembleRole(EnsembleRole ensembleRole) {
        this.ensembleRole = ensembleRole;
    }

    public String getInviteToken() {
        return this.inviteToken;
    }

    public void setInviteToken(String inviteToken) {
        this.inviteToken = inviteToken;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getInvitedBy() {
        return this.invitedBy;
    }

    public void setInvitedBy(User invitedBy) {
        this.invitedBy = invitedBy;
    }

    public OffsetDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getRespondedAt() {
        return this.respondedAt;
    }

    public void setRespondedAt(OffsetDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
}
