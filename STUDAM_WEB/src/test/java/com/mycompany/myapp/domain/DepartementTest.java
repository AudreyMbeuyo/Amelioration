package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ClasseTestSamples.*;
import static com.mycompany.myapp.domain.DepartementTestSamples.*;
import static com.mycompany.myapp.domain.EnseignantTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class DepartementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Departement.class);
        Departement departement1 = getDepartementSample1();
        Departement departement2 = new Departement();
        assertThat(departement1).isNotEqualTo(departement2);

        departement2.setId(departement1.getId());
        assertThat(departement1).isEqualTo(departement2);

        departement2 = getDepartementSample2();
        assertThat(departement1).isNotEqualTo(departement2);
    }

    @Test
    void classeTest() {
        Departement departement = getDepartementRandomSampleGenerator();
        Classe classeBack = getClasseRandomSampleGenerator();

        departement.addClasse(classeBack);
        assertThat(departement.getClasses()).containsOnly(classeBack);
        assertThat(classeBack.getDepartement()).isEqualTo(departement);

        departement.removeClasse(classeBack);
        assertThat(departement.getClasses()).doesNotContain(classeBack);
        assertThat(classeBack.getDepartement()).isNull();

        departement.classes(new HashSet<>(Set.of(classeBack)));
        assertThat(departement.getClasses()).containsOnly(classeBack);
        assertThat(classeBack.getDepartement()).isEqualTo(departement);

        departement.setClasses(new HashSet<>());
        assertThat(departement.getClasses()).doesNotContain(classeBack);
        assertThat(classeBack.getDepartement()).isNull();
    }

    @Test
    void enseignantTest() {
        Departement departement = getDepartementRandomSampleGenerator();
        Enseignant enseignantBack = getEnseignantRandomSampleGenerator();

        departement.setEnseignant(enseignantBack);
        assertThat(departement.getEnseignant()).isEqualTo(enseignantBack);
        assertThat(enseignantBack.getDepartement()).isEqualTo(departement);

        departement.enseignant(null);
        assertThat(departement.getEnseignant()).isNull();
        assertThat(enseignantBack.getDepartement()).isNull();
    }
}
