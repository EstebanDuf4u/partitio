package com.partitio.controllers;

import com.partitio.dtos.ErrorResponse;
import com.partitio.dtos.UserResponse;
import com.partitio.repositories.UserRepository;
import com.partitio.services.JwtService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
public class MeController {
  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final String jwtCookieName;

  public MeController(
      JwtService jwtService,
      UserRepository userRepository,
      @Value("${app.jwt.cookie-name}") String jwtCookieName) {
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.jwtCookieName = jwtCookieName;
  }

  @GetMapping
  public ResponseEntity<?> me(@CookieValue(name = "${app.jwt.cookie-name}", required = false) String token) {
    if (token == null || token.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new ErrorResponse("Non authentifie."));
    }

    if (!jwtService.isTokenValid(token)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new ErrorResponse("Non authentifie."));
    }

    Long userId = jwtService.getUserId(token);

    return userRepository.findById(userId)
        .<ResponseEntity<?>>map(user -> ResponseEntity.ok(Map.of("user", UserResponse.from(user))))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("Non authentifie.")));
  }
}