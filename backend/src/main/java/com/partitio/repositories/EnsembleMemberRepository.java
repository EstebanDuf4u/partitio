package com.partitio.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.partitio.models.EnsembleMember;
import com.partitio.models.EnsembleRole;

@Repository
public interface EnsembleMemberRepository extends JpaRepository<EnsembleMember, Long> {
    List<EnsembleMember> findByUser_IdOrderByEnsemble_IdAsc(Long userId);

    Optional<EnsembleMember> findByEnsemble_IdAndUser_Id(Long ensembleId, Long userId);

    Optional<EnsembleMember> findByIdAndEnsemble_Id(Long id, Long ensembleId);

    List<EnsembleMember> findByEnsemble_IdAndStatusInOrderByIdAsc(Long ensembleId, Collection<String> statuses);

    boolean existsByEnsemble_IdAndUser_Id(Long ensembleId, Long userId);

    long countByEnsemble_IdAndStatusIn(Long ensembleId, Collection<String> statuses);

    long countByEnsemble_IdAndEnsembleRoleAndStatusIn(
            Long ensembleId,
            EnsembleRole ensembleRole,
            Collection<String> statuses);
}
