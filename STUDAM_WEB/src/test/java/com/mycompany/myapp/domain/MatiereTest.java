package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ClasseTestSamples.*;
import static com.mycompany.myapp.domain.EnseignantTestSamples.*;
import static com.mycompany.myapp.domain.EtudiantTestSamples.*;
import static com.mycompany.myapp.domain.HoraireTestSamples.*;
import static com.mycompany.myapp.domain.MatiereTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class MatiereTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Matiere.class);
        Matiere matiere1 = getMatiereSample1();
        Matiere matiere2 = new Matiere();
        assertThat(matiere1).isNotEqualTo(matiere2);

        matiere2.setId(matiere1.getId());
        assertThat(matiere1).isEqualTo(matiere2);

        matiere2 = getMatiereSample2();
        assertThat(matiere1).isNotEqualTo(matiere2);
    }

    @Test
    void horaireTest() {
        Matiere matiere = getMatiereRandomSampleGenerator();
        Horaire horaireBack = getHoraireRandomSampleGenerator();

        matiere.setHoraire(horaireBack);
        assertThat(matiere.getHoraire()).isEqualTo(horaireBack);

        matiere.horaire(null);
        assertThat(matiere.getHoraire()).isNull();
    }

    @Test
    void enseignantTest() {
        Matiere matiere = getMatiereRandomSampleGenerator();
        Enseignant enseignantBack = getEnseignantRandomSampleGenerator();

        matiere.setEnseignant(enseignantBack);
        assertThat(matiere.getEnseignant()).isEqualTo(enseignantBack);

        matiere.enseignant(null);
        assertThat(matiere.getEnseignant()).isNull();
    }

    @Test
    void classeTest() {
        Matiere matiere = getMatiereRandomSampleGenerator();
        Classe classeBack = getClasseRandomSampleGenerator();

        matiere.addClasse(classeBack);
        assertThat(matiere.getClasses()).containsOnly(classeBack);

        matiere.removeClasse(classeBack);
        assertThat(matiere.getClasses()).doesNotContain(classeBack);

        matiere.classes(new HashSet<>(Set.of(classeBack)));
        assertThat(matiere.getClasses()).containsOnly(classeBack);

        matiere.setClasses(new HashSet<>());
        assertThat(matiere.getClasses()).doesNotContain(classeBack);
    }

    @Test
    void etudiantTest() {
        Matiere matiere = getMatiereRandomSampleGenerator();
        Etudiant etudiantBack = getEtudiantRandomSampleGenerator();

        matiere.addEtudiant(etudiantBack);
        assertThat(matiere.getEtudiants()).containsOnly(etudiantBack);
        assertThat(etudiantBack.getMatieres()).containsOnly(matiere);

        matiere.removeEtudiant(etudiantBack);
        assertThat(matiere.getEtudiants()).doesNotContain(etudiantBack);
        assertThat(etudiantBack.getMatieres()).doesNotContain(matiere);

        matiere.etudiants(new HashSet<>(Set.of(etudiantBack)));
        assertThat(matiere.getEtudiants()).containsOnly(etudiantBack);
        assertThat(etudiantBack.getMatieres()).containsOnly(matiere);

        matiere.setEtudiants(new HashSet<>());
        assertThat(matiere.getEtudiants()).doesNotContain(etudiantBack);
        assertThat(etudiantBack.getMatieres()).doesNotContain(matiere);
    }
}
