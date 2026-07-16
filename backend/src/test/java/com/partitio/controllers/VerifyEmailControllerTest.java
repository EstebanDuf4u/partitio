package com.partitio.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.partitio.dtos.ErrorResponse;
import com.partitio.models.User;
import com.partitio.repositories.UserRepository;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class VerifyEmailControllerTest {
  private final UserRepository userRepository = org.mockito.Mockito.mock(UserRepository.class);
  private final VerifyEmailController controller = new VerifyEmailController(userRepository);

  @Test
  void verifyEmailRejectsUnknownToken() {
    when(userRepository.findByEmailVerificationToken("unknown")).thenReturn(Optional.empty());

    var response = controller.verifyEmail("unknown");

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Lien de validation invalide."));
  }

  @Test
  void verifyEmailRejectsExpiredToken() {
    when(userRepository.findByEmailVerificationToken("expired"))
        .thenReturn(Optional.of(user(OffsetDateTime.now(ZoneOffset.UTC).minusMinutes(1))));

    var response = controller.verifyEmail("expired");

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Lien de validation expire."));
  }

  @Test
  void verifyEmailMarksUserAsVerified() {
    when(userRepository.findByEmailVerificationToken("valid"))
        .thenReturn(Optional.of(user(OffsetDateTime.now(ZoneOffset.UTC).plusHours(1))));

    var response = controller.verifyEmail("valid");

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).asString().contains("Email valide avec succes.");
    verify(userRepository).markEmailAsVerified(1L);
  }

  private static User user(OffsetDateTime expiresAt) {
    return new User(
        1L,
        "Jane",
        "Doe",
        "jane.doe@test.fr",
        "hashed-password",
        false,
        "token",
        expiresAt,
        OffsetDateTime.parse("2026-07-09T12:00:00Z"),
        false);
  }
}
