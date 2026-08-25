package com.partitio.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.partitio.dtos.DocumentDto;
import com.partitio.dtos.ErrorResponse;
import com.partitio.dtos.PieceIdDto;
import com.partitio.models.Document;
import com.partitio.models.User;
import com.partitio.repositories.DocumentRepository;
import com.partitio.repositories.EnsembleMemberRepository;
import com.partitio.repositories.UserRepository;
import com.partitio.services.JwtService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private static final List<String> AUTHORIZED_MEMBER_STATUSES = List.of("active", "paused");
    
    private final DocumentRepository reposit;
    private final EnsembleMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public DocumentController(
            DocumentRepository repository,
            EnsembleMemberRepository memberRepository,
            UserRepository userRepository,
            JwtService jwtService) {
        this.reposit = repository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }


    @GetMapping
    public ResponseEntity<?> getAll(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token) {
        Optional<ResponseEntity<?>> optAccessError = accessError(token);
        if (optAccessError.isPresent()) {
            return optAccessError.get();
        }

        Iterable<Document> documentIterable = this.reposit.findAll();

        // Conversion de Iterable<Document> en List<Document>
        List<Document> documentList = new ArrayList<>();
        documentIterable.forEach(documentList::add);

        List<DocumentDto> documentDtoList = documentList.stream().map(document -> {
            PieceIdDto pieceIdDto = new PieceIdDto(document.getPiece().getId());
            return new DocumentDto(document.getId(), document.getName(), document.getVoiceType(), document.getDocumentType(), document.getDateAdded(), document.getDateModified(), document.getDocumentUrl(), pieceIdDto);
        }).collect(Collectors.toList());
        return ResponseEntity.ok(documentDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(
            @CookieValue(name = "${app.jwt.cookie-name}", required = false) String token,
            @PathVariable long id) {
        Optional<ResponseEntity<?>> optAccessError = accessError(token);
        if (optAccessError.isPresent()) {
            return optAccessError.get();
        }

        Optional<Document> optDocument = this.reposit.findById(id);
        if (optDocument.isPresent()) {
            Document document = optDocument.get();
            return ResponseEntity.ok().body(document);
        }
        return ResponseEntity.notFound().build();
    }

    private Optional<ResponseEntity<?>> accessError(String token) {
        Optional<User> optUser = currentUser(token);
        if (optUser.isEmpty()) {
            return Optional.of(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Non authentifie.")));
        }

        if (!memberRepository.existsByUser_IdAndStatusIn(optUser.get().getId(), AUTHORIZED_MEMBER_STATUSES)) {
            return Optional.of(ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Tu dois faire partie d'un ensemble.")));
        }

        return Optional.empty();
    }

    private Optional<User> currentUser(String token) {
        if (token == null || token.isBlank() || !jwtService.isTokenValid(token)) {
            return Optional.empty();
        }

        return userRepository.findById(jwtService.getUserId(token));
    }
}
