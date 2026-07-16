package com.partitio.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

class HealthControllerTest {
  @Test
  void healthChecksDatabaseAndReturnsOk() {
    var jdbcTemplate = org.mockito.Mockito.mock(JdbcTemplate.class);
    when(jdbcTemplate.queryForObject("SELECT 1", Integer.class)).thenReturn(1);

    var response = new HealthController(jdbcTemplate).health();

    assertThat(response).containsEntry("status", "ok");
    verify(jdbcTemplate).queryForObject("SELECT 1", Integer.class);
  }
}
