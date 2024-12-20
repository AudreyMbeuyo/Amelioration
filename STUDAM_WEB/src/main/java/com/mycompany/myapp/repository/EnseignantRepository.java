package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Enseignant;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Enseignant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EnseignantRepository extends ReactiveCrudRepository<Enseignant, Long>, EnseignantRepositoryInternal {
    @Query("SELECT * FROM enseignant entity WHERE entity.departement_id = :id")
    Flux<Enseignant> findByDepartement(Long id);

    @Query("SELECT * FROM enseignant entity WHERE entity.departement_id IS NULL")
    Flux<Enseignant> findAllWhereDepartementIsNull();

    @Override
    <S extends Enseignant> Mono<S> save(S entity);

    @Override
    Flux<Enseignant> findAll();

    @Override
    Mono<Enseignant> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface EnseignantRepositoryInternal {
    <S extends Enseignant> Mono<S> save(S entity);

    Flux<Enseignant> findAllBy(Pageable pageable);

    Flux<Enseignant> findAll();

    Mono<Enseignant> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Enseignant> findAllBy(Pageable pageable, Criteria criteria);
}
