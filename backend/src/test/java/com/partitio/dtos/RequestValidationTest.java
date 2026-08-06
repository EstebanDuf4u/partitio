package com.partitio.dtos;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class RequestValidationTest {
  private static Validator validator;

  @BeforeAll
  static void setUpValidator() {
    validator = Validation.buildDefaultValidatorFactory().getValidator();
  }

  @Test
  void signupRequestRejectsInvalidFields() {
    var request = new SignupRequest("", "", "not-an-email", "short", true);

    var violations = validator.validate(request);

    assertThat(violations)
        .extracting(violation -> violation.getPropertyPath().toString())
        .contains("firstName", "lastName", "email", "password");
  }

  @Test
  void loginRequestRejectsInvalidFields() {
    var request = new LoginRequest("invalid-email", "");

    var violations = validator.validate(request);

    assertThat(violations)
        .extracting(violation -> violation.getPropertyPath().toString())
        .contains("email", "password");
  }
}
