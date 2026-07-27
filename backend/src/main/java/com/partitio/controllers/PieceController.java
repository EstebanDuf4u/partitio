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
import com.partitio.dtos.PieceDto;
import com.partitio.dtos.PieceIdDto;
import com.partitio.models.Document;
import com.partitio.models.Piece;
import com.partitio.repositories.PieceRepository;

@RestController
@RequestMapping("/api/pieces")
public class PieceController {
    
    private PieceRepository reposit;
    public PieceController(PieceRepository repository) {
        this.reposit = repository;
    }


    @GetMapping()
    public List<PieceDto> getAll() {
        Iterable<Piece> pieceIterable = this.reposit.findAll();
        
        // On doit changer le Iterable en List 
        List<Piece> pieceList= new ArrayList<>();
        pieceIterable.forEach(pieceList::add);
        List<PieceDto> pieceDtoList = pieceList.stream().map(piece -> {
            PieceIdDto pieceIdDto = new PieceIdDto(piece.getId());
            List<Document> documentList = piece.getDocuments();
            List<DocumentDto> documentDtoList = documentList.stream().map(document -> new DocumentDto(document.getId(), document.getName(), document.getVoiceType(), document.getDocumentType(), document.getDateAdded(), document.getDateModified(), document.getDocumentUrl(), pieceIdDto)).collect(Collectors.toList());
            PieceDto pieceDto = new PieceDto(piece.getId(), piece.getTitle(), piece.getArtist(), piece.getCategory(), piece.getLanguage(), piece.getDescription(), piece.getCoverUrl(), documentDtoList);
            return pieceDto;
        }).collect(Collectors.toList());
        return pieceDtoList;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Piece> getOne(@PathVariable long id) {
        Optional<Piece> optPiece = this.reposit.findById(id);
        if (optPiece.isPresent()) {
            Piece piece = optPiece.get();
            return ResponseEntity.ok().body(piece);
        }
        return ResponseEntity.notFound().build();
    }
}
