package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Estpresent.
 */
@Table("estpresent")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Estpresent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("date")
    private LocalDate date;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "estpresents", "matieres" }, allowSetters = true)
    private Horaire horaire;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "matieres", "estpresents", "classes" }, allowSetters = true)
    private Etudiant etudiant;

    @Column("horaire_id")
    private Long horaireId;

    @Column("etudiant_id")
    private Long etudiantId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Estpresent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Estpresent date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Horaire getHoraire() {
        return this.horaire;
    }

    public void setHoraire(Horaire horaire) {
        this.horaire = horaire;
        this.horaireId = horaire != null ? horaire.getId() : null;
    }

    public Estpresent horaire(Horaire horaire) {
        this.setHoraire(horaire);
        return this;
    }

    public Etudiant getEtudiant() {
        return this.etudiant;
    }

    public void setEtudiant(Etudiant etudiant) {
        this.etudiant = etudiant;
        this.etudiantId = etudiant != null ? etudiant.getId() : null;
    }

    public Estpresent etudiant(Etudiant etudiant) {
        this.setEtudiant(etudiant);
        return this;
    }

    public Long getHoraireId() {
        return this.horaireId;
    }

    public void setHoraireId(Long horaire) {
        this.horaireId = horaire;
    }

    public Long getEtudiantId() {
        return this.etudiantId;
    }

    public void setEtudiantId(Long etudiant) {
        this.etudiantId = etudiant;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Estpresent)) {
            return false;
        }
        return getId() != null && getId().equals(((Estpresent) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Estpresent{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
