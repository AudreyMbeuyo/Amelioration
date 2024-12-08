package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Departement.
 */
@Table("departement")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Departement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("nom")
    private String nom;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "etudiants", "departement", "matieres" }, allowSetters = true)
    private Set<Classe> classes = new HashSet<>();

    @org.springframework.data.annotation.Transient
    private Enseignant enseignant;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Departement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Departement nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Classe> getClasses() {
        return this.classes;
    }

    public void setClasses(Set<Classe> classes) {
        if (this.classes != null) {
            this.classes.forEach(i -> i.setDepartement(null));
        }
        if (classes != null) {
            classes.forEach(i -> i.setDepartement(this));
        }
        this.classes = classes;
    }

    public Departement classes(Set<Classe> classes) {
        this.setClasses(classes);
        return this;
    }

    public Departement addClasse(Classe classe) {
        this.classes.add(classe);
        classe.setDepartement(this);
        return this;
    }

    public Departement removeClasse(Classe classe) {
        this.classes.remove(classe);
        classe.setDepartement(null);
        return this;
    }

    public Enseignant getEnseignant() {
        return this.enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        if (this.enseignant != null) {
            this.enseignant.setDepartement(null);
        }
        if (enseignant != null) {
            enseignant.setDepartement(this);
        }
        this.enseignant = enseignant;
    }

    public Departement enseignant(Enseignant enseignant) {
        this.setEnseignant(enseignant);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Departement)) {
            return false;
        }
        return getId() != null && getId().equals(((Departement) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Departement{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
