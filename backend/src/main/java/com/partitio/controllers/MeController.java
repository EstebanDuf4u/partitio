package com.partitio.controllers;

import java.util.Map;

import com.partitio.dtos.UpdateUserRequest;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.partitio.dtos.ErrorResponse;
import com.partitio.dtos.UserResponse;
import com.partitio.repositories.UserRepository;
import com.partitio.services.JwtService;

@RestController
@RequestMapping("/api/me")
public class MeController {
  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final String jwtCookieName;

  public MeController(
      JwtService jwtService,
      UserRepository userRepository,
      @Value("${app.jwt.cookie-name}") String jwtCookieName) {
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.jwtCookieName = jwtCookieName;
  }

  @GetMapping
  public ResponseEntity<?> me(@CookieValue(name = "${app.jwt.cookie-name}", required = false) String token) {
    if (token == null || token.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Non authentifie."));
    }

    if (!jwtService.isTokenValid(token)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Non authentifie."));
    }

    Long userId = jwtService.getUserId(token);

    return userRepository.findById(userId)
        .<ResponseEntity<?>>map(user -> ResponseEntity.ok(Map.of("user", UserResponse.from(user))))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("Non authentifie.")));
  }

  @PatchMapping
  public ResponseEntity<?> updateMe(
      @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
      @RequestBody UpdateUserRequest request) {
    if (token == null || token.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new ErrorResponse("Non authentifie."));
    }

    if (!jwtService.isTokenValid(token)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new ErrorResponse("Non authentifie."));
    }

    Long userId = jwtService.getUserId(token);

    return userRepository.findById(userId)
        .<ResponseEntity<?>>map(user -> {
          user.setFirstName(request.firstName().trim());
          user.setLastName(request.lastName().trim());
          user.setEmail(request.email().trim().toLowerCase());

          if (request.profileImageUrl() != null
              && !request.profileImageUrl().isBlank()) {
            user.setProfileImageUrl(request.profileImageUrl());
          }

          user.setPhone(request.phone());
          user.setTown(request.town());
          user.setVoiceType(request.voiceType());

          var updatedUser = userRepository.save(user);

          return ResponseEntity.ok(
              Map.of("user", UserResponse.from(updatedUser)));
        })
        .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("Non authentifie.")));
  }

  @DeleteMapping
  public ResponseEntity<?> deleteMe(
      @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token) {
    if (token == null || token.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new ErrorResponse("Non authentifie."));
    }

    if (!jwtService.isTokenValid(token)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new ErrorResponse("Non authentifie."));
    }

    Long userId = jwtService.getUserId(token);

    if (!userRepository.existsById(userId)) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new ErrorResponse("Utilisateur introuvable."));
    }

    userRepository.deleteById(userId);

    return ResponseEntity.ok(Map.of("status", "ok"));
  }
}