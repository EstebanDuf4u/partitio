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

@RestController
@RequestMapping("/api/login")
public class LoginController {
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  public LoginController(PasswordEncoder passwordEncoder, UserRepository userRepository) {
    this.passwordEncoder = passwordEncoder;
    this.userRepository = userRepository;
  }

  @PostMapping
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    return userRepository.findByEmail(request.email())
        .filter(user -> passwordEncoder.matches(request.password(), user.passwordHash()))
        .<ResponseEntity<?>>map(user -> ResponseEntity.ok(Map.of("user", UserResponse.from(user))))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("Identifiants invalides.")));
  }
}
