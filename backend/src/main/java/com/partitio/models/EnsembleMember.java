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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "ensemble_members", uniqueConstraints = {
        @UniqueConstraint(name = "ensemble_members_ensemble_user_unique", columnNames = { "ensemble_id", "user_id" })
})
public class EnsembleMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ensemble_id", nullable = false)
    private Ensemble ensemble;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "member_role")
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(name = "ensemble_role")
    private EnsembleRole ensembleRole;

    @Column(name = "status")
    private String status;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private OffsetDateTime joinedAt;

    public EnsembleMember() {

    }

    public EnsembleMember(Ensemble ensemble, User user, String role, String status) {
        this(ensemble, user, role, EnsembleRole.PARTICIPANT, status);
    }

    public EnsembleMember(Ensemble ensemble, User user, String role, EnsembleRole ensembleRole, String status) {
        this.ensemble = ensemble;
        this.user = user;
        this.role = role;
        this.ensembleRole = ensembleRole;
        this.status = status;
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

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getJoinedAt() {
        return this.joinedAt;
    }

    public void setJoinedAt(OffsetDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
