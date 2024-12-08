package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Jour;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Horaire.
 */
@Table("horaire")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Horaire implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("jour")
    private Jour jour;

    @Column("heure_debut")
    private ZonedDateTime heureDebut;

    @Column("heure_fin")
    private ZonedDateTime heureFin;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "horaire", "etudiant" }, allowSetters = true)
    private Set<Estpresent> estpresents = new HashSet<>();

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "horaire", "enseignant", "classes", "etudiants" }, allowSetters = true)
    private Set<Matiere> matieres = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Horaire id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Jour getJour() {
        return this.jour;
    }

    public Horaire jour(Jour jour) {
        this.setJour(jour);
        return this;
    }

    public void setJour(Jour jour) {
        this.jour = jour;
    }

    public ZonedDateTime getHeureDebut() {
        return this.heureDebut;
    }

    public Horaire heureDebut(ZonedDateTime heureDebut) {
        this.setHeureDebut(heureDebut);
        return this;
    }

    public void setHeureDebut(ZonedDateTime heureDebut) {
        this.heureDebut = heureDebut;
    }

    public ZonedDateTime getHeureFin() {
        return this.heureFin;
    }

    public Horaire heureFin(ZonedDateTime heureFin) {
        this.setHeureFin(heureFin);
        return this;
    }

    public void setHeureFin(ZonedDateTime heureFin) {
        this.heureFin = heureFin;
    }

    public Set<Estpresent> getEstpresents() {
        return this.estpresents;
    }

    public void setEstpresents(Set<Estpresent> estpresents) {
        if (this.estpresents != null) {
            this.estpresents.forEach(i -> i.setHoraire(null));
        }
        if (estpresents != null) {
            estpresents.forEach(i -> i.setHoraire(this));
        }
        this.estpresents = estpresents;
    }

    public Horaire estpresents(Set<Estpresent> estpresents) {
        this.setEstpresents(estpresents);
        return this;
    }

    public Horaire addEstpresent(Estpresent estpresent) {
        this.estpresents.add(estpresent);
        estpresent.setHoraire(this);
        return this;
    }

    public Horaire removeEstpresent(Estpresent estpresent) {
        this.estpresents.remove(estpresent);
        estpresent.setHoraire(null);
        return this;
    }

    public Set<Matiere> getMatieres() {
        return this.matieres;
    }

    public void setMatieres(Set<Matiere> matieres) {
        if (this.matieres != null) {
            this.matieres.forEach(i -> i.setHoraire(null));
        }
        if (matieres != null) {
            matieres.forEach(i -> i.setHoraire(this));
        }
        this.matieres = matieres;
    }

    public Horaire matieres(Set<Matiere> matieres) {
        this.setMatieres(matieres);
        return this;
    }

    public Horaire addMatiere(Matiere matiere) {
        this.matieres.add(matiere);
        matiere.setHoraire(this);
        return this;
    }

    public Horaire removeMatiere(Matiere matiere) {
        this.matieres.remove(matiere);
        matiere.setHoraire(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Horaire)) {
            return false;
        }
        return getId() != null && getId().equals(((Horaire) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Horaire{" +
            "id=" + getId() +
            ", jour='" + getJour() + "'" +
            ", heureDebut='" + getHeureDebut() + "'" +
            ", heureFin='" + getHeureFin() + "'" +
            "}";
    }
}
