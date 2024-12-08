package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Estpresent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Estpresent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EstpresentRepository extends ReactiveCrudRepository<Estpresent, Long>, EstpresentRepositoryInternal {
    @Query("SELECT * FROM estpresent entity WHERE entity.horaire_id = :id")
    Flux<Estpresent> findByHoraire(Long id);

    @Query("SELECT * FROM estpresent entity WHERE entity.horaire_id IS NULL")
    Flux<Estpresent> findAllWhereHoraireIsNull();

    @Query("SELECT * FROM estpresent entity WHERE entity.etudiant_id = :id")
    Flux<Estpresent> findByEtudiant(Long id);

    @Query("SELECT * FROM estpresent entity WHERE entity.etudiant_id IS NULL")
    Flux<Estpresent> findAllWhereEtudiantIsNull();

    @Override
    <S extends Estpresent> Mono<S> save(S entity);

    @Override
    Flux<Estpresent> findAll();

    @Override
    Mono<Estpresent> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface EstpresentRepositoryInternal {
    <S extends Estpresent> Mono<S> save(S entity);

    Flux<Estpresent> findAllBy(Pageable pageable);

    Flux<Estpresent> findAll();

    Mono<Estpresent> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Estpresent> findAllBy(Pageable pageable, Criteria criteria);
}
