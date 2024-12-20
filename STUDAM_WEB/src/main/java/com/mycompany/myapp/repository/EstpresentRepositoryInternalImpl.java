package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Estpresent;
import com.mycompany.myapp.repository.rowmapper.EstpresentRowMapper;
import com.mycompany.myapp.repository.rowmapper.EtudiantRowMapper;
import com.mycompany.myapp.repository.rowmapper.HoraireRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the Estpresent entity.
 */
@SuppressWarnings("unused")
class EstpresentRepositoryInternalImpl extends SimpleR2dbcRepository<Estpresent, Long> implements EstpresentRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final HoraireRowMapper horaireMapper;
    private final EtudiantRowMapper etudiantMapper;
    private final EstpresentRowMapper estpresentMapper;

    private static final Table entityTable = Table.aliased("estpresent", EntityManager.ENTITY_ALIAS);
    private static final Table horaireTable = Table.aliased("horaire", "horaire");
    private static final Table etudiantTable = Table.aliased("etudiant", "etudiant");

    public EstpresentRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        HoraireRowMapper horaireMapper,
        EtudiantRowMapper etudiantMapper,
        EstpresentRowMapper estpresentMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Estpresent.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.horaireMapper = horaireMapper;
        this.etudiantMapper = etudiantMapper;
        this.estpresentMapper = estpresentMapper;
    }

    @Override
    public Flux<Estpresent> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Estpresent> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = EstpresentSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(HoraireSqlHelper.getColumns(horaireTable, "horaire"));
        columns.addAll(EtudiantSqlHelper.getColumns(etudiantTable, "etudiant"));
        SelectFromAndJoinCondition selectFrom = Select.builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(horaireTable)
            .on(Column.create("horaire_id", entityTable))
            .equals(Column.create("id", horaireTable))
            .leftOuterJoin(etudiantTable)
            .on(Column.create("etudiant_id", entityTable))
            .equals(Column.create("id", etudiantTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Estpresent.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Estpresent> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Estpresent> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Estpresent process(Row row, RowMetadata metadata) {
        Estpresent entity = estpresentMapper.apply(row, "e");
        entity.setHoraire(horaireMapper.apply(row, "horaire"));
        entity.setEtudiant(etudiantMapper.apply(row, "etudiant"));
        return entity;
    }

    @Override
    public <S extends Estpresent> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
