package com.partitio.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class WebConfigTest {
  @Test
  void corsConfigurerBeanIsCreated() {
    assertThat(new WebConfig().corsConfigurer()).isNotNull();
  }
}
