package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Classe;
import com.mycompany.myapp.domain.Matiere;
import com.mycompany.myapp.repository.rowmapper.EnseignantRowMapper;
import com.mycompany.myapp.repository.rowmapper.HoraireRowMapper;
import com.mycompany.myapp.repository.rowmapper.MatiereRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Comparison;
import org.springframework.data.relational.core.sql.Condition;
import org.springframework.data.relational.core.sql.Conditions;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoinCondition;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC custom repository implementation for the Matiere entity.
 */
@SuppressWarnings("unused")
class MatiereRepositoryInternalImpl extends SimpleR2dbcRepository<Matiere, Long> implements MatiereRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final HoraireRowMapper horaireMapper;
    private final EnseignantRowMapper enseignantMapper;
    private final MatiereRowMapper matiereMapper;

    private static final Table entityTable = Table.aliased("matiere", EntityManager.ENTITY_ALIAS);
    private static final Table horaireTable = Table.aliased("horaire", "horaire");
    private static final Table enseignantTable = Table.aliased("enseignant", "enseignant");

    private static final EntityManager.LinkTable classeLink = new EntityManager.LinkTable("rel_matiere__classe", "matiere_id", "classe_id");

    public MatiereRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        HoraireRowMapper horaireMapper,
        EnseignantRowMapper enseignantMapper,
        MatiereRowMapper matiereMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Matiere.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.horaireMapper = horaireMapper;
        this.enseignantMapper = enseignantMapper;
        this.matiereMapper = matiereMapper;
    }

    @Override
    public Flux<Matiere> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Matiere> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = MatiereSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(HoraireSqlHelper.getColumns(horaireTable, "horaire"));
        columns.addAll(EnseignantSqlHelper.getColumns(enseignantTable, "enseignant"));
        SelectFromAndJoinCondition selectFrom = Select.builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(horaireTable)
            .on(Column.create("horaire_id", entityTable))
            .equals(Column.create("id", horaireTable))
            .leftOuterJoin(enseignantTable)
            .on(Column.create("enseignant_id", entityTable))
            .equals(Column.create("id", enseignantTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Matiere.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Matiere> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Matiere> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    @Override
    public Mono<Matiere> findOneWithEagerRelationships(Long id) {
        return findById(id);
    }

    @Override
    public Flux<Matiere> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<Matiere> findAllWithEagerRelationships(Pageable page) {
        return findAllBy(page);
    }

    private Matiere process(Row row, RowMetadata metadata) {
        Matiere entity = matiereMapper.apply(row, "e");
        entity.setHoraire(horaireMapper.apply(row, "horaire"));
        entity.setEnseignant(enseignantMapper.apply(row, "enseignant"));
        return entity;
    }

    @Override
    public <S extends Matiere> Mono<S> save(S entity) {
        return super.save(entity).flatMap((S e) -> updateRelations(e));
    }

    protected <S extends Matiere> Mono<S> updateRelations(S entity) {
        Mono<Void> result = entityManager
            .updateLinkTable(classeLink, entity.getId(), entity.getClasses().stream().map(Classe::getId))
            .then();
        return result.thenReturn(entity);
    }

    @Override
    public Mono<Void> deleteById(Long entityId) {
        return deleteRelations(entityId).then(super.deleteById(entityId));
    }

    protected Mono<Void> deleteRelations(Long entityId) {
        return entityManager.deleteFromLinkTable(classeLink, entityId);
    }
}
