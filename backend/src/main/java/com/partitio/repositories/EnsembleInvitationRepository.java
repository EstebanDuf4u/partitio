package com.partitio.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.partitio.models.EnsembleInvitation;

@Repository
public interface EnsembleInvitationRepository extends JpaRepository<EnsembleInvitation, Long> {
    List<EnsembleInvitation> findByEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(String email, String status);

    Optional<EnsembleInvitation> findByIdAndEmailIgnoreCase(Long id, String email);

    Optional<EnsembleInvitation> findByIdAndEnsemble_Id(Long id, Long ensembleId);

    Optional<EnsembleInvitation> findByInviteTokenIgnoreCase(String inviteToken);

    Optional<EnsembleInvitation> findFirstByEnsemble_IdAndEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
            Long ensembleId,
            String email,
            String status);

    List<EnsembleInvitation> findByEnsemble_IdAndStatusOrderByCreatedAtDesc(Long ensembleId, String status);
}
