package com.mycompany.myapp.repository.rowmapper;

import com.mycompany.myapp.domain.Etudiant;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Etudiant}, with proper type conversions.
 */
@Service
public class EtudiantRowMapper implements BiFunction<Row, String, Etudiant> {

    private final ColumnConverter converter;

    public EtudiantRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Etudiant} stored in the database.
     */
    @Override
    public Etudiant apply(Row row, String prefix) {
        Etudiant entity = new Etudiant();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setMatricule(converter.fromRow(row, prefix + "_matricule", String.class));
        entity.setNom(converter.fromRow(row, prefix + "_nom", String.class));
        entity.setPrenom(converter.fromRow(row, prefix + "_prenom", String.class));
        return entity;
    }
}
