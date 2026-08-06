package com.partitio.models;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ensembles")
public class Ensemble {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "ensemble_type")
    private String type;

    @Column(name = "member_role")
    private String role;

    @Column(name = "members_count")
    private int members;

    @Column(name = "pieces_count")
    private int pieces;

    @Column(name = "next_date")
    private String nextDate;

    @Column(name = "rehearsal_location")
    private String rehearsalLocation;

    @Column(name = "status")
    private String status;

    @Column(name = "initials")
    private String initials;

    @Column(name = "color")
    private String color;

    @Column(name = "invite_code")
    private String inviteCode;

    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "date_added", updatable = false)
    private LocalDateTime dateAdded;

    public Ensemble() {

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

    public String getInviteCode() {
        return this.inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public User getCreatedBy() {
        return this.createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getDateAdded() {
        return this.dateAdded;
    }

    public void setDateAdded(LocalDateTime dateAdded) {
        this.dateAdded = dateAdded;
    }
}
