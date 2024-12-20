package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EstpresentTestSamples.*;
import static com.mycompany.myapp.domain.HoraireTestSamples.*;
import static com.mycompany.myapp.domain.MatiereTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class HoraireTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Horaire.class);
        Horaire horaire1 = getHoraireSample1();
        Horaire horaire2 = new Horaire();
        assertThat(horaire1).isNotEqualTo(horaire2);

        horaire2.setId(horaire1.getId());
        assertThat(horaire1).isEqualTo(horaire2);

        horaire2 = getHoraireSample2();
        assertThat(horaire1).isNotEqualTo(horaire2);
    }

    @Test
    void estpresentTest() {
        Horaire horaire = getHoraireRandomSampleGenerator();
        Estpresent estpresentBack = getEstpresentRandomSampleGenerator();

        horaire.addEstpresent(estpresentBack);
        assertThat(horaire.getEstpresents()).containsOnly(estpresentBack);
        assertThat(estpresentBack.getHoraire()).isEqualTo(horaire);

        horaire.removeEstpresent(estpresentBack);
        assertThat(horaire.getEstpresents()).doesNotContain(estpresentBack);
        assertThat(estpresentBack.getHoraire()).isNull();

        horaire.estpresents(new HashSet<>(Set.of(estpresentBack)));
        assertThat(horaire.getEstpresents()).containsOnly(estpresentBack);
        assertThat(estpresentBack.getHoraire()).isEqualTo(horaire);

        horaire.setEstpresents(new HashSet<>());
        assertThat(horaire.getEstpresents()).doesNotContain(estpresentBack);
        assertThat(estpresentBack.getHoraire()).isNull();
    }

    @Test
    void matiereTest() {
        Horaire horaire = getHoraireRandomSampleGenerator();
        Matiere matiereBack = getMatiereRandomSampleGenerator();

        horaire.addMatiere(matiereBack);
        assertThat(horaire.getMatieres()).containsOnly(matiereBack);
        assertThat(matiereBack.getHoraire()).isEqualTo(horaire);

        horaire.removeMatiere(matiereBack);
        assertThat(horaire.getMatieres()).doesNotContain(matiereBack);
        assertThat(matiereBack.getHoraire()).isNull();

        horaire.matieres(new HashSet<>(Set.of(matiereBack)));
        assertThat(horaire.getMatieres()).containsOnly(matiereBack);
        assertThat(matiereBack.getHoraire()).isEqualTo(horaire);

        horaire.setMatieres(new HashSet<>());
        assertThat(horaire.getMatieres()).doesNotContain(matiereBack);
        assertThat(matiereBack.getHoraire()).isNull();
    }
}
