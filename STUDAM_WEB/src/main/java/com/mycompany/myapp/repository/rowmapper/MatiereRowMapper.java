package com.mycompany.myapp.repository.rowmapper;

import com.mycompany.myapp.domain.Matiere;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Matiere}, with proper type conversions.
 */
@Service
public class MatiereRowMapper implements BiFunction<Row, String, Matiere> {

    private final ColumnConverter converter;

    public MatiereRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Matiere} stored in the database.
     */
    @Override
    public Matiere apply(Row row, String prefix) {
        Matiere entity = new Matiere();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setLibelle(converter.fromRow(row, prefix + "_libelle", String.class));
        entity.setCode(converter.fromRow(row, prefix + "_code", String.class));
        entity.setHoraireId(converter.fromRow(row, prefix + "_horaire_id", Long.class));
        entity.setEnseignantId(converter.fromRow(row, prefix + "_enseignant_id", Long.class));
        return entity;
    }
}
