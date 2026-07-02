package com.partitio.repositories;

import com.partitio.models.User;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
  private final JdbcTemplate jdbcTemplate;

  public UserRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public User create(
      String firstName,
      String lastName,
      String email,
      String passwordHash,
      boolean acceptedTerms,
      String emailVerificationToken,
      OffsetDateTime emailVerificationExpiresAt) {
    return jdbcTemplate.queryForObject(
        """
            INSERT INTO users (
              first_name,
              last_name,
              email,
              password_hash,
              accepted_terms,
              email_verification_token,
              email_verification_expires_at
            )
            VALUES (?, ?, LOWER(?), ?, ?, ?, ?)
            RETURNING id, first_name, last_name, email, password_hash,
              email_verified, email_verification_token, email_verification_expires_at,
              created_at
            """,
        this::mapUser,
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        passwordHash,
        acceptedTerms,
        emailVerificationToken,
        emailVerificationExpiresAt);
  }

  public Optional<User> findByEmail(String email) {
    var users = jdbcTemplate.query(
        """
            SELECT id, first_name, last_name, email, password_hash,
              email_verified, email_verification_token, email_verification_expires_at,
              created_at
            FROM users
            WHERE email = LOWER(?)
            """,
        this::mapUser,
        email.trim());

    return users.stream().findFirst();
  }

  public Optional<User> findById(long id) {
    var users = jdbcTemplate.query(
        """
            SELECT id, first_name, last_name, email, password_hash,
              email_verified, email_verification_token, email_verification_expires_at,
              created_at
            FROM users
            WHERE id = ?
            """,
        this::mapUser,
        id);

    return users.stream().findFirst();
  }

  public Optional<User> findByEmailVerificationToken(String token) {
    var users = jdbcTemplate.query(
        """
            SELECT id, first_name, last_name, email, password_hash,
              email_verified, email_verification_token, email_verification_expires_at,
              created_at
            FROM users
            WHERE email_verification_token = ?
            """,
        this::mapUser,
        token);

    return users.stream().findFirst();
  }

  public void markEmailAsVerified(long userId) {
    jdbcTemplate.update(
        """
            UPDATE users
            SET email_verified = true,
                email_verification_token = NULL,
                email_verification_expires_at = NULL
            WHERE id = ?
            """,
        userId);
  }

  private User mapUser(ResultSet resultSet, int rowNumber) throws SQLException {
    return new User(
        resultSet.getLong("id"),
        resultSet.getString("first_name"),
        resultSet.getString("last_name"),
        resultSet.getString("email"),
        resultSet.getString("password_hash"),
        resultSet.getBoolean("email_verified"),
        resultSet.getString("email_verification_token"),
        resultSet.getObject("email_verification_expires_at", OffsetDateTime.class),
        resultSet.getObject("created_at", OffsetDateTime.class));
  }
}
