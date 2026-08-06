package com.partitio.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PasswordConfigTest {
  @Test
  void passwordEncoderUsesBCryptAndCanVerifyPasswords() {
    var encoder = new PasswordConfig().passwordEncoder();

    var hash = encoder.encode("password123");

    assertThat(hash).startsWith("$2");
    assertThat(encoder.matches("password123", hash)).isTrue();
    assertThat(encoder.matches("wrong-password", hash)).isFalse();
  }
}
