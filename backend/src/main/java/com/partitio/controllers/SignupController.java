package com.partitio.controllers;

import com.partitio.dtos.ErrorResponse;
import com.partitio.dtos.SignupRequest;
import com.partitio.dtos.UserResponse;
import com.partitio.repositories.UserRepository;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/signup")
public class SignupController {
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  public SignupController(PasswordEncoder passwordEncoder, UserRepository userRepository) {
    this.passwordEncoder = passwordEncoder;
    this.userRepository = userRepository;
  }

  @PostMapping
  public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
    if (!request.terms()) {
      return ResponseEntity.badRequest().body(new ErrorResponse("Tu dois accepter les conditions generales."));
    }

    try {
      var user = userRepository.create(
          request.firstName(),
          request.lastName(),
          request.email(),
          passwordEncoder.encode(request.password()),
          request.terms());

      return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("user", UserResponse.from(user)));
    } catch (DuplicateKeyException error) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(new ErrorResponse("Cette adresse mail est deja utilisee."));
    }
  }
}
