package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Classe.
 */
@Table("classe")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Classe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("nom")
    private String nom;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "matieres", "estpresents", "classes" }, allowSetters = true)
    private Set<Etudiant> etudiants = new HashSet<>();

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "classes", "enseignant" }, allowSetters = true)
    private Departement departement;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "horaire", "enseignant", "classes", "etudiants" }, allowSetters = true)
    private Set<Matiere> matieres = new HashSet<>();

    @Column("departement_id")
    private Long departementId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Classe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Classe nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Etudiant> getEtudiants() {
        return this.etudiants;
    }

    public void setEtudiants(Set<Etudiant> etudiants) {
        this.etudiants = etudiants;
    }

    public Classe etudiants(Set<Etudiant> etudiants) {
        this.setEtudiants(etudiants);
        return this;
    }

    public Classe addEtudiant(Etudiant etudiant) {
        this.etudiants.add(etudiant);
        return this;
    }

    public Classe removeEtudiant(Etudiant etudiant) {
        this.etudiants.remove(etudiant);
        return this;
    }

    public Departement getDepartement() {
        return this.departement;
    }

    public void setDepartement(Departement departement) {
        this.departement = departement;
        this.departementId = departement != null ? departement.getId() : null;
    }

    public Classe departement(Departement departement) {
        this.setDepartement(departement);
        return this;
    }

    public Set<Matiere> getMatieres() {
        return this.matieres;
    }

    public void setMatieres(Set<Matiere> matieres) {
        if (this.matieres != null) {
            this.matieres.forEach(i -> i.removeClasse(this));
        }
        if (matieres != null) {
            matieres.forEach(i -> i.addClasse(this));
        }
        this.matieres = matieres;
    }

    public Classe matieres(Set<Matiere> matieres) {
        this.setMatieres(matieres);
        return this;
    }

    public Classe addMatiere(Matiere matiere) {
        this.matieres.add(matiere);
        matiere.getClasses().add(this);
        return this;
    }

    public Classe removeMatiere(Matiere matiere) {
        this.matieres.remove(matiere);
        matiere.getClasses().remove(this);
        return this;
    }

    public Long getDepartementId() {
        return this.departementId;
    }

    public void setDepartementId(Long departement) {
        this.departementId = departement;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Classe)) {
            return false;
        }
        return getId() != null && getId().equals(((Classe) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Classe{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
