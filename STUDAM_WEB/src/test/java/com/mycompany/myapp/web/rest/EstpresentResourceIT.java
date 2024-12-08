package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.EstpresentAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Estpresent;
import com.mycompany.myapp.repository.EntityManager;
import com.mycompany.myapp.repository.EstpresentRepository;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link EstpresentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class EstpresentResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/estpresents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EstpresentRepository estpresentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Estpresent estpresent;

    private Estpresent insertedEstpresent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estpresent createEntity() {
        return new Estpresent().date(DEFAULT_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estpresent createUpdatedEntity() {
        return new Estpresent().date(UPDATED_DATE);
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Estpresent.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @BeforeEach
    public void initTest() {
        estpresent = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedEstpresent != null) {
            estpresentRepository.delete(insertedEstpresent).block();
            insertedEstpresent = null;
        }
        deleteEntities(em);
    }

    @Test
    void createEstpresent() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Estpresent
        var returnedEstpresent = webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(estpresent))
            .exchange()
            .expectStatus()
            .isCreated()
            .expectBody(Estpresent.class)
            .returnResult()
            .getResponseBody();

        // Validate the Estpresent in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEstpresentUpdatableFieldsEquals(returnedEstpresent, getPersistedEstpresent(returnedEstpresent));

        insertedEstpresent = returnedEstpresent;
    }

    @Test
    void createEstpresentWithExistingId() throws Exception {
        // Create the Estpresent with an existing ID
        estpresent.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(estpresent))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estpresent in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void getAllEstpresentsAsStream() {
        // Initialize the database
        estpresentRepository.save(estpresent).block();

        List<Estpresent> estpresentList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Estpresent.class)
            .getResponseBody()
            .filter(estpresent::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(estpresentList).isNotNull();
        assertThat(estpresentList).hasSize(1);
        Estpresent testEstpresent = estpresentList.get(0);

        // Test fails because reactive api returns an empty object instead of null
        // assertEstpresentAllPropertiesEquals(estpresent, testEstpresent);
        assertEstpresentUpdatableFieldsEquals(estpresent, testEstpresent);
    }

    @Test
    void getAllEstpresents() {
        // Initialize the database
        insertedEstpresent = estpresentRepository.save(estpresent).block();

        // Get all the estpresentList
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
            .value(hasItem(estpresent.getId().intValue()))
            .jsonPath("$.[*].date")
            .value(hasItem(DEFAULT_DATE.toString()));
    }

    @Test
    void getEstpresent() {
        // Initialize the database
        insertedEstpresent = estpresentRepository.save(estpresent).block();

        // Get the estpresent
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, estpresent.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(estpresent.getId().intValue()))
            .jsonPath("$.date")
            .value(is(DEFAULT_DATE.toString()));
    }

    @Test
    void getNonExistingEstpresent() {
        // Get the estpresent
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingEstpresent() throws Exception {
        // Initialize the database
        insertedEstpresent = estpresentRepository.save(estpresent).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the estpresent
        Estpresent updatedEstpresent = estpresentRepository.findById(estpresent.getId()).block();
        updatedEstpresent.date(UPDATED_DATE);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedEstpresent.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(updatedEstpresent))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Estpresent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEstpresentToMatchAllProperties(updatedEstpresent);
    }

    @Test
    void putNonExistingEstpresent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estpresent.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, estpresent.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(estpresent))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estpresent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchEstpresent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estpresent.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(estpresent))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estpresent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamEstpresent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estpresent.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(estpresent))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Estpresent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateEstpresentWithPatch() throws Exception {
        // Initialize the database
        insertedEstpresent = estpresentRepository.save(estpresent).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the estpresent using partial update
        Estpresent partialUpdatedEstpresent = new Estpresent();
        partialUpdatedEstpresent.setId(estpresent.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEstpresent.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedEstpresent))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Estpresent in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEstpresentUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEstpresent, estpresent),
            getPersistedEstpresent(estpresent)
        );
    }

    @Test
    void fullUpdateEstpresentWithPatch() throws Exception {
        // Initialize the database
        insertedEstpresent = estpresentRepository.save(estpresent).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the estpresent using partial update
        Estpresent partialUpdatedEstpresent = new Estpresent();
        partialUpdatedEstpresent.setId(estpresent.getId());

        partialUpdatedEstpresent.date(UPDATED_DATE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEstpresent.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedEstpresent))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Estpresent in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEstpresentUpdatableFieldsEquals(partialUpdatedEstpresent, getPersistedEstpresent(partialUpdatedEstpresent));
    }

    @Test
    void patchNonExistingEstpresent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estpresent.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, estpresent.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(estpresent))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estpresent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchEstpresent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estpresent.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(estpresent))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estpresent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamEstpresent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estpresent.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(estpresent))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Estpresent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteEstpresent() {
        // Initialize the database
        insertedEstpresent = estpresentRepository.save(estpresent).block();

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the estpresent
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, estpresent.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return estpresentRepository.count().block();
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

    protected Estpresent getPersistedEstpresent(Estpresent estpresent) {
        return estpresentRepository.findById(estpresent.getId()).block();
    }

    protected void assertPersistedEstpresentToMatchAllProperties(Estpresent expectedEstpresent) {
        // Test fails because reactive api returns an empty object instead of null
        // assertEstpresentAllPropertiesEquals(expectedEstpresent, getPersistedEstpresent(expectedEstpresent));
        assertEstpresentUpdatableFieldsEquals(expectedEstpresent, getPersistedEstpresent(expectedEstpresent));
    }

    protected void assertPersistedEstpresentToMatchUpdatableProperties(Estpresent expectedEstpresent) {
        // Test fails because reactive api returns an empty object instead of null
        // assertEstpresentAllUpdatablePropertiesEquals(expectedEstpresent, getPersistedEstpresent(expectedEstpresent));
        assertEstpresentUpdatableFieldsEquals(expectedEstpresent, getPersistedEstpresent(expectedEstpresent));
    }
}
