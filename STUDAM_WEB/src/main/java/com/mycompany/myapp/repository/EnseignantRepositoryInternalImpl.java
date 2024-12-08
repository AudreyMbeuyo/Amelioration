package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Enseignant;
import com.mycompany.myapp.repository.rowmapper.DepartementRowMapper;
import com.mycompany.myapp.repository.rowmapper.EnseignantRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the Enseignant entity.
 */
@SuppressWarnings("unused")
class EnseignantRepositoryInternalImpl extends SimpleR2dbcRepository<Enseignant, Long> implements EnseignantRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final DepartementRowMapper departementMapper;
    private final EnseignantRowMapper enseignantMapper;

    private static final Table entityTable = Table.aliased("enseignant", EntityManager.ENTITY_ALIAS);
    private static final Table departementTable = Table.aliased("departement", "departement");

    public EnseignantRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        DepartementRowMapper departementMapper,
        EnseignantRowMapper enseignantMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Enseignant.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.departementMapper = departementMapper;
        this.enseignantMapper = enseignantMapper;
    }

    @Override
    public Flux<Enseignant> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Enseignant> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = EnseignantSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(DepartementSqlHelper.getColumns(departementTable, "departement"));
        SelectFromAndJoinCondition selectFrom = Select.builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(departementTable)
            .on(Column.create("departement_id", entityTable))
            .equals(Column.create("id", departementTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Enseignant.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Enseignant> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Enseignant> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Enseignant process(Row row, RowMetadata metadata) {
        Enseignant entity = enseignantMapper.apply(row, "e");
        entity.setDepartement(departementMapper.apply(row, "departement"));
        return entity;
    }

    @Override
    public <S extends Enseignant> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
