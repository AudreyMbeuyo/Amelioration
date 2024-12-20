package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Etudiant;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Etudiant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtudiantRepository extends ReactiveCrudRepository<Etudiant, Long>, EtudiantRepositoryInternal {
    @Override
    Mono<Etudiant> findOneWithEagerRelationships(Long id);

    @Override
    Flux<Etudiant> findAllWithEagerRelationships();

    @Override
    Flux<Etudiant> findAllWithEagerRelationships(Pageable page);

    @Query(
        "SELECT entity.* FROM etudiant entity JOIN rel_etudiant__matiere joinTable ON entity.id = joinTable.matiere_id WHERE joinTable.matiere_id = :id"
    )
    Flux<Etudiant> findByMatiere(Long id);

    @Override
    <S extends Etudiant> Mono<S> save(S entity);

    @Override
    Flux<Etudiant> findAll();

    @Override
    Mono<Etudiant> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface EtudiantRepositoryInternal {
    <S extends Etudiant> Mono<S> save(S entity);

    Flux<Etudiant> findAllBy(Pageable pageable);

    Flux<Etudiant> findAll();

    Mono<Etudiant> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Etudiant> findAllBy(Pageable pageable, Criteria criteria);

    Mono<Etudiant> findOneWithEagerRelationships(Long id);

    Flux<Etudiant> findAllWithEagerRelationships();

    Flux<Etudiant> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
