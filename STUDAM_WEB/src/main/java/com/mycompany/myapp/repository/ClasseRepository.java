package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Classe;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Classe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClasseRepository extends ReactiveCrudRepository<Classe, Long>, ClasseRepositoryInternal {
    @Override
    Mono<Classe> findOneWithEagerRelationships(Long id);

    @Override
    Flux<Classe> findAllWithEagerRelationships();

    @Override
    Flux<Classe> findAllWithEagerRelationships(Pageable page);

    @Query(
        "SELECT entity.* FROM classe entity JOIN rel_classe__etudiant joinTable ON entity.id = joinTable.etudiant_id WHERE joinTable.etudiant_id = :id"
    )
    Flux<Classe> findByEtudiant(Long id);

    @Query("SELECT * FROM classe entity WHERE entity.departement_id = :id")
    Flux<Classe> findByDepartement(Long id);

    @Query("SELECT * FROM classe entity WHERE entity.departement_id IS NULL")
    Flux<Classe> findAllWhereDepartementIsNull();

    @Override
    <S extends Classe> Mono<S> save(S entity);

    @Override
    Flux<Classe> findAll();

    @Override
    Mono<Classe> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ClasseRepositoryInternal {
    <S extends Classe> Mono<S> save(S entity);

    Flux<Classe> findAllBy(Pageable pageable);

    Flux<Classe> findAll();

    Mono<Classe> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Classe> findAllBy(Pageable pageable, Criteria criteria);

    Mono<Classe> findOneWithEagerRelationships(Long id);

    Flux<Classe> findAllWithEagerRelationships();

    Flux<Classe> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
