package com.partitio.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.partitio.dtos.DocumentDto;
import com.partitio.dtos.PieceIdDto;
import com.partitio.models.Document;
import com.partitio.repositories.DocumentRepository;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    
    private DocumentRepository reposit;
    public DocumentController(DocumentRepository repository) {
        this.reposit = repository;
    }


    @GetMapping
    public List<DocumentDto> getAll() {
        Iterable<Document> documentIterable = this.reposit.findAll();

        // Conversion de Iterable<Document> en List<Document>
        List<Document> documentList = new ArrayList<>();
        documentIterable.forEach(documentList::add);

        List<DocumentDto> documentDtoList = documentList.stream().map(document -> {
            PieceIdDto pieceIdDto = new PieceIdDto(document.getPiece().getId());
            return new DocumentDto(document.getId(), document.getName(), document.getVoiceType(), document.getDocumentType(), document.getDateAdded(), document.getDateModified(), document.getDocumentUrl(), pieceIdDto);
        }).collect(Collectors.toList());
        return documentDtoList;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getOne(@PathVariable long id) {
        Optional<Document> optDocument = this.reposit.findById(id);
        if (optDocument.isPresent()) {
            Document document = optDocument.get();
            return ResponseEntity.ok().body(document);
        }
        return ResponseEntity.notFound().build();
    }
}
