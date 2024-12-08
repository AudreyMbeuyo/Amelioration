package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Classe;
import com.mycompany.myapp.domain.Etudiant;
import com.mycompany.myapp.repository.rowmapper.ClasseRowMapper;
import com.mycompany.myapp.repository.rowmapper.DepartementRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the Classe entity.
 */
@SuppressWarnings("unused")
class ClasseRepositoryInternalImpl extends SimpleR2dbcRepository<Classe, Long> implements ClasseRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final DepartementRowMapper departementMapper;
    private final ClasseRowMapper classeMapper;

    private static final Table entityTable = Table.aliased("classe", EntityManager.ENTITY_ALIAS);
    private static final Table departementTable = Table.aliased("departement", "departement");

    private static final EntityManager.LinkTable etudiantLink = new EntityManager.LinkTable(
        "rel_classe__etudiant",
        "classe_id",
        "etudiant_id"
    );

    public ClasseRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        DepartementRowMapper departementMapper,
        ClasseRowMapper classeMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Classe.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.departementMapper = departementMapper;
        this.classeMapper = classeMapper;
    }

    @Override
    public Flux<Classe> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Classe> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = ClasseSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(DepartementSqlHelper.getColumns(departementTable, "departement"));
        SelectFromAndJoinCondition selectFrom = Select.builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(departementTable)
            .on(Column.create("departement_id", entityTable))
            .equals(Column.create("id", departementTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Classe.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Classe> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Classe> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    @Override
    public Mono<Classe> findOneWithEagerRelationships(Long id) {
        return findById(id);
    }

    @Override
    public Flux<Classe> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<Classe> findAllWithEagerRelationships(Pageable page) {
        return findAllBy(page);
    }

    private Classe process(Row row, RowMetadata metadata) {
        Classe entity = classeMapper.apply(row, "e");
        entity.setDepartement(departementMapper.apply(row, "departement"));
        return entity;
    }

    @Override
    public <S extends Classe> Mono<S> save(S entity) {
        return super.save(entity).flatMap((S e) -> updateRelations(e));
    }

    protected <S extends Classe> Mono<S> updateRelations(S entity) {
        Mono<Void> result = entityManager
            .updateLinkTable(etudiantLink, entity.getId(), entity.getEtudiants().stream().map(Etudiant::getId))
            .then();
        return result.thenReturn(entity);
    }

    @Override
    public Mono<Void> deleteById(Long entityId) {
        return deleteRelations(entityId).then(super.deleteById(entityId));
    }

    protected Mono<Void> deleteRelations(Long entityId) {
        return entityManager.deleteFromLinkTable(etudiantLink, entityId);
    }
}
