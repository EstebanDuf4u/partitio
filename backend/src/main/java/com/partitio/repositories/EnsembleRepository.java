package com.partitio.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.partitio.models.Ensemble;

@Repository
public interface EnsembleRepository extends JpaRepository<Ensemble, Long> {
    List<Ensemble> findAllByOrderByIdAsc();

    Optional<Ensemble> findByInviteCodeIgnoreCase(String inviteCode);
}
