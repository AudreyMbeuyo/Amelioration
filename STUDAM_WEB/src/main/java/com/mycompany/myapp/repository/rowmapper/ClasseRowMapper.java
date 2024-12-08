package com.mycompany.myapp.repository.rowmapper;

import com.mycompany.myapp.domain.Classe;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Classe}, with proper type conversions.
 */
@Service
public class ClasseRowMapper implements BiFunction<Row, String, Classe> {

    private final ColumnConverter converter;

    public ClasseRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Classe} stored in the database.
     */
    @Override
    public Classe apply(Row row, String prefix) {
        Classe entity = new Classe();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNom(converter.fromRow(row, prefix + "_nom", String.class));
        entity.setDepartementId(converter.fromRow(row, prefix + "_departement_id", Long.class));
        return entity;
    }
}
