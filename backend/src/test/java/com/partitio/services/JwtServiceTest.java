package com.partitio.services;

import static org.assertj.core.api.Assertions.assertThat;

import com.partitio.models.User;
import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;

class JwtServiceTest {
  private static final String SECRET = "01234567890123456789012345678901";

  @Test
  void generateTokenCreatesValidTokenContainingUserId() {
    var service = new JwtService(SECRET, 3600);
    var user = user();

    var token = service.generateToken(user);

    assertThat(token).isNotBlank();
    assertThat(service.isTokenValid(token)).isTrue();
    assertThat(service.getUserId(token)).isEqualTo(user.getId());
  }

  @Test
  void isTokenValidRejectsInvalidToken() {
    var service = new JwtService(SECRET, 3600);

    assertThat(service.isTokenValid("not-a-jwt")).isFalse();
    assertThat(service.isTokenValid(null)).isFalse();
  }

  private static User user() {
    var user = new User(
        "Jane",
        "Doe",
        "jane.doe@test.fr",
        "hash",
        true,
        null,
        null,
      false);
    user.setId(42L);
    user.setCreatedAt(OffsetDateTime.parse("2026-07-09T12:00:00Z"));
    return user;
  }
}
