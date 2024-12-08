package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.EnseignantAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Enseignant;
import com.mycompany.myapp.repository.EnseignantRepository;
import com.mycompany.myapp.repository.EntityManager;
import java.time.Duration;
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
 * Integration tests for the {@link EnseignantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class EnseignantResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/enseignants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Enseignant enseignant;

    private Enseignant insertedEnseignant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Enseignant createEntity() {
        return new Enseignant().nom(DEFAULT_NOM).email(DEFAULT_EMAIL).password(DEFAULT_PASSWORD);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Enseignant createUpdatedEntity() {
        return new Enseignant().nom(UPDATED_NOM).email(UPDATED_EMAIL).password(UPDATED_PASSWORD);
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Enseignant.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @BeforeEach
    public void initTest() {
        enseignant = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedEnseignant != null) {
            enseignantRepository.delete(insertedEnseignant).block();
            insertedEnseignant = null;
        }
        deleteEntities(em);
    }

    @Test
    void createEnseignant() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Enseignant
        var returnedEnseignant = webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(enseignant))
            .exchange()
            .expectStatus()
            .isCreated()
            .expectBody(Enseignant.class)
            .returnResult()
            .getResponseBody();

        // Validate the Enseignant in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEnseignantUpdatableFieldsEquals(returnedEnseignant, getPersistedEnseignant(returnedEnseignant));

        insertedEnseignant = returnedEnseignant;
    }

    @Test
    void createEnseignantWithExistingId() throws Exception {
        // Create the Enseignant with an existing ID
        enseignant.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(enseignant))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Enseignant in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void getAllEnseignantsAsStream() {
        // Initialize the database
        enseignantRepository.save(enseignant).block();

        List<Enseignant> enseignantList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Enseignant.class)
            .getResponseBody()
            .filter(enseignant::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(enseignantList).isNotNull();
        assertThat(enseignantList).hasSize(1);
        Enseignant testEnseignant = enseignantList.get(0);

        // Test fails because reactive api returns an empty object instead of null
        // assertEnseignantAllPropertiesEquals(enseignant, testEnseignant);
        assertEnseignantUpdatableFieldsEquals(enseignant, testEnseignant);
    }

    @Test
    void getAllEnseignants() {
        // Initialize the database
        insertedEnseignant = enseignantRepository.save(enseignant).block();

        // Get all the enseignantList
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
            .value(hasItem(enseignant.getId().intValue()))
            .jsonPath("$.[*].nom")
            .value(hasItem(DEFAULT_NOM))
            .jsonPath("$.[*].email")
            .value(hasItem(DEFAULT_EMAIL))
            .jsonPath("$.[*].password")
            .value(hasItem(DEFAULT_PASSWORD));
    }

    @Test
    void getEnseignant() {
        // Initialize the database
        insertedEnseignant = enseignantRepository.save(enseignant).block();

        // Get the enseignant
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, enseignant.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(enseignant.getId().intValue()))
            .jsonPath("$.nom")
            .value(is(DEFAULT_NOM))
            .jsonPath("$.email")
            .value(is(DEFAULT_EMAIL))
            .jsonPath("$.password")
            .value(is(DEFAULT_PASSWORD));
    }

    @Test
    void getNonExistingEnseignant() {
        // Get the enseignant
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingEnseignant() throws Exception {
        // Initialize the database
        insertedEnseignant = enseignantRepository.save(enseignant).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the enseignant
        Enseignant updatedEnseignant = enseignantRepository.findById(enseignant.getId()).block();
        updatedEnseignant.nom(UPDATED_NOM).email(UPDATED_EMAIL).password(UPDATED_PASSWORD);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedEnseignant.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(updatedEnseignant))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Enseignant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEnseignantToMatchAllProperties(updatedEnseignant);
    }

    @Test
    void putNonExistingEnseignant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enseignant.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, enseignant.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(enseignant))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Enseignant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchEnseignant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enseignant.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(enseignant))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Enseignant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamEnseignant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enseignant.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(enseignant))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Enseignant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateEnseignantWithPatch() throws Exception {
        // Initialize the database
        insertedEnseignant = enseignantRepository.save(enseignant).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the enseignant using partial update
        Enseignant partialUpdatedEnseignant = new Enseignant();
        partialUpdatedEnseignant.setId(enseignant.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEnseignant.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedEnseignant))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Enseignant in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEnseignantUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEnseignant, enseignant),
            getPersistedEnseignant(enseignant)
        );
    }

    @Test
    void fullUpdateEnseignantWithPatch() throws Exception {
        // Initialize the database
        insertedEnseignant = enseignantRepository.save(enseignant).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the enseignant using partial update
        Enseignant partialUpdatedEnseignant = new Enseignant();
        partialUpdatedEnseignant.setId(enseignant.getId());

        partialUpdatedEnseignant.nom(UPDATED_NOM).email(UPDATED_EMAIL).password(UPDATED_PASSWORD);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEnseignant.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedEnseignant))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Enseignant in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEnseignantUpdatableFieldsEquals(partialUpdatedEnseignant, getPersistedEnseignant(partialUpdatedEnseignant));
    }

    @Test
    void patchNonExistingEnseignant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enseignant.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, enseignant.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(enseignant))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Enseignant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchEnseignant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enseignant.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(enseignant))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Enseignant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamEnseignant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        enseignant.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(enseignant))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Enseignant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteEnseignant() {
        // Initialize the database
        insertedEnseignant = enseignantRepository.save(enseignant).block();

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the enseignant
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, enseignant.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return enseignantRepository.count().block();
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

    protected Enseignant getPersistedEnseignant(Enseignant enseignant) {
        return enseignantRepository.findById(enseignant.getId()).block();
    }

    protected void assertPersistedEnseignantToMatchAllProperties(Enseignant expectedEnseignant) {
        // Test fails because reactive api returns an empty object instead of null
        // assertEnseignantAllPropertiesEquals(expectedEnseignant, getPersistedEnseignant(expectedEnseignant));
        assertEnseignantUpdatableFieldsEquals(expectedEnseignant, getPersistedEnseignant(expectedEnseignant));
    }

    protected void assertPersistedEnseignantToMatchUpdatableProperties(Enseignant expectedEnseignant) {
        // Test fails because reactive api returns an empty object instead of null
        // assertEnseignantAllUpdatablePropertiesEquals(expectedEnseignant, getPersistedEnseignant(expectedEnseignant));
        assertEnseignantUpdatableFieldsEquals(expectedEnseignant, getPersistedEnseignant(expectedEnseignant));
    }
}
