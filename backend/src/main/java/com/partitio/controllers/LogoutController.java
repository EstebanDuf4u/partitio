package com.partitio.controllers;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/logout")
public class LogoutController {
  private final String jwtCookieName;
  private final boolean jwtCookieSecure;

  public LogoutController(
      @Value("${app.jwt.cookie-name}") String jwtCookieName,
      @Value("${app.jwt.cookie-secure}") boolean jwtCookieSecure) {
    this.jwtCookieName = jwtCookieName;
    this.jwtCookieSecure = jwtCookieSecure;
  }

  // @PostMapping
  @GetMapping
  public ResponseEntity<?> logout() {
    ResponseCookie cookie = ResponseCookie.from(jwtCookieName, "")
        .httpOnly(true)
        .secure(jwtCookieSecure)
        .sameSite("Lax")
        .path("/")
        .maxAge(0)
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(Map.of("message", "Deconnecte."));
  }
}