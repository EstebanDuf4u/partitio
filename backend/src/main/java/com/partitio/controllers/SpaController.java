package com.partitio.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
  @GetMapping({
      "/",
      "/signup",
      "/login",
      "/dashboard",
      "/piece",
      "/profilpage",
      "/documents",
      "/ensembles",
      "/users",
      "/roles"
  })
  public String forwardToReactApp() {
    return "forward:/index.html";
  }
}
