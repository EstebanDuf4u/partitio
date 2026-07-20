package com.partitio.dtos;

import static org.assertj.core.api.Assertions.assertThat;

import com.partitio.models.User;
import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;

class UserResponseTest {
  @Test
  void fromMapsPublicUserFields() {
    var createdAt = OffsetDateTime.parse("2026-07-09T12:00:00Z");
    var user = new User(
        "Jane",
        "Doe",
        "jane.doe@test.fr",
        "hashed-password",
        true,
        null,
        null,
      false);
    user.setId(12L);
    user.setCreatedAt(createdAt);

    var response = UserResponse.from(user);

    assertThat(response.id()).isEqualTo(12L);
    assertThat(response.firstName()).isEqualTo("Jane");
    assertThat(response.lastName()).isEqualTo("Doe");
    assertThat(response.email()).isEqualTo("jane.doe@test.fr");
    assertThat(response.createdAt()).isEqualTo(createdAt);
  }
}
