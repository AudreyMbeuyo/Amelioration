package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.HoraireAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Horaire;
import com.mycompany.myapp.domain.enumeration.Jour;
import com.mycompany.myapp.repository.EntityManager;
import com.mycompany.myapp.repository.HoraireRepository;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link HoraireResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class HoraireResourceIT {

    private static final Jour DEFAULT_JOUR = Jour.LUNDI;
    private static final Jour UPDATED_JOUR = Jour.MARDI;

    private static final ZonedDateTime DEFAULT_HEURE_DEBUT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_HEURE_DEBUT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_HEURE_FIN = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_HEURE_FIN = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/horaires";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private HoraireRepository horaireRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Horaire horaire;

    private Horaire insertedHoraire;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Horaire createEntity() {
        return new Horaire().jour(DEFAULT_JOUR).heureDebut(DEFAULT_HEURE_DEBUT).heureFin(DEFAULT_HEURE_FIN);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Horaire createUpdatedEntity() {
        return new Horaire().jour(UPDATED_JOUR).heureDebut(UPDATED_HEURE_DEBUT).heureFin(UPDATED_HEURE_FIN);
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Horaire.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @BeforeEach
    public void initTest() {
        horaire = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedHoraire != null) {
            horaireRepository.delete(insertedHoraire).block();
            insertedHoraire = null;
        }
        deleteEntities(em);
    }

    @Test
    void createHoraire() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Horaire
        var returnedHoraire = webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(horaire))
            .exchange()
            .expectStatus()
            .isCreated()
            .expectBody(Horaire.class)
            .returnResult()
            .getResponseBody();

        // Validate the Horaire in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertHoraireUpdatableFieldsEquals(returnedHoraire, getPersistedHoraire(returnedHoraire));

        insertedHoraire = returnedHoraire;
    }

    @Test
    void createHoraireWithExistingId() throws Exception {
        // Create the Horaire with an existing ID
        horaire.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(horaire))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Horaire in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void getAllHorairesAsStream() {
        // Initialize the database
        horaireRepository.save(horaire).block();

        List<Horaire> horaireList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Horaire.class)
            .getResponseBody()
            .filter(horaire::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(horaireList).isNotNull();
        assertThat(horaireList).hasSize(1);
        Horaire testHoraire = horaireList.get(0);

        // Test fails because reactive api returns an empty object instead of null
        // assertHoraireAllPropertiesEquals(horaire, testHoraire);
        assertHoraireUpdatableFieldsEquals(horaire, testHoraire);
    }

    @Test
    void getAllHoraires() {
        // Initialize the database
        insertedHoraire = horaireRepository.save(horaire).block();

        // Get all the horaireList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(horaire.getId().intValue()))
            .jsonPath("$.[*].jour")
            .value(hasItem(DEFAULT_JOUR.toString()))
            .jsonPath("$.[*].heureDebut")
            .value(hasItem(sameInstant(DEFAULT_HEURE_DEBUT)))
            .jsonPath("$.[*].heureFin")
            .value(hasItem(sameInstant(DEFAULT_HEURE_FIN)));
    }

    @Test
    void getHoraire() {
        // Initialize the database
        insertedHoraire = horaireRepository.save(horaire).block();

        // Get the horaire
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, horaire.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(horaire.getId().intValue()))
            .jsonPath("$.jour")
            .value(is(DEFAULT_JOUR.toString()))
            .jsonPath("$.heureDebut")
            .value(is(sameInstant(DEFAULT_HEURE_DEBUT)))
            .jsonPath("$.heureFin")
            .value(is(sameInstant(DEFAULT_HEURE_FIN)));
    }

    @Test
    void getNonExistingHoraire() {
        // Get the horaire
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingHoraire() throws Exception {
        // Initialize the database
        insertedHoraire = horaireRepository.save(horaire).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the horaire
        Horaire updatedHoraire = horaireRepository.findById(horaire.getId()).block();
        updatedHoraire.jour(UPDATED_JOUR).heureDebut(UPDATED_HEURE_DEBUT).heureFin(UPDATED_HEURE_FIN);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedHoraire.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(updatedHoraire))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Horaire in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedHoraireToMatchAllProperties(updatedHoraire);
    }

    @Test
    void putNonExistingHoraire() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horaire.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, horaire.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(horaire))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Horaire in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchHoraire() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horaire.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(horaire))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Horaire in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamHoraire() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horaire.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(horaire))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Horaire in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateHoraireWithPatch() throws Exception {
        // Initialize the database
        insertedHoraire = horaireRepository.save(horaire).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the horaire using partial update
        Horaire partialUpdatedHoraire = new Horaire();
        partialUpdatedHoraire.setId(horaire.getId());

        partialUpdatedHoraire.jour(UPDATED_JOUR).heureDebut(UPDATED_HEURE_DEBUT).heureFin(UPDATED_HEURE_FIN);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedHoraire.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedHoraire))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Horaire in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHoraireUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedHoraire, horaire), getPersistedHoraire(horaire));
    }

    @Test
    void fullUpdateHoraireWithPatch() throws Exception {
        // Initialize the database
        insertedHoraire = horaireRepository.save(horaire).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the horaire using partial update
        Horaire partialUpdatedHoraire = new Horaire();
        partialUpdatedHoraire.setId(horaire.getId());

        partialUpdatedHoraire.jour(UPDATED_JOUR).heureDebut(UPDATED_HEURE_DEBUT).heureFin(UPDATED_HEURE_FIN);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedHoraire.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedHoraire))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Horaire in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHoraireUpdatableFieldsEquals(partialUpdatedHoraire, getPersistedHoraire(partialUpdatedHoraire));
    }

    @Test
    void patchNonExistingHoraire() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horaire.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, horaire.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(horaire))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Horaire in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchHoraire() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horaire.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(horaire))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Horaire in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamHoraire() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horaire.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(horaire))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Horaire in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteHoraire() {
        // Initialize the database
        insertedHoraire = horaireRepository.save(horaire).block();

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the horaire
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, horaire.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return horaireRepository.count().block();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Horaire getPersistedHoraire(Horaire horaire) {
        return horaireRepository.findById(horaire.getId()).block();
    }

    protected void assertPersistedHoraireToMatchAllProperties(Horaire expectedHoraire) {
        // Test fails because reactive api returns an empty object instead of null
        // assertHoraireAllPropertiesEquals(expectedHoraire, getPersistedHoraire(expectedHoraire));
        assertHoraireUpdatableFieldsEquals(expectedHoraire, getPersistedHoraire(expectedHoraire));
    }

    protected void assertPersistedHoraireToMatchUpdatableProperties(Horaire expectedHoraire) {
        // Test fails because reactive api returns an empty object instead of null
        // assertHoraireAllUpdatablePropertiesEquals(expectedHoraire, getPersistedHoraire(expectedHoraire));
        assertHoraireUpdatableFieldsEquals(expectedHoraire, getPersistedHoraire(expectedHoraire));
    }
}
