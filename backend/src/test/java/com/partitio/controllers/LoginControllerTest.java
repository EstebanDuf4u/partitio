package com.partitio.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.partitio.dtos.ErrorResponse;
import com.partitio.dtos.LoginRequest;
import com.partitio.models.User;
import com.partitio.repositories.UserRepository;
import com.partitio.services.JwtService;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

class LoginControllerTest {
  private final PasswordEncoder passwordEncoder = org.mockito.Mockito.mock(PasswordEncoder.class);
  private final UserRepository userRepository = org.mockito.Mockito.mock(UserRepository.class);
  private final JwtService jwtService = org.mockito.Mockito.mock(JwtService.class);
  private final LoginController controller = new LoginController(
      passwordEncoder,
      userRepository,
      jwtService,
      "partitio_token",
      false);

  @Test
  void loginReturnsUserAndJwtCookieWhenCredentialsAreValid() {
    var user = user(true);
    when(userRepository.findByEmail("jane.doe@test.fr")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("password123", "hashed-password")).thenReturn(true);
    when(jwtService.generateToken(user)).thenReturn("jwt-token");

    var response = controller.login(new LoginRequest("jane.doe@test.fr", "password123"));

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getHeaders().getFirst(HttpHeaders.SET_COOKIE))
        .contains("partitio_token=jwt-token", "HttpOnly", "SameSite=Lax", "Max-Age=3600");
    assertThat(response.getBody()).asString().contains("jane.doe@test.fr");
  }

  @Test
  void loginRejectsUnknownEmail() {
    when(userRepository.findByEmail("jane.doe@test.fr")).thenReturn(Optional.empty());

    var response = controller.login(new LoginRequest("jane.doe@test.fr", "password123"));

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Identifiants invalides."));
  }

  @Test
  void loginRejectsWrongPassword() {
    var user = user(true);
    when(userRepository.findByEmail("jane.doe@test.fr")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("wrong-password", "hashed-password")).thenReturn(false);

    var response = controller.login(new LoginRequest("jane.doe@test.fr", "wrong-password"));

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Identifiants invalides."));
  }

  @Test
  void loginRejectsUnverifiedEmail() {
    var user = user(false);
    when(userRepository.findByEmail("jane.doe@test.fr")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("password123", "hashed-password")).thenReturn(true);

    var response = controller.login(new LoginRequest("jane.doe@test.fr", "password123"));

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Merci de valider ton email avant de te connecter."));
  }

  private static User user(boolean emailVerified) {
    return new User(
        1L,
        "Jane",
        "Doe",
        "jane.doe@test.fr",
        "hashed-password",
        emailVerified,
        null,
        null,
        OffsetDateTime.parse("2026-07-09T12:00:00Z"),
        false);
  }
}
