package com.mycompany.myapp.repository.rowmapper;

import com.mycompany.myapp.domain.Enseignant;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Enseignant}, with proper type conversions.
 */
@Service
public class EnseignantRowMapper implements BiFunction<Row, String, Enseignant> {

    private final ColumnConverter converter;

    public EnseignantRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Enseignant} stored in the database.
     */
    @Override
    public Enseignant apply(Row row, String prefix) {
        Enseignant entity = new Enseignant();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNom(converter.fromRow(row, prefix + "_nom", String.class));
        entity.setEmail(converter.fromRow(row, prefix + "_email", String.class));
        entity.setPassword(converter.fromRow(row, prefix + "_password", String.class));
        entity.setDepartementId(converter.fromRow(row, prefix + "_departement_id", Long.class));
        return entity;
    }
}
