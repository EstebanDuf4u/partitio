package com.partitio.repositories;

import com.partitio.models.User;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
  private final JdbcTemplate jdbcTemplate;

  public UserRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public User create(String firstName, String lastName, String email, String passwordHash, boolean acceptedTerms) {
    return jdbcTemplate.queryForObject(
        """
            INSERT INTO users (first_name, last_name, email, password_hash, accepted_terms)
            VALUES (?, ?, LOWER(?), ?, ?)
            RETURNING id, first_name, last_name, email, password_hash, created_at
            """,
        this::mapUser,
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        passwordHash,
        acceptedTerms);
  }
  public Optional<User> findByEmail(String email) {
    var users = jdbcTemplate.query(
        """
            SELECT id, first_name, last_name, email, password_hash, created_at
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
          SELECT id, first_name, last_name, email, password_hash, created_at
          FROM users
          WHERE id = ?
          """,
      this::mapUser,
      id);

  return users.stream().findFirst();
}


  private User mapUser(ResultSet resultSet, int rowNumber) throws SQLException {
    return new User(
        resultSet.getLong("id"),
        resultSet.getString("first_name"),
        resultSet.getString("last_name"),
        resultSet.getString("email"),
        resultSet.getString("password_hash"),
        resultSet.getObject("created_at", java.time.OffsetDateTime.class));
  }


}
