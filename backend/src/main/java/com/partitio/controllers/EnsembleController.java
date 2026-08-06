package com.partitio.controllers;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.partitio.dtos.CreateEnsembleInvitationRequest;
import com.partitio.dtos.CreateEnsembleRequest;
import com.partitio.dtos.EnsembleDto;
import com.partitio.dtos.EnsembleInvitationDto;
import com.partitio.dtos.EnsembleMemberDto;
import com.partitio.dtos.ErrorResponse;
import com.partitio.dtos.JoinEnsembleRequest;
import com.partitio.dtos.UpdateEnsembleMemberRequest;
import com.partitio.models.Ensemble;
import com.partitio.models.EnsembleInvitation;
import com.partitio.models.EnsembleMember;
import com.partitio.models.EnsembleRole;
import com.partitio.models.User;
import com.partitio.repositories.EnsembleInvitationRepository;
import com.partitio.repositories.EnsembleMemberRepository;
import com.partitio.repositories.EnsembleRepository;
import com.partitio.repositories.UserRepository;
import com.partitio.services.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ensembles")
public class EnsembleController {
    private static final String MEMBER_ACTIVE = "active";
    private static final String MEMBER_PAUSED = "paused";
    private static final String INVITATION_PENDING = "pending";
    private static final String INVITATION_ACCEPTED = "accepted";
    private static final String INVITATION_DECLINED = "declined";
    private static final List<String> COUNTED_MEMBER_STATUSES = List.of(MEMBER_ACTIVE, MEMBER_PAUSED);
    private static final List<String> COLORS = List.of("green", "orange", "purple", "blue");

    private final EnsembleRepository ensembleRepository;
    private final EnsembleMemberRepository memberRepository;
    private final EnsembleInvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public EnsembleController(
            EnsembleRepository ensembleRepository,
            EnsembleMemberRepository memberRepository,
            EnsembleInvitationRepository invitationRepository,
            UserRepository userRepository,
            JwtService jwtService,
            @Value("${app.jwt.cookie-name}") String jwtCookieName) {
        this.ensembleRepository = ensembleRepository;
        this.memberRepository = memberRepository;
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        User user = optUser.get();
        List<EnsembleDto> ensembles = new ArrayList<>();

        memberRepository.findByUser_IdOrderByEnsemble_IdAsc(user.getId()).forEach(member -> {
            if (COUNTED_MEMBER_STATUSES.contains(member.getStatus())) {
                ensembles.add(EnsembleDto.fromMembership(member, membersCount(member.getEnsemble())));
            }
        });

        invitationRepository
                .findByEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(user.getEmail(), INVITATION_PENDING)
                .forEach(invitation -> {
                    boolean alreadyMember = memberRepository.existsByEnsemble_IdAndUser_Id(
                            invitation.getEnsemble().getId(),
                            user.getId());
                    if (!alreadyMember) {
                        ensembles.add(EnsembleDto.fromInvitation(invitation, membersCount(invitation.getEnsemble())));
                    }
                });

        return ResponseEntity.ok(ensembles);
    }

