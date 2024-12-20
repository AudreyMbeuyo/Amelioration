package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Matiere;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Matiere entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatiereRepository extends ReactiveCrudRepository<Matiere, Long>, MatiereRepositoryInternal {
    @Override
    Mono<Matiere> findOneWithEagerRelationships(Long id);

    @Override
    Flux<Matiere> findAllWithEagerRelationships();

    @Override
    Flux<Matiere> findAllWithEagerRelationships(Pageable page);

    @Query("SELECT * FROM matiere entity WHERE entity.horaire_id = :id")
    Flux<Matiere> findByHoraire(Long id);

    @Query("SELECT * FROM matiere entity WHERE entity.horaire_id IS NULL")
    Flux<Matiere> findAllWhereHoraireIsNull();

    @Query("SELECT * FROM matiere entity WHERE entity.enseignant_id = :id")
    Flux<Matiere> findByEnseignant(Long id);

    @Query("SELECT * FROM matiere entity WHERE entity.enseignant_id IS NULL")
    Flux<Matiere> findAllWhereEnseignantIsNull();

    @Query(
        "SELECT entity.* FROM matiere entity JOIN rel_matiere__classe joinTable ON entity.id = joinTable.classe_id WHERE joinTable.classe_id = :id"
    )
    Flux<Matiere> findByClasse(Long id);

    @Override
    <S extends Matiere> Mono<S> save(S entity);

    @Override
    Flux<Matiere> findAll();

    @Override
    Mono<Matiere> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface MatiereRepositoryInternal {
    <S extends Matiere> Mono<S> save(S entity);

    Flux<Matiere> findAllBy(Pageable pageable);

    Flux<Matiere> findAll();

    Mono<Matiere> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Matiere> findAllBy(Pageable pageable, Criteria criteria);

    Mono<Matiere> findOneWithEagerRelationships(Long id);

    Flux<Matiere> findAllWithEagerRelationships();

    Flux<Matiere> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
