package com.partitio.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.partitio.dtos.ErrorResponse;
import com.partitio.dtos.SignupRequest;
import com.partitio.models.User;
import com.partitio.repositories.UserRepository;
import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

class SignupControllerTest {
  private final PasswordEncoder passwordEncoder = org.mockito.Mockito.mock(PasswordEncoder.class);
  private final UserRepository userRepository = org.mockito.Mockito.mock(UserRepository.class);
  private final SignupController controller = new SignupController(passwordEncoder, userRepository);

  @Test
  void signupCreatesUserAndReturnsVerificationLink() {
    var request = new SignupRequest(" Jane ", " Doe ", "Jane.Doe@Test.fr", "password123", true);
    var user = user(false);
    when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
    when(userRepository.save(any(User.class))).thenReturn(user);

    var response = controller.signup(request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).asString().contains("verificationLink");
    assertThat(response.getBody()).asString().contains("jane.doe@test.fr");
  }

  @Test
  void signupRejectsMissingTerms() {
    var request = new SignupRequest("Jane", "Doe", "jane.doe@test.fr", "password123", false);

    var response = controller.signup(request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Tu dois accepter les conditions generales."));
    verify(userRepository, never()).save(any());
  }

  @Test
  void signupReturnsConflictWhenEmailAlreadyExists() {
    var request = new SignupRequest("Jane", "Doe", "jane.doe@test.fr", "password123", true);
    when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
    when(userRepository.save(any(User.class))).thenThrow(new DataIntegrityViolationException("duplicate"));

    var response = controller.signup(request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    assertThat(response.getBody()).isEqualTo(new ErrorResponse("Cette adresse mail est deja utilisee."));
  }

  private static User user(boolean admin) {
    var user = new User(
        "Jane",
        "Doe",
        "jane.doe@test.fr",
        "encoded-password",
        true,
        "token",
        OffsetDateTime.now().plusDays(1),
      false);
    user.setId(1L);
    user.setEmailVerified(admin);
    user.setCreatedAt(OffsetDateTime.parse("2026-07-09T12:00:00Z"));
    return user;
  }
}
