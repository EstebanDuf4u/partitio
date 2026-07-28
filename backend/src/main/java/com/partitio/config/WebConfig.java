package com.partitio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
  @Bean
  WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedMethods("GET", "POST", "OPTIONS").allowedOrigins("*");
        registry.addMapping("/api/logout").allowedMethods("GET", "POST", "OPTIONS").allowedOrigins("*");
      }

      @Override
      public void addResourceHandlers(ResourceHandlerRegistry registry) {
          System.out.println(">>> addResourceHandlers appelé");

          registry.addResourceHandler("/uploads/**")
                  .addResourceLocations("file:/uploads/");
      }
    };
  }
}
