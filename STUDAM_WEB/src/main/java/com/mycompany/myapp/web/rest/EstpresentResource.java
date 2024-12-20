package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Estpresent;
import com.mycompany.myapp.repository.EstpresentRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Estpresent}.
 */
@RestController
@RequestMapping("/api/estpresents")
@Transactional
public class EstpresentResource {

    private static final Logger LOG = LoggerFactory.getLogger(EstpresentResource.class);

    private static final String ENTITY_NAME = "estpresent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstpresentRepository estpresentRepository;

    public EstpresentResource(EstpresentRepository estpresentRepository) {
        this.estpresentRepository = estpresentRepository;
    }

    /**
     * {@code POST  /estpresents} : Create a new estpresent.
     *
     * @param estpresent the estpresent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estpresent, or with status {@code 400 (Bad Request)} if the estpresent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public Mono<ResponseEntity<Estpresent>> createEstpresent(@RequestBody Estpresent estpresent) throws URISyntaxException {
        LOG.debug("REST request to save Estpresent : {}", estpresent);
        if (estpresent.getId() != null) {
            throw new BadRequestAlertException("A new estpresent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return estpresentRepository
            .save(estpresent)
            .map(result -> {
                try {
                    return ResponseEntity.created(new URI("/api/estpresents/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /estpresents/:id} : Updates an existing estpresent.
     *
     * @param id the id of the estpresent to save.
     * @param estpresent the estpresent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estpresent,
     * or with status {@code 400 (Bad Request)} if the estpresent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estpresent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public Mono<ResponseEntity<Estpresent>> updateEstpresent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Estpresent estpresent
    ) throws URISyntaxException {
        LOG.debug("REST request to update Estpresent : {}, {}", id, estpresent);
        if (estpresent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estpresent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return estpresentRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return estpresentRepository
                    .save(estpresent)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity.ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /estpresents/:id} : Partial updates given fields of an existing estpresent, field will ignore if it is null
     *
     * @param id the id of the estpresent to save.
     * @param estpresent the estpresent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estpresent,
     * or with status {@code 400 (Bad Request)} if the estpresent is not valid,
     * or with status {@code 404 (Not Found)} if the estpresent is not found,
     * or with status {@code 500 (Internal Server Error)} if the estpresent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Estpresent>> partialUpdateEstpresent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Estpresent estpresent
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Estpresent partially : {}, {}", id, estpresent);
        if (estpresent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estpresent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return estpresentRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Estpresent> result = estpresentRepository
                    .findById(estpresent.getId())
                    .map(existingEstpresent -> {
                        if (estpresent.getDate() != null) {
                            existingEstpresent.setDate(estpresent.getDate());
                        }

                        return existingEstpresent;
                    })
                    .flatMap(estpresentRepository::save);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity.ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /estpresents} : get all the estpresents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estpresents in body.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<Estpresent>> getAllEstpresents() {
        LOG.debug("REST request to get all Estpresents");
        return estpresentRepository.findAll().collectList();
    }

    /**
     * {@code GET  /estpresents} : get all the estpresents as a stream.
     * @return the {@link Flux} of estpresents.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Estpresent> getAllEstpresentsAsStream() {
        LOG.debug("REST request to get all Estpresents as a stream");
        return estpresentRepository.findAll();
    }

    /**
     * {@code GET  /estpresents/:id} : get the "id" estpresent.
     *
     * @param id the id of the estpresent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estpresent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public Mono<ResponseEntity<Estpresent>> getEstpresent(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Estpresent : {}", id);
        Mono<Estpresent> estpresent = estpresentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(estpresent);
    }

    /**
     * {@code DELETE  /estpresents/:id} : delete the "id" estpresent.
     *
     * @param id the id of the estpresent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteEstpresent(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Estpresent : {}", id);
        return estpresentRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity.noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                        .build()
                )
            );
    }
}
