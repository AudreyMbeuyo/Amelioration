package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ClasseTestSamples.*;
import static com.mycompany.myapp.domain.EstpresentTestSamples.*;
import static com.mycompany.myapp.domain.EtudiantTestSamples.*;
import static com.mycompany.myapp.domain.MatiereTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class EtudiantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Etudiant.class);
        Etudiant etudiant1 = getEtudiantSample1();
        Etudiant etudiant2 = new Etudiant();
        assertThat(etudiant1).isNotEqualTo(etudiant2);

        etudiant2.setId(etudiant1.getId());
        assertThat(etudiant1).isEqualTo(etudiant2);

        etudiant2 = getEtudiantSample2();
        assertThat(etudiant1).isNotEqualTo(etudiant2);
    }

    @Test
    void matiereTest() {
        Etudiant etudiant = getEtudiantRandomSampleGenerator();
        Matiere matiereBack = getMatiereRandomSampleGenerator();

        etudiant.addMatiere(matiereBack);
        assertThat(etudiant.getMatieres()).containsOnly(matiereBack);

        etudiant.removeMatiere(matiereBack);
        assertThat(etudiant.getMatieres()).doesNotContain(matiereBack);

        etudiant.matieres(new HashSet<>(Set.of(matiereBack)));
        assertThat(etudiant.getMatieres()).containsOnly(matiereBack);

        etudiant.setMatieres(new HashSet<>());
        assertThat(etudiant.getMatieres()).doesNotContain(matiereBack);
    }

    @Test
    void estpresentTest() {
        Etudiant etudiant = getEtudiantRandomSampleGenerator();
        Estpresent estpresentBack = getEstpresentRandomSampleGenerator();

        etudiant.addEstpresent(estpresentBack);
        assertThat(etudiant.getEstpresents()).containsOnly(estpresentBack);
        assertThat(estpresentBack.getEtudiant()).isEqualTo(etudiant);

        etudiant.removeEstpresent(estpresentBack);
        assertThat(etudiant.getEstpresents()).doesNotContain(estpresentBack);
        assertThat(estpresentBack.getEtudiant()).isNull();

        etudiant.estpresents(new HashSet<>(Set.of(estpresentBack)));
        assertThat(etudiant.getEstpresents()).containsOnly(estpresentBack);
        assertThat(estpresentBack.getEtudiant()).isEqualTo(etudiant);

        etudiant.setEstpresents(new HashSet<>());
        assertThat(etudiant.getEstpresents()).doesNotContain(estpresentBack);
        assertThat(estpresentBack.getEtudiant()).isNull();
    }

    @Test
    void classeTest() {
        Etudiant etudiant = getEtudiantRandomSampleGenerator();
        Classe classeBack = getClasseRandomSampleGenerator();

        etudiant.addClasse(classeBack);
        assertThat(etudiant.getClasses()).containsOnly(classeBack);
        assertThat(classeBack.getEtudiants()).containsOnly(etudiant);

        etudiant.removeClasse(classeBack);
        assertThat(etudiant.getClasses()).doesNotContain(classeBack);
        assertThat(classeBack.getEtudiants()).doesNotContain(etudiant);

        etudiant.classes(new HashSet<>(Set.of(classeBack)));
        assertThat(etudiant.getClasses()).containsOnly(classeBack);
        assertThat(classeBack.getEtudiants()).containsOnly(etudiant);

        etudiant.setClasses(new HashSet<>());
        assertThat(etudiant.getClasses()).doesNotContain(classeBack);
        assertThat(classeBack.getEtudiants()).doesNotContain(etudiant);
    }
}
