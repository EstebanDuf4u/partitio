package com.partitio.repositories;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.partitio.models.Piece;

@Repository
public interface PieceRepository extends CrudRepository<Piece, Long> {
    List<Piece> findTop5ByOrderByDateAddedDesc(PageRequest pageRequest);
}
