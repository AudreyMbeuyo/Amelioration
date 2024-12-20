package com.mycompany.myapp.repository.rowmapper;

import com.mycompany.myapp.domain.Estpresent;
import io.r2dbc.spi.Row;
import java.time.LocalDate;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Estpresent}, with proper type conversions.
 */
@Service
public class EstpresentRowMapper implements BiFunction<Row, String, Estpresent> {

    private final ColumnConverter converter;

    public EstpresentRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Estpresent} stored in the database.
     */
    @Override
    public Estpresent apply(Row row, String prefix) {
        Estpresent entity = new Estpresent();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setDate(converter.fromRow(row, prefix + "_date", LocalDate.class));
        entity.setHoraireId(converter.fromRow(row, prefix + "_horaire_id", Long.class));
        entity.setEtudiantId(converter.fromRow(row, prefix + "_etudiant_id", Long.class));
        return entity;
    }
}
