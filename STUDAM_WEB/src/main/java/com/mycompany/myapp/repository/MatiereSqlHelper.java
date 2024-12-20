package com.mycompany.myapp.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class MatiereSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("libelle", table, columnPrefix + "_libelle"));
        columns.add(Column.aliased("code", table, columnPrefix + "_code"));

        columns.add(Column.aliased("horaire_id", table, columnPrefix + "_horaire_id"));
        columns.add(Column.aliased("enseignant_id", table, columnPrefix + "_enseignant_id"));
        return columns;
    }
}
