package com.partitio.controllers;

import com.partitio.dtos.ErrorResponse;
import com.partitio.repositories.UserRepository;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/verify-email")
public class VerifyEmailController {
  private final UserRepository userRepository;

  public VerifyEmailController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping
  public ResponseEntity<?> verifyEmail(@RequestParam String token) {
    var userOptional = userRepository.findByEmailVerificationToken(token);

    if (userOptional.isEmpty()) {
      return ResponseEntity.badRequest().body(new ErrorResponse("Lien de validation invalide."));
    }

    var user = userOptional.get();

    if (user.getEmailVerificationExpiresAt() == null
        || user.getEmailVerificationExpiresAt().isBefore(OffsetDateTime.now(ZoneOffset.UTC))) {
      return ResponseEntity.badRequest().body(new ErrorResponse("Lien de validation expire."));
    }

    user.setEmailVerified(true);
    user.setEmailVerificationToken(null);
    user.setEmailVerificationExpiresAt(null);
    userRepository.save(user);

    return ResponseEntity.ok(Map.of("message", "Email valide avec succes."));
  }
}
