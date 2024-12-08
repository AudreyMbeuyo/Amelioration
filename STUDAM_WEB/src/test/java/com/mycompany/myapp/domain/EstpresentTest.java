package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EstpresentTestSamples.*;
import static com.mycompany.myapp.domain.EtudiantTestSamples.*;
import static com.mycompany.myapp.domain.HoraireTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EstpresentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Estpresent.class);
        Estpresent estpresent1 = getEstpresentSample1();
        Estpresent estpresent2 = new Estpresent();
        assertThat(estpresent1).isNotEqualTo(estpresent2);

        estpresent2.setId(estpresent1.getId());
        assertThat(estpresent1).isEqualTo(estpresent2);

        estpresent2 = getEstpresentSample2();
        assertThat(estpresent1).isNotEqualTo(estpresent2);
    }

    @Test
    void horaireTest() {
        Estpresent estpresent = getEstpresentRandomSampleGenerator();
        Horaire horaireBack = getHoraireRandomSampleGenerator();

        estpresent.setHoraire(horaireBack);
        assertThat(estpresent.getHoraire()).isEqualTo(horaireBack);

        estpresent.horaire(null);
        assertThat(estpresent.getHoraire()).isNull();
    }

    @Test
    void etudiantTest() {
        Estpresent estpresent = getEstpresentRandomSampleGenerator();
        Etudiant etudiantBack = getEtudiantRandomSampleGenerator();

        estpresent.setEtudiant(etudiantBack);
        assertThat(estpresent.getEtudiant()).isEqualTo(etudiantBack);

        estpresent.etudiant(null);
        assertThat(estpresent.getEtudiant()).isNull();
    }
}