    @GetMapping("/invitations")
    public ResponseEntity<?> getInvitations(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        List<EnsembleInvitationDto> invitations = invitationRepository
                .findByEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(optUser.get().getEmail(), INVITATION_PENDING)
                .stream()
                .map(EnsembleInvitationDto::from)
                .toList();

        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        User user = optUser.get();
        Optional<EnsembleMember> optMember = memberRepository.findByEnsemble_IdAndUser_Id(id, user.getId());
        if (optMember.isPresent()) {
            EnsembleMember member = optMember.get();
            return ResponseEntity.ok(EnsembleDto.fromMembership(member, membersCount(member.getEnsemble())));
        }

        Optional<EnsembleInvitation> optInvitation = invitationRepository
                .findFirstByEnsemble_IdAndEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                        id,
                        user.getEmail(),
                        INVITATION_PENDING);
        if (optInvitation.isPresent()) {
            EnsembleInvitation invitation = optInvitation.get();
            return ResponseEntity.ok(EnsembleDto.fromInvitation(invitation, membersCount(invitation.getEnsemble())));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Ensemble introuvable."));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<?> getMembers(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        User user = optUser.get();
        Optional<EnsembleMember> optMember = memberRepository.findByEnsemble_IdAndUser_Id(id, user.getId());
        if (optMember.isEmpty() || !COUNTED_MEMBER_STATUSES.contains(optMember.get().getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Tu dois faire partie de cet ensemble."));
        }

        List<EnsembleMemberDto> members = memberRepository
                .findByEnsemble_IdAndStatusInOrderByIdAsc(id, COUNTED_MEMBER_STATUSES)
                .stream()
                .map(member -> EnsembleMemberDto.from(member, user.getId()))
                .toList();

        return ResponseEntity.ok(members);
    }

    @PatchMapping("/{id}/members/{memberId}")
    public ResponseEntity<?> updateMember(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id,
            @PathVariable long memberId,
            @RequestBody UpdateEnsembleMemberRequest request) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        User user = optUser.get();
        Optional<EnsembleMember> optAdmin = memberRepository.findByEnsemble_IdAndUser_Id(id, user.getId());
        if (optAdmin.isEmpty() || !isActiveAdmin(optAdmin.get())) {
            return forbiddenAdmin();
        }

        Optional<EnsembleMember> optMember = memberRepository.findByIdAndEnsemble_Id(memberId, id);
        if (optMember.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Membre introuvable."));
        }

        EnsembleMember member = optMember.get();
        EnsembleRole nextRole = member.getEnsembleRole() == null
                ? EnsembleRole.PARTICIPANT
                : member.getEnsembleRole();

        if (request.ensembleRole() != null && !request.ensembleRole().isBlank()) {
            nextRole = parseEnsembleRole(request.ensembleRole());
        }

        if (nextRole != EnsembleRole.ADMIN && isLastActiveAdmin(member)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Impossible de retirer le dernier admin de l'ensemble."));
        }

        member.setEnsembleRole(nextRole);
        member.setRole(valueOrDefault(request.role(), member.getRole()));
        member = memberRepository.save(member);

        return ResponseEntity.ok(EnsembleMemberDto.from(member, user.getId()));
    }

    @DeleteMapping("/{id}/members/{memberId}")
    public ResponseEntity<?> removeMember(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id,
            @PathVariable long memberId) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        User user = optUser.get();
        Optional<EnsembleMember> optAdmin = memberRepository.findByEnsemble_IdAndUser_Id(id, user.getId());
        if (optAdmin.isEmpty() || !isActiveAdmin(optAdmin.get())) {
            return forbiddenAdmin();
        }

        Optional<EnsembleMember> optMember = memberRepository.findByIdAndEnsemble_Id(memberId, id);
        if (optMember.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Membre introuvable."));
        }

        EnsembleMember member = optMember.get();
        if (isLastActiveAdmin(member)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Impossible de retirer le dernier admin de l'ensemble."));
        }

        memberRepository.delete(member);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/{id}/invitations")
    public ResponseEntity<?> getSentInvitations(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        Optional<EnsembleMember> optAdmin = memberRepository.findByEnsemble_IdAndUser_Id(id, optUser.get().getId());
        if (optAdmin.isEmpty() || !isActiveAdmin(optAdmin.get())) {
            return forbiddenAdmin();
        }

        List<EnsembleInvitationDto> invitations = invitationRepository
                .findByEnsemble_IdAndStatusOrderByCreatedAtDesc(id, INVITATION_PENDING)
                .stream()
                .map(EnsembleInvitationDto::from)
                .toList();

        return ResponseEntity.ok(invitations);
    }

    @DeleteMapping("/{id}/invitations/{invitationId}")
    public ResponseEntity<?> cancelInvitation(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id,
            @PathVariable long invitationId) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        Optional<EnsembleMember> optAdmin = memberRepository.findByEnsemble_IdAndUser_Id(id, optUser.get().getId());
        if (optAdmin.isEmpty() || !isActiveAdmin(optAdmin.get())) {
            return forbiddenAdmin();
        }

        Optional<EnsembleInvitation> optInvitation = invitationRepository.findByIdAndEnsemble_Id(invitationId, id);
        if (optInvitation.isEmpty() || !INVITATION_PENDING.equals(optInvitation.get().getStatus())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Invitation introuvable."));
        }

        invitationRepository.delete(optInvitation.get());
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping
    public ResponseEntity<?> create(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @Valid @RequestBody CreateEnsembleRequest request) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        User user = optUser.get();
        String role = valueOrDefault(request.role(), "Responsable");

        Ensemble ensemble = new Ensemble();
        ensemble.setName(request.name().trim());
        ensemble.setType(valueOrDefault(request.type(), "Ensemble vocal"));
        ensemble.setRole(role);
        ensemble.setMembers(1);
        ensemble.setPieces(0);
        ensemble.setNextDate(valueOrDefault(request.nextDate(), "A planifier"));
        ensemble.setRehearsalLocation(blankToNull(request.rehearsalLocation()));
        ensemble.setStatus("Actif");
        ensemble.setInitials(initialsFrom(request.name()));
        ensemble.setColor(validColor(request.color()));
        ensemble.setInviteCode(generateEnsembleInviteCode());
        ensemble.setCreatedBy(user);

