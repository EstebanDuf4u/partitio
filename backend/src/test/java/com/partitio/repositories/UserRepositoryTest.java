package com.partitio.repositories;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.partitio.models.User;
import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

class UserRepositoryTest {
  private final JdbcTemplate jdbcTemplate = org.mockito.Mockito.mock(JdbcTemplate.class);
  private final UserRepository repository = new UserRepository(jdbcTemplate);

  @Test
  void createTrimsNamesAndEmailBeforeInsert() {
    var user = user();
    when(jdbcTemplate.queryForObject(
        anyString(),
        org.mockito.ArgumentMatchers.<RowMapper<User>>any(),
        eq("Jane"),
        eq("Doe"),
        eq("Jane.Doe@Test.fr"),
        eq("hash"),
        eq(true),
        eq("verification-token"),
        any(OffsetDateTime.class),
        eq(false))).thenReturn(user);

    var created = repository.create(
        " Jane ",
        " Doe ",
        " Jane.Doe@Test.fr ",
        "hash",
        true,
        "verification-token",
        OffsetDateTime.parse("2026-07-10T12:00:00Z"),
        false);

    assertThat(created).isEqualTo(user);
  }

  @Test
  void findByEmailReturnsFirstMatchingUser() {
    var user = user();
    when(jdbcTemplate.query(
        anyString(),
        org.mockito.ArgumentMatchers.<RowMapper<User>>any(),
        eq("jane.doe@test.fr")))
        .thenReturn(List.of(user));

    var found = repository.findByEmail(" jane.doe@test.fr ");

    assertThat(found).contains(user);
  }

  @Test
  void findByEmailReturnsEmptyWhenNoUserMatches() {
    when(jdbcTemplate.query(
        anyString(),
        org.mockito.ArgumentMatchers.<RowMapper<User>>any(),
        eq("missing@test.fr")))
        .thenReturn(List.of());

    var found = repository.findByEmail("missing@test.fr");

    assertThat(found).isEmpty();
  }

  @Test
  void findByIdReturnsFirstMatchingUser() {
    var user = user();
    when(jdbcTemplate.query(anyString(), org.mockito.ArgumentMatchers.<RowMapper<User>>any(), eq(1L)))
        .thenReturn(List.of(user));

    var found = repository.findById(1L);

    assertThat(found).contains(user);
  }

  @Test
  void findByEmailVerificationTokenReturnsFirstMatchingUser() {
    var user = user();
    when(jdbcTemplate.query(anyString(), org.mockito.ArgumentMatchers.<RowMapper<User>>any(), eq("token")))
        .thenReturn(List.of(user));

    var found = repository.findByEmailVerificationToken("token");

    assertThat(found).contains(user);
  }

  @Test
  void markEmailAsVerifiedUpdatesUserAndClearsVerificationFields() {
    repository.markEmailAsVerified(1L);

    verify(jdbcTemplate).update(anyString(), eq(1L));
  }

  private static User user() {
    return new User(
        1L,
        "Jane",
        "Doe",
        "jane.doe@test.fr",
        "hash",
        false,
        "token",
        OffsetDateTime.parse("2026-07-10T12:00:00Z"),
        OffsetDateTime.parse("2026-07-09T12:00:00Z"),
        false);
  }
}
