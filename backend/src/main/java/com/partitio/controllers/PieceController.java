package com.partitio.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.partitio.dtos.DocumentDto;
import com.partitio.dtos.PieceDto;
import com.partitio.dtos.PieceIdDto;
import com.partitio.models.Document;
import com.partitio.models.Piece;
import com.partitio.repositories.PieceRepository;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/pieces")
public class PieceController {
    
    private PieceRepository reposit;
    public PieceController(PieceRepository repository) {
        this.reposit = repository;
    }

    @GetMapping()
    public List<PieceDto> getAll() {
        Iterable<Piece> pieceIterable = this.reposit.findAllByOrderByDateAddedDesc(Sort.by("dateAdded").descending());
        
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

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public Piece create(@RequestParam String title, @RequestParam String artist, @RequestParam String category, @RequestParam String language, @RequestParam String description, @RequestParam String coverUrl) {
        Piece tempPiece = new Piece();
        tempPiece.setTitle(title);
        tempPiece.setArtist(artist);
        tempPiece.setCategory(category);
        tempPiece.setLanguage(language);
        tempPiece.setDescription(description);
        tempPiece.setCoverUrl(coverUrl);
        return this.reposit.save(tempPiece);
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable long id, HttpServletResponse response) {
        this.reposit.deleteById(id);
        response.setStatus(204);
    }
}