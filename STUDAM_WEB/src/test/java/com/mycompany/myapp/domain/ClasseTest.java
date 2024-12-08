package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ClasseTestSamples.*;
import static com.mycompany.myapp.domain.DepartementTestSamples.*;
import static com.mycompany.myapp.domain.EtudiantTestSamples.*;
import static com.mycompany.myapp.domain.MatiereTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClasseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Classe.class);
        Classe classe1 = getClasseSample1();
        Classe classe2 = new Classe();
        assertThat(classe1).isNotEqualTo(classe2);

        classe2.setId(classe1.getId());
        assertThat(classe1).isEqualTo(classe2);

        classe2 = getClasseSample2();
        assertThat(classe1).isNotEqualTo(classe2);
    }

    @Test
    void etudiantTest() {
        Classe classe = getClasseRandomSampleGenerator();
        Etudiant etudiantBack = getEtudiantRandomSampleGenerator();

        classe.addEtudiant(etudiantBack);
        assertThat(classe.getEtudiants()).containsOnly(etudiantBack);

        classe.removeEtudiant(etudiantBack);
        assertThat(classe.getEtudiants()).doesNotContain(etudiantBack);

        classe.etudiants(new HashSet<>(Set.of(etudiantBack)));
        assertThat(classe.getEtudiants()).containsOnly(etudiantBack);

        classe.setEtudiants(new HashSet<>());
        assertThat(classe.getEtudiants()).doesNotContain(etudiantBack);
    }

    @Test
    void departementTest() {
        Classe classe = getClasseRandomSampleGenerator();
        Departement departementBack = getDepartementRandomSampleGenerator();

        classe.setDepartement(departementBack);
        assertThat(classe.getDepartement()).isEqualTo(departementBack);

        classe.departement(null);
        assertThat(classe.getDepartement()).isNull();
    }

    @Test
    void matiereTest() {
        Classe classe = getClasseRandomSampleGenerator();
        Matiere matiereBack = getMatiereRandomSampleGenerator();

        classe.addMatiere(matiereBack);
        assertThat(classe.getMatieres()).containsOnly(matiereBack);
        assertThat(matiereBack.getClasses()).containsOnly(classe);

        classe.removeMatiere(matiereBack);
        assertThat(classe.getMatieres()).doesNotContain(matiereBack);
        assertThat(matiereBack.getClasses()).doesNotContain(classe);

        classe.matieres(new HashSet<>(Set.of(matiereBack)));
        assertThat(classe.getMatieres()).containsOnly(matiereBack);
        assertThat(matiereBack.getClasses()).containsOnly(classe);

        classe.setMatieres(new HashSet<>());
        assertThat(classe.getMatieres()).doesNotContain(matiereBack);
        assertThat(matiereBack.getClasses()).doesNotContain(classe);
    }
}
