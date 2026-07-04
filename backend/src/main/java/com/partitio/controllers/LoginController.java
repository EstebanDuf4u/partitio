package com.partitio.controllers;

import com.partitio.dtos.ErrorResponse;
import com.partitio.dtos.LoginRequest;
import com.partitio.dtos.UserResponse;
import com.partitio.repositories.UserRepository;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.partitio.services.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

@RestController
@RequestMapping("/api/login")
public class LoginController {
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final String jwtCookieName;
  private final boolean jwtCookieSecure;

  public LoginController(
      PasswordEncoder passwordEncoder,
      UserRepository userRepository,
      JwtService jwtService,
      @Value("${app.jwt.cookie-name}") String jwtCookieName,
      @Value("${app.jwt.cookie-secure}") boolean jwtCookieSecure) {
    this.passwordEncoder = passwordEncoder;
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.jwtCookieName = jwtCookieName;
    this.jwtCookieSecure = jwtCookieSecure;
  }

  @PostMapping
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    return userRepository.findByEmail(request.email())
        .filter(user -> passwordEncoder.matches(request.password(), user.passwordHash()))
        .<ResponseEntity<?>>map(user -> {
          if (!user.emailVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse("Merci de valider ton email avant de te connecter."));
          }

          String token = jwtService.generateToken(user);

          ResponseCookie cookie = ResponseCookie.from(jwtCookieName, token)
              .httpOnly(true)
              .secure(jwtCookieSecure)
              .sameSite("Lax")
              .path("/")
              .maxAge(3600)
              .build();

          return ResponseEntity.ok()
              .header(HttpHeaders.SET_COOKIE, cookie.toString())
              .body(Map.of("user", UserResponse.from(user)));
        })
        .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("Identifiants invalides.")));
  }
}
