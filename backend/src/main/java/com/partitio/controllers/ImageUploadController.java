package com.partitio.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class ImageUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/covers")
    public ResponseEntity<String> uploadCover(@RequestParam MultipartFile file, @RequestParam String title) {
        String coverUploadDir = uploadDir + "/covers";
        try {
            Path uploadPath = Paths.get(coverUploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            if (title.contains(" ")) {
                title = title.replace(" ", "-");
            }
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = title + extension;

            Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok("/uploads/covers/" + filename);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur d'upload");
        }

    }

    @PostMapping("/profile-images")
    public ResponseEntity<String> uploadProfileImage(@RequestParam MultipartFile file) {
        String coverUploadDir = uploadDir + "/profile-images";
        try {
            Path uploadPath = Paths.get(coverUploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String Filename = file.getOriginalFilename();

            Files.copy(file.getInputStream(), uploadPath.resolve(Filename), StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok("/uploads/profile-images/" + Filename);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur d'upload");
        }
    }
}