        Ensemble savedEnsemble = ensembleRepository.save(ensemble);
        EnsembleMember member = memberRepository.save(
                new EnsembleMember(savedEnsemble, user, role, EnsembleRole.ADMIN, MEMBER_ACTIVE));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(EnsembleDto.fromMembership(member, membersCount(savedEnsemble)));
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @Valid @RequestBody JoinEnsembleRequest request) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        User user = optUser.get();
        String inviteCode = request.inviteCode().trim();

        Optional<EnsembleInvitation> optInvitation = invitationRepository.findByInviteTokenIgnoreCase(inviteCode);
        if (optInvitation.isPresent()) {
            return acceptInvitationForUser(optInvitation.get(), user);
        }

        Optional<Ensemble> optEnsemble = ensembleRepository.findByInviteCodeIgnoreCase(inviteCode);
        if (optEnsemble.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Invitation introuvable."));
        }

        Ensemble ensemble = optEnsemble.get();
        if (memberRepository.existsByEnsemble_IdAndUser_Id(ensemble.getId(), user.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Tu fais deja partie de cet ensemble."));
        }

        String role = valueOrDefault(request.role(), "Choriste");
        EnsembleMember member = memberRepository.save(
                new EnsembleMember(ensemble, user, role, EnsembleRole.PARTICIPANT, MEMBER_ACTIVE));

        invitationRepository
                .findFirstByEnsemble_IdAndEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                        ensemble.getId(),
                        user.getEmail(),
                        INVITATION_PENDING)
                .ifPresent(invitation -> {
                    invitation.setStatus(INVITATION_ACCEPTED);
                    invitation.setRespondedAt(OffsetDateTime.now(ZoneOffset.UTC));
                    invitationRepository.save(invitation);
                });

        return ResponseEntity.ok(EnsembleDto.fromMembership(member, membersCount(ensemble)));
    }

    @PostMapping("/{id}/invitations")
    public ResponseEntity<?> invite(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id,
            @Valid @RequestBody CreateEnsembleInvitationRequest request) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        User inviter = optUser.get();
        Optional<Ensemble> optEnsemble = ensembleRepository.findById(id);
        if (optEnsemble.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Ensemble introuvable."));
        }

        Ensemble ensemble = optEnsemble.get();
        Optional<EnsembleMember> optInviterMember = memberRepository.findByEnsemble_IdAndUser_Id(id, inviter.getId());
        if (optInviterMember.isEmpty() || !isActiveAdmin(optInviterMember.get())) {
            return forbiddenAdmin();
        }

        String email = request.email().trim().toLowerCase();
        Optional<User> invitedUser = userRepository.findByEmail(email);
        if (invitedUser.isPresent() && memberRepository.existsByEnsemble_IdAndUser_Id(id, invitedUser.get().getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Cet utilisateur fait deja partie de l'ensemble."));
        }

        Optional<EnsembleInvitation> existingInvitation = invitationRepository
                .findFirstByEnsemble_IdAndEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                        id,
                        email,
                        INVITATION_PENDING);
        if (existingInvitation.isPresent()) {
            return ResponseEntity.ok(Map.of("invitation", EnsembleInvitationDto.from(existingInvitation.get())));
        }

        EnsembleInvitation invitation = new EnsembleInvitation(
                ensemble,
                email,
                valueOrDefault(request.role(), "Choriste"),
                parseEnsembleRole(request.ensembleRole()),
                generateInvitationToken(),
                INVITATION_PENDING,
                inviter);
        invitation = invitationRepository.save(invitation);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("invitation", EnsembleInvitationDto.from(invitation)));
    }

    @PostMapping("/invitations/{id}/accept")
    public ResponseEntity<?> acceptInvitation(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        Optional<EnsembleInvitation> optInvitation = invitationRepository.findByIdAndEmailIgnoreCase(
                id,
                optUser.get().getEmail());
        if (optInvitation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Invitation introuvable."));
        }

        return acceptInvitationForUser(optInvitation.get(), optUser.get());
    }

    @PostMapping("/invitations/{id}/decline")
    public ResponseEntity<?> declineInvitation(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        Optional<EnsembleInvitation> optInvitation = invitationRepository.findByIdAndEmailIgnoreCase(
                id,
                optUser.get().getEmail());
        if (optInvitation.isEmpty() || !INVITATION_PENDING.equals(optInvitation.get().getStatus())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Invitation introuvable."));
        }

        EnsembleInvitation invitation = optInvitation.get();
        invitation.setStatus(INVITATION_DECLINED);
        invitation.setRespondedAt(OffsetDateTime.now(ZoneOffset.UTC));
        invitationRepository.save(invitation);

        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @DeleteMapping("/{id}/members/me")
    public ResponseEntity<?> leave(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return unauthorized();
        }

        Optional<EnsembleMember> optMember = memberRepository.findByEnsemble_IdAndUser_Id(id, optUser.get().getId());
        if (optMember.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Adhesion introuvable."));
        }

        EnsembleMember member = optMember.get();
        if (isLastActiveAdmin(member)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Impossible de quitter l'ensemble sans autre admin."));
        }

        memberRepository.delete(member);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    private ResponseEntity<?> acceptInvitationForUser(EnsembleInvitation invitation, User user) {
        if (!INVITATION_PENDING.equals(invitation.getStatus())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("Cette invitation n'est plus active."));
        }

        if (!invitation.getEmail().equalsIgnoreCase(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Cette invitation ne correspond pas a ton compte."));
        }

        Ensemble ensemble = invitation.getEnsemble();
        Optional<EnsembleMember> existingMember = memberRepository.findByEnsemble_IdAndUser_Id(ensemble.getId(), user.getId());
        EnsembleMember member = existingMember.orElseGet(
                () -> new EnsembleMember(
                        ensemble,
                        user,
                        invitation.getRole(),
                        invitation.getEnsembleRole(),
                        MEMBER_ACTIVE));
        member.setStatus(MEMBER_ACTIVE);
        member.setRole(valueOrDefault(member.getRole(), invitation.getRole()));
        member.setEnsembleRole(invitation.getEnsembleRole());
        member = memberRepository.save(member);

        invitation.setStatus(INVITATION_ACCEPTED);
        invitation.setRespondedAt(OffsetDateTime.now(ZoneOffset.UTC));
        invitationRepository.save(invitation);

        return ResponseEntity.ok(EnsembleDto.fromMembership(member, membersCount(ensemble)));
    }

    private Optional<User> currentUser(String token) {
        if (token == null || token.isBlank() || !jwtService.isTokenValid(token)) {
            return Optional.empty();
        }

        return userRepository.findById(jwtService.getUserId(token));
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Non authentifie."));
    }

    private ResponseEntity<?> forbiddenAdmin() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse("Tu dois etre admin de cet ensemble."));
    }

    private int membersCount(Ensemble ensemble) {
        return Math.toIntExact(memberRepository.countByEnsemble_IdAndStatusIn(
                ensemble.getId(),
                COUNTED_MEMBER_STATUSES));
    }

    private boolean isActiveAdmin(EnsembleMember member) {
        return COUNTED_MEMBER_STATUSES.contains(member.getStatus())
                && member.getEnsembleRole() == EnsembleRole.ADMIN;
    }

    private boolean isLastActiveAdmin(EnsembleMember member) {
        return member.getEnsembleRole() == EnsembleRole.ADMIN
                && memberRepository.countByEnsemble_IdAndEnsembleRoleAndStatusIn(
                        member.getEnsemble().getId(),
                        EnsembleRole.ADMIN,
                        COUNTED_MEMBER_STATUSES) <= 1;
    }

    private String valueOrDefault(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String validColor(String color) {
        if (color != null && COLORS.contains(color.trim())) {
            return color.trim();
        }
        return "green";
    }

    private EnsembleRole parseEnsembleRole(String value) {
        if (value == null || value.isBlank()) {
            return EnsembleRole.PARTICIPANT;
        }

        try {
            return EnsembleRole.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException error) {
            return EnsembleRole.PARTICIPANT;
        }
    }

    private String initialsFrom(String name) {
        String trimmedName = valueOrDefault(name, "Ensemble");
        String[] words = trimmedName.split("\\s+");
        if (words.length == 1) {
            return words[0].substring(0, Math.min(2, words[0].length())).toUpperCase();
        }
        return (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase();
    }

    private String generateEnsembleInviteCode() {
        String inviteCode;
        do {
            inviteCode = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        } while (ensembleRepository.findByInviteCodeIgnoreCase(inviteCode).isPresent());
        return inviteCode;
    }

    private String generateInvitationToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
        } while (invitationRepository.findByInviteTokenIgnoreCase(token).isPresent());
        return token;
    }
}
