package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Horaire;
import com.mycompany.myapp.repository.HoraireRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Horaire}.
 */
@RestController
@RequestMapping("/api/horaires")
@Transactional
public class HoraireResource {

    private static final Logger LOG = LoggerFactory.getLogger(HoraireResource.class);

    private static final String ENTITY_NAME = "horaire";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HoraireRepository horaireRepository;

    public HoraireResource(HoraireRepository horaireRepository) {
        this.horaireRepository = horaireRepository;
    }

    /**
     * {@code POST  /horaires} : Create a new horaire.
     *
     * @param horaire the horaire to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new horaire, or with status {@code 400 (Bad Request)} if the horaire has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public Mono<ResponseEntity<Horaire>> createHoraire(@RequestBody Horaire horaire) throws URISyntaxException {
        LOG.debug("REST request to save Horaire : {}", horaire);
        if (horaire.getId() != null) {
            throw new BadRequestAlertException("A new horaire cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return horaireRepository
            .save(horaire)
            .map(result -> {
                try {
                    return ResponseEntity.created(new URI("/api/horaires/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /horaires/:id} : Updates an existing horaire.
     *
     * @param id the id of the horaire to save.
     * @param horaire the horaire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated horaire,
     * or with status {@code 400 (Bad Request)} if the horaire is not valid,
     * or with status {@code 500 (Internal Server Error)} if the horaire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public Mono<ResponseEntity<Horaire>> updateHoraire(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Horaire horaire
    ) throws URISyntaxException {
        LOG.debug("REST request to update Horaire : {}, {}", id, horaire);
        if (horaire.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, horaire.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return horaireRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return horaireRepository
                    .save(horaire)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity.ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /horaires/:id} : Partial updates given fields of an existing horaire, field will ignore if it is null
     *
     * @param id the id of the horaire to save.
     * @param horaire the horaire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated horaire,
     * or with status {@code 400 (Bad Request)} if the horaire is not valid,
     * or with status {@code 404 (Not Found)} if the horaire is not found,
     * or with status {@code 500 (Internal Server Error)} if the horaire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Horaire>> partialUpdateHoraire(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Horaire horaire
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Horaire partially : {}, {}", id, horaire);
        if (horaire.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, horaire.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return horaireRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Horaire> result = horaireRepository
                    .findById(horaire.getId())
                    .map(existingHoraire -> {
                        if (horaire.getJour() != null) {
                            existingHoraire.setJour(horaire.getJour());
                        }
                        if (horaire.getHeureDebut() != null) {
                            existingHoraire.setHeureDebut(horaire.getHeureDebut());
                        }
                        if (horaire.getHeureFin() != null) {
                            existingHoraire.setHeureFin(horaire.getHeureFin());
                        }

                        return existingHoraire;
                    })
                    .flatMap(horaireRepository::save);

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
     * {@code GET  /horaires} : get all the horaires.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of horaires in body.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<Horaire>> getAllHoraires() {
        LOG.debug("REST request to get all Horaires");
        return horaireRepository.findAll().collectList();
    }

    /**
     * {@code GET  /horaires} : get all the horaires as a stream.
     * @return the {@link Flux} of horaires.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Horaire> getAllHorairesAsStream() {
        LOG.debug("REST request to get all Horaires as a stream");
        return horaireRepository.findAll();
    }

    /**
     * {@code GET  /horaires/:id} : get the "id" horaire.
     *
     * @param id the id of the horaire to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the horaire, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public Mono<ResponseEntity<Horaire>> getHoraire(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Horaire : {}", id);
        Mono<Horaire> horaire = horaireRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(horaire);
    }

    /**
     * {@code DELETE  /horaires/:id} : delete the "id" horaire.
     *
     * @param id the id of the horaire to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteHoraire(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Horaire : {}", id);
        return horaireRepository
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
