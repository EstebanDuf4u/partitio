package com.partitio.repositories;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.partitio.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmailIgnoreCase(String email);

  Optional<User> findByEmailVerificationToken(String token);

  default User create(
      String firstName,
      String lastName,
      String email,
      String passwordHash,
      boolean acceptedTerms,
      String emailVerificationToken,
      OffsetDateTime emailVerificationExpiresAt,
      boolean is_admin) {
    var user = new User(
        firstName.trim(),
        lastName.trim(),
        email.trim().toLowerCase(),
        passwordHash,
        acceptedTerms,
        emailVerificationToken,
        emailVerificationExpiresAt,
        is_admin);
    return save(user);
  }

  default Optional<User> findByEmail(String email) {
    return findByEmailIgnoreCase(email.trim().toLowerCase());
  }

  default void markEmailAsVerified(Long id) {
    findById(id).ifPresent(user -> {
      user.setEmailVerified(true);
      user.setEmailVerificationToken(null);
      user.setEmailVerificationExpiresAt(null);
      save(user);
    });
  }
}
