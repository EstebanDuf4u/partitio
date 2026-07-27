package com.partitio.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.partitio.models.Document;

@Repository
public interface DocumentRepository extends CrudRepository<Document, Long>{
    
}
