package com.partitio.services;

import com.partitio.models.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final String jwtSecret;
    private final long jwtExpirationSeconds;

  public JwtService(
      @Value("${app.jwt.secret}") String jwtSecret,
      @Value("${app.jwt.expiration-seconds}") long jwtExpirationSeconds) {
    this.jwtSecret = jwtSecret;
    this.jwtExpirationSeconds = jwtExpirationSeconds;
  }

  public String generateToken(User user) {
    Instant now = Instant.now();
    Instant expiration = now.plusSeconds(jwtExpirationSeconds);

    return Jwts.builder()
        .subject(String.valueOf(user.getId()))
        .claim("email", user.getEmail())
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiration))
        .signWith(getSigningKey())
        .compact();
  }

  public Long getUserId(String token) {
    String subject = Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();

    return Long.valueOf(subject);
  }

  public boolean isTokenValid(String token) {
    try {
      Jwts.parser()
          .verifyWith(getSigningKey())
          .build()
          .parseSignedClaims(token);

      return true;
    } catch (JwtException | IllegalArgumentException error) {
      return false;
    }
  }

  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
  }

}
