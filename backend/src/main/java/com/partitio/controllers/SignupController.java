package com.partitio.controllers;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.partitio.dtos.ErrorResponse;
import com.partitio.dtos.SignupRequest;
import com.partitio.dtos.UserResponse;
import com.partitio.models.User;
import com.partitio.repositories.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/signup")
public class SignupController {
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  public SignupController(PasswordEncoder passwordEncoder, UserRepository userRepository) {
    this.passwordEncoder = passwordEncoder;
    this.userRepository = userRepository;
  }

  /**
   * Méthode appelée pour la création d'un nouvel utilisateur
   * 
   * @param request
   * @return
   */
  @PostMapping
  public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
    if (!request.terms()) {
      return ResponseEntity.badRequest().body(new ErrorResponse("Tu dois accepter les conditions generales."));
    }

    try {
      var emailVerificationToken = UUID.randomUUID().toString();
      var emailVerificationExpiresAt = OffsetDateTime.now(ZoneOffset.UTC).plusHours(24);
      var normalizedEmail = request.email().trim().toLowerCase();

      var user = new User(
          request.firstName().trim(),
          request.lastName().trim(),
          normalizedEmail,
          passwordEncoder.encode(request.password()),
          request.terms(),
          emailVerificationToken,
          emailVerificationExpiresAt,
          false);
      user = userRepository.save(user);

      // TODO URL en dur, attention, à voir pour mettre dans une variable
      // d'environnement
      var verificationLink = "http://localhost:8081/api/verify-email?token=" + emailVerificationToken;

      return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
          "user", UserResponse.from(user),
          "verificationLink", verificationLink));
    } catch (DataIntegrityViolationException error) {

      // erreur 409 (HTTP conflict) si duplication de données définie comme unique en
      // BDD
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(new ErrorResponse("Cette adresse mail est deja utilisee."));
    }
  }
}
