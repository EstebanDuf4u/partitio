package com.partitio.repositories;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.partitio.models.User;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class UserRepositoryTest {
  private final UserRepository repository = Mockito.mock(
      UserRepository.class,
      Mockito.withSettings().defaultAnswer(Mockito.CALLS_REAL_METHODS));

  @Test
  void createTrimsAndNormalizesInputBeforeSave() {
    var user = user();
    when(repository.save(any(User.class))).thenReturn(user);

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
    verify(repository).save(any(User.class));
  }

  @Test
  void findByEmailReturnsTrimmedLowercaseLookup() {
    var user = user();
    when(repository.findByEmailIgnoreCase(eq("jane.doe@test.fr"))).thenReturn(Optional.of(user));

    var found = repository.findByEmail(" jane.doe@test.fr ");

    assertThat(found).contains(user);
  }

  @Test
  void findByEmailReturnsNoMatchWhenNotFound() {
    when(repository.findByEmailIgnoreCase(eq("missing@test.fr"))).thenReturn(Optional.empty());

    var found = repository.findByEmail("missing@test.fr");

    assertThat(found).isEmpty();
  }

  @Test
  void findByIdReturnsOptionalWhenFound() {
    var user = user();
    when(repository.findById(1L)).thenReturn(Optional.of(user));

    var found = repository.findById(1L);

    assertThat(found).contains(user);
  }

  @Test
  void findByEmailVerificationTokenReturnsFirstMatchingUser() {
    var user = user();
    when(repository.findByEmailVerificationToken("token")).thenReturn(Optional.of(user));

    var found = repository.findByEmailVerificationToken("token");

    assertThat(found).contains(user);
  }

  @Test
  void markEmailAsVerifiedUpdatesUserAndClearsVerificationFields() {
    var user = user();
    when(repository.findById(1L)).thenReturn(Optional.of(user));

    repository.markEmailAsVerified(1L);

    verify(repository).save(user);
    assertThat(user.isEmailVerified()).isTrue();
    assertThat(user.getEmailVerificationToken()).isNull();
    assertThat(user.getEmailVerificationExpiresAt()).isNull();
  }

  private static User user() {
    var user = new User(
        "Jane",
        "Doe",
        "jane.doe@test.fr",
        "hash",
        true,
        "token",
        OffsetDateTime.parse("2026-07-10T12:00:00Z"),
      false);
    user.setId(1L);
    user.setCreatedAt(OffsetDateTime.parse("2026-07-09T12:00:00Z"));
    return user;
  }
}
