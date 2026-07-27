package com.partitio.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.partitio.models.Piece;

@Repository
public interface PieceRepository extends CrudRepository<Piece, Long>{
    
}
