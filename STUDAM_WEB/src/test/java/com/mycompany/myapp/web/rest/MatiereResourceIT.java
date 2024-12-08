package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.MatiereAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Matiere;
import com.mycompany.myapp.repository.EntityManager;
import com.mycompany.myapp.repository.MatiereRepository;
import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;

/**
 * Integration tests for the {@link MatiereResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class MatiereResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/matieres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MatiereRepository matiereRepository;

    @Mock
    private MatiereRepository matiereRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Matiere matiere;

    private Matiere insertedMatiere;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matiere createEntity() {
        return new Matiere().libelle(DEFAULT_LIBELLE).code(DEFAULT_CODE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matiere createUpdatedEntity() {
        return new Matiere().libelle(UPDATED_LIBELLE).code(UPDATED_CODE);
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll("rel_matiere__classe").block();
            em.deleteAll(Matiere.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @BeforeEach
    public void initTest() {
        matiere = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedMatiere != null) {
            matiereRepository.delete(insertedMatiere).block();
            insertedMatiere = null;
        }
        deleteEntities(em);
    }

    @Test
    void createMatiere() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Matiere
        var returnedMatiere = webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(matiere))
            .exchange()
            .expectStatus()
            .isCreated()
            .expectBody(Matiere.class)
            .returnResult()
            .getResponseBody();

        // Validate the Matiere in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertMatiereUpdatableFieldsEquals(returnedMatiere, getPersistedMatiere(returnedMatiere));

        insertedMatiere = returnedMatiere;
    }

    @Test
    void createMatiereWithExistingId() throws Exception {
        // Create the Matiere with an existing ID
        matiere.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(matiere))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void getAllMatieresAsStream() {
        // Initialize the database
        matiereRepository.save(matiere).block();

        List<Matiere> matiereList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Matiere.class)
            .getResponseBody()
            .filter(matiere::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(matiereList).isNotNull();
        assertThat(matiereList).hasSize(1);
        Matiere testMatiere = matiereList.get(0);

        // Test fails because reactive api returns an empty object instead of null
        // assertMatiereAllPropertiesEquals(matiere, testMatiere);
        assertMatiereUpdatableFieldsEquals(matiere, testMatiere);
    }

    @Test
    void getAllMatieres() {
        // Initialize the database
        insertedMatiere = matiereRepository.save(matiere).block();

        // Get all the matiereList
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
            .value(hasItem(matiere.getId().intValue()))
            .jsonPath("$.[*].libelle")
            .value(hasItem(DEFAULT_LIBELLE))
            .jsonPath("$.[*].code")
            .value(hasItem(DEFAULT_CODE));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMatieresWithEagerRelationshipsIsEnabled() {
        when(matiereRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(matiereRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMatieresWithEagerRelationshipsIsNotEnabled() {
        when(matiereRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(matiereRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getMatiere() {
        // Initialize the database
        insertedMatiere = matiereRepository.save(matiere).block();

        // Get the matiere
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, matiere.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(matiere.getId().intValue()))
            .jsonPath("$.libelle")
            .value(is(DEFAULT_LIBELLE))
            .jsonPath("$.code")
            .value(is(DEFAULT_CODE));
    }

    @Test
    void getNonExistingMatiere() {
        // Get the matiere
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingMatiere() throws Exception {
        // Initialize the database
        insertedMatiere = matiereRepository.save(matiere).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the matiere
        Matiere updatedMatiere = matiereRepository.findById(matiere.getId()).block();
        updatedMatiere.libelle(UPDATED_LIBELLE).code(UPDATED_CODE);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedMatiere.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(updatedMatiere))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMatiereToMatchAllProperties(updatedMatiere);
    }

    @Test
    void putNonExistingMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, matiere.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(matiere))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(matiere))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(matiere))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateMatiereWithPatch() throws Exception {
        // Initialize the database
        insertedMatiere = matiereRepository.save(matiere).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the matiere using partial update
        Matiere partialUpdatedMatiere = new Matiere();
        partialUpdatedMatiere.setId(matiere.getId());

        partialUpdatedMatiere.libelle(UPDATED_LIBELLE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedMatiere.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedMatiere))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Matiere in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMatiereUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedMatiere, matiere), getPersistedMatiere(matiere));
    }

    @Test
    void fullUpdateMatiereWithPatch() throws Exception {
        // Initialize the database
        insertedMatiere = matiereRepository.save(matiere).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the matiere using partial update
        Matiere partialUpdatedMatiere = new Matiere();
        partialUpdatedMatiere.setId(matiere.getId());

        partialUpdatedMatiere.libelle(UPDATED_LIBELLE).code(UPDATED_CODE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedMatiere.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedMatiere))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Matiere in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMatiereUpdatableFieldsEquals(partialUpdatedMatiere, getPersistedMatiere(partialUpdatedMatiere));
    }

    @Test
    void patchNonExistingMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, matiere.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(matiere))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(matiere))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(matiere))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteMatiere() {
        // Initialize the database
        insertedMatiere = matiereRepository.save(matiere).block();

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the matiere
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, matiere.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return matiereRepository.count().block();
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

    protected Matiere getPersistedMatiere(Matiere matiere) {
        return matiereRepository.findById(matiere.getId()).block();
    }

    protected void assertPersistedMatiereToMatchAllProperties(Matiere expectedMatiere) {
        // Test fails because reactive api returns an empty object instead of null
        // assertMatiereAllPropertiesEquals(expectedMatiere, getPersistedMatiere(expectedMatiere));
        assertMatiereUpdatableFieldsEquals(expectedMatiere, getPersistedMatiere(expectedMatiere));
    }

    protected void assertPersistedMatiereToMatchUpdatableProperties(Matiere expectedMatiere) {
        // Test fails because reactive api returns an empty object instead of null
        // assertMatiereAllUpdatablePropertiesEquals(expectedMatiere, getPersistedMatiere(expectedMatiere));
        assertMatiereUpdatableFieldsEquals(expectedMatiere, getPersistedMatiere(expectedMatiere));
    }
}
