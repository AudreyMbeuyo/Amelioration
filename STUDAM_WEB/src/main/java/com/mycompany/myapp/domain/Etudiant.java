package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Etudiant.
 */
@Table("etudiant")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Etudiant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("matricule")
    private String matricule;

    @Column("nom")
    private String nom;

    @Column("prenom")
    private String prenom;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "horaire", "enseignant", "classes", "etudiants" }, allowSetters = true)
    private Set<Matiere> matieres = new HashSet<>();

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "horaire", "etudiant" }, allowSetters = true)
    private Set<Estpresent> estpresents = new HashSet<>();

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "etudiants", "departement", "matieres" }, allowSetters = true)
    private Set<Classe> classes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Etudiant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricule() {
        return this.matricule;
    }

    public Etudiant matricule(String matricule) {
        this.setMatricule(matricule);
        return this;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getNom() {
        return this.nom;
    }

    public Etudiant nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Etudiant prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Set<Matiere> getMatieres() {
        return this.matieres;
    }

    public void setMatieres(Set<Matiere> matieres) {
        this.matieres = matieres;
    }

    public Etudiant matieres(Set<Matiere> matieres) {
        this.setMatieres(matieres);
        return this;
    }

    public Etudiant addMatiere(Matiere matiere) {
        this.matieres.add(matiere);
        return this;
    }

    public Etudiant removeMatiere(Matiere matiere) {
        this.matieres.remove(matiere);
        return this;
    }

    public Set<Estpresent> getEstpresents() {
        return this.estpresents;
    }

    public void setEstpresents(Set<Estpresent> estpresents) {
        if (this.estpresents != null) {
            this.estpresents.forEach(i -> i.setEtudiant(null));
        }
        if (estpresents != null) {
            estpresents.forEach(i -> i.setEtudiant(this));
        }
        this.estpresents = estpresents;
    }

    public Etudiant estpresents(Set<Estpresent> estpresents) {
        this.setEstpresents(estpresents);
        return this;
    }

    public Etudiant addEstpresent(Estpresent estpresent) {
        this.estpresents.add(estpresent);
        estpresent.setEtudiant(this);
        return this;
    }

    public Etudiant removeEstpresent(Estpresent estpresent) {
        this.estpresents.remove(estpresent);
        estpresent.setEtudiant(null);
        return this;
    }

    public Set<Classe> getClasses() {
        return this.classes;
    }

    public void setClasses(Set<Classe> classes) {
        if (this.classes != null) {
            this.classes.forEach(i -> i.removeEtudiant(this));
        }
        if (classes != null) {
            classes.forEach(i -> i.addEtudiant(this));
        }
        this.classes = classes;
    }

    public Etudiant classes(Set<Classe> classes) {
        this.setClasses(classes);
        return this;
    }

    public Etudiant addClasse(Classe classe) {
        this.classes.add(classe);
        classe.getEtudiants().add(this);
        return this;
    }

    public Etudiant removeClasse(Classe classe) {
        this.classes.remove(classe);
        classe.getEtudiants().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Etudiant)) {
            return false;
        }
        return getId() != null && getId().equals(((Etudiant) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Etudiant{" +
            "id=" + getId() +
            ", matricule='" + getMatricule() + "'" +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            "}";
    }
}
