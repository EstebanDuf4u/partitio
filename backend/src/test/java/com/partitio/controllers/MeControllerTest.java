package com.partitio.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.partitio.dtos.ErrorResponse;
import com.partitio.models.User;
import com.partitio.repositories.UserRepository;
import com.partitio.services.JwtService;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class MeControllerTest {
  private final JwtService jwtService = org.mockito.Mockito.mock(JwtService.class);
  private final UserRepository userRepository = org.mockito.Mockito.mock(UserRepository.class);
  private final MeController controller = new MeController(jwtService, userRepository, "partitio_token");

  @Test
  void meRejectsMissingToken() {
    var response = controller.me(null);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Non authentifie."));
  }

  @Test
  void meRejectsInvalidToken() {
    when(jwtService.isTokenValid("bad-token")).thenReturn(false);

    var response = controller.me("bad-token");

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Non authentifie."));
  }

  @Test
  void meRejectsMissingUser() {
    when(jwtService.isTokenValid("valid-token")).thenReturn(true);
    when(jwtService.getUserId("valid-token")).thenReturn(1L);
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    var response = controller.me("valid-token");

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Non authentifie."));
  }

  @Test
  void meReturnsCurrentUser() {
    var user = user();
    when(jwtService.isTokenValid("valid-token")).thenReturn(true);
    when(jwtService.getUserId("valid-token")).thenReturn(1L);
    when(userRepository.findById(1L)).thenReturn(Optional.of(user));

    var response = controller.me("valid-token");

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).asString().contains("jane.doe@test.fr");
  }

  private static User user() {
    var user = new User(
        "Jane",
        "Doe",
        "jane.doe@test.fr",
        "hashed-password",
        true,
        null,
        null,
        false);
    user.setId(1L);
    user.setEmailVerified(true);
    user.setCreatedAt(OffsetDateTime.parse("2026-07-09T12:00:00Z"));
    return user;
  }
}
