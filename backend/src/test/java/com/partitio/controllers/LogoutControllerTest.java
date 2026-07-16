package com.partitio.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

class LogoutControllerTest {
  @Test
  void logoutExpiresJwtCookie() {
    var controller = new LogoutController("partitio_token", false);

    var response = controller.logout();

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getHeaders().getFirst(HttpHeaders.SET_COOKIE))
        .contains("partitio_token=", "Max-Age=0", "HttpOnly", "SameSite=Lax");
    assertThat(response.getBody()).asString().contains("Deconnecte.");
  }
}
