package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.DepartementTestSamples.*;
import static com.mycompany.myapp.domain.EnseignantTestSamples.*;
import static com.mycompany.myapp.domain.MatiereTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class EnseignantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Enseignant.class);
        Enseignant enseignant1 = getEnseignantSample1();
        Enseignant enseignant2 = new Enseignant();
        assertThat(enseignant1).isNotEqualTo(enseignant2);

        enseignant2.setId(enseignant1.getId());
        assertThat(enseignant1).isEqualTo(enseignant2);

        enseignant2 = getEnseignantSample2();
        assertThat(enseignant1).isNotEqualTo(enseignant2);
    }

    @Test
    void departementTest() {
        Enseignant enseignant = getEnseignantRandomSampleGenerator();
        Departement departementBack = getDepartementRandomSampleGenerator();

        enseignant.setDepartement(departementBack);
        assertThat(enseignant.getDepartement()).isEqualTo(departementBack);

        enseignant.departement(null);
        assertThat(enseignant.getDepartement()).isNull();
    }

    @Test
    void matiereTest() {
        Enseignant enseignant = getEnseignantRandomSampleGenerator();
        Matiere matiereBack = getMatiereRandomSampleGenerator();

        enseignant.addMatiere(matiereBack);
        assertThat(enseignant.getMatieres()).containsOnly(matiereBack);
        assertThat(matiereBack.getEnseignant()).isEqualTo(enseignant);

        enseignant.removeMatiere(matiereBack);
        assertThat(enseignant.getMatieres()).doesNotContain(matiereBack);
        assertThat(matiereBack.getEnseignant()).isNull();

        enseignant.matieres(new HashSet<>(Set.of(matiereBack)));
        assertThat(enseignant.getMatieres()).containsOnly(matiereBack);
        assertThat(matiereBack.getEnseignant()).isEqualTo(enseignant);

        enseignant.setMatieres(new HashSet<>());
        assertThat(enseignant.getMatieres()).doesNotContain(matiereBack);
        assertThat(matiereBack.getEnseignant()).isNull();
    }
}
