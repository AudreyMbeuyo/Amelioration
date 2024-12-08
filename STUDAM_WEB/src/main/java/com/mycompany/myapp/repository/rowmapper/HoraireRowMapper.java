package com.mycompany.myapp.repository.rowmapper;

import com.mycompany.myapp.domain.Horaire;
import com.mycompany.myapp.domain.enumeration.Jour;
import io.r2dbc.spi.Row;
import java.time.ZonedDateTime;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Horaire}, with proper type conversions.
 */
@Service
public class HoraireRowMapper implements BiFunction<Row, String, Horaire> {

    private final ColumnConverter converter;

    public HoraireRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Horaire} stored in the database.
     */
    @Override
    public Horaire apply(Row row, String prefix) {
        Horaire entity = new Horaire();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setJour(converter.fromRow(row, prefix + "_jour", Jour.class));
        entity.setHeureDebut(converter.fromRow(row, prefix + "_heure_debut", ZonedDateTime.class));
        entity.setHeureFin(converter.fromRow(row, prefix + "_heure_fin", ZonedDateTime.class));
        return entity;
    }
}
