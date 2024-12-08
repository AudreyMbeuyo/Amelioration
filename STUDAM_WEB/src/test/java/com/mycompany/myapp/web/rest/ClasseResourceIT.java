package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ClasseAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Classe;
import com.mycompany.myapp.repository.ClasseRepository;
import com.mycompany.myapp.repository.EntityManager;
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
 * Integration tests for the {@link ClasseResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ClasseResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/classes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ClasseRepository classeRepository;

    @Mock
    private ClasseRepository classeRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Classe classe;

    private Classe insertedClasse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Classe createEntity() {
        return new Classe().nom(DEFAULT_NOM);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Classe createUpdatedEntity() {
        return new Classe().nom(UPDATED_NOM);
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll("rel_classe__etudiant").block();
            em.deleteAll(Classe.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @BeforeEach
    public void initTest() {
        classe = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedClasse != null) {
            classeRepository.delete(insertedClasse).block();
            insertedClasse = null;
        }
        deleteEntities(em);
    }

    @Test
    void createClasse() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Classe
        var returnedClasse = webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(classe))
            .exchange()
            .expectStatus()
            .isCreated()
            .expectBody(Classe.class)
            .returnResult()
            .getResponseBody();

        // Validate the Classe in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertClasseUpdatableFieldsEquals(returnedClasse, getPersistedClasse(returnedClasse));

        insertedClasse = returnedClasse;
    }

    @Test
    void createClasseWithExistingId() throws Exception {
        // Create the Classe with an existing ID
        classe.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(classe))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void getAllClassesAsStream() {
        // Initialize the database
        classeRepository.save(classe).block();

        List<Classe> classeList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Classe.class)
            .getResponseBody()
            .filter(classe::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(classeList).isNotNull();
        assertThat(classeList).hasSize(1);
        Classe testClasse = classeList.get(0);

        // Test fails because reactive api returns an empty object instead of null
        // assertClasseAllPropertiesEquals(classe, testClasse);
        assertClasseUpdatableFieldsEquals(classe, testClasse);
    }

    @Test
    void getAllClasses() {
        // Initialize the database
        insertedClasse = classeRepository.save(classe).block();

        // Get all the classeList
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
            .value(hasItem(classe.getId().intValue()))
            .jsonPath("$.[*].nom")
            .value(hasItem(DEFAULT_NOM));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClassesWithEagerRelationshipsIsEnabled() {
        when(classeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(classeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClassesWithEagerRelationshipsIsNotEnabled() {
        when(classeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(classeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getClasse() {
        // Initialize the database
        insertedClasse = classeRepository.save(classe).block();

        // Get the classe
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, classe.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(classe.getId().intValue()))
            .jsonPath("$.nom")
            .value(is(DEFAULT_NOM));
    }

    @Test
    void getNonExistingClasse() {
        // Get the classe
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingClasse() throws Exception {
        // Initialize the database
        insertedClasse = classeRepository.save(classe).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the classe
        Classe updatedClasse = classeRepository.findById(classe.getId()).block();
        updatedClasse.nom(UPDATED_NOM);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedClasse.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(updatedClasse))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedClasseToMatchAllProperties(updatedClasse);
    }

    @Test
    void putNonExistingClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, classe.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(classe))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(classe))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(classe))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateClasseWithPatch() throws Exception {
        // Initialize the database
        insertedClasse = classeRepository.save(classe).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the classe using partial update
        Classe partialUpdatedClasse = new Classe();
        partialUpdatedClasse.setId(classe.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedClasse.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedClasse))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Classe in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClasseUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedClasse, classe), getPersistedClasse(classe));
    }

    @Test
    void fullUpdateClasseWithPatch() throws Exception {
        // Initialize the database
        insertedClasse = classeRepository.save(classe).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the classe using partial update
        Classe partialUpdatedClasse = new Classe();
        partialUpdatedClasse.setId(classe.getId());

        partialUpdatedClasse.nom(UPDATED_NOM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedClasse.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedClasse))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Classe in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClasseUpdatableFieldsEquals(partialUpdatedClasse, getPersistedClasse(partialUpdatedClasse));
    }

    @Test
    void patchNonExistingClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, classe.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(classe))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(classe))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(classe))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteClasse() {
        // Initialize the database
        insertedClasse = classeRepository.save(classe).block();

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the classe
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, classe.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return classeRepository.count().block();
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

    protected Classe getPersistedClasse(Classe classe) {
        return classeRepository.findById(classe.getId()).block();
    }

    protected void assertPersistedClasseToMatchAllProperties(Classe expectedClasse) {
        // Test fails because reactive api returns an empty object instead of null
        // assertClasseAllPropertiesEquals(expectedClasse, getPersistedClasse(expectedClasse));
        assertClasseUpdatableFieldsEquals(expectedClasse, getPersistedClasse(expectedClasse));
    }

    protected void assertPersistedClasseToMatchUpdatableProperties(Classe expectedClasse) {
        // Test fails because reactive api returns an empty object instead of null
        // assertClasseAllUpdatablePropertiesEquals(expectedClasse, getPersistedClasse(expectedClasse));
        assertClasseUpdatableFieldsEquals(expectedClasse, getPersistedClasse(expectedClasse));
    }
}
