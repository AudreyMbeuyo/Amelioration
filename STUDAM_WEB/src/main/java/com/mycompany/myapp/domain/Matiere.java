package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Matiere.
 */
@Table("matiere")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Matiere implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("libelle")
    private String libelle;

    @Column("code")
    private String code;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "estpresents", "matieres" }, allowSetters = true)
    private Horaire horaire;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "departement", "matieres" }, allowSetters = true)
    private Enseignant enseignant;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "etudiants", "departement", "matieres" }, allowSetters = true)
    private Set<Classe> classes = new HashSet<>();

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "matieres", "estpresents", "classes" }, allowSetters = true)
    private Set<Etudiant> etudiants = new HashSet<>();

    @Column("horaire_id")
    private Long horaireId;

    @Column("enseignant_id")
    private Long enseignantId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Matiere id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Matiere libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getCode() {
        return this.code;
    }

    public Matiere code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Horaire getHoraire() {
        return this.horaire;
    }

    public void setHoraire(Horaire horaire) {
        this.horaire = horaire;
        this.horaireId = horaire != null ? horaire.getId() : null;
    }

    public Matiere horaire(Horaire horaire) {
        this.setHoraire(horaire);
        return this;
    }

    public Enseignant getEnseignant() {
        return this.enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
        this.enseignantId = enseignant != null ? enseignant.getId() : null;
    }

    public Matiere enseignant(Enseignant enseignant) {
        this.setEnseignant(enseignant);
        return this;
    }

    public Set<Classe> getClasses() {
        return this.classes;
    }

    public void setClasses(Set<Classe> classes) {
        this.classes = classes;
    }

    public Matiere classes(Set<Classe> classes) {
        this.setClasses(classes);
        return this;
    }

    public Matiere addClasse(Classe classe) {
        this.classes.add(classe);
        return this;
    }

    public Matiere removeClasse(Classe classe) {
        this.classes.remove(classe);
        return this;
    }

    public Set<Etudiant> getEtudiants() {
        return this.etudiants;
    }

    public void setEtudiants(Set<Etudiant> etudiants) {
        if (this.etudiants != null) {
            this.etudiants.forEach(i -> i.removeMatiere(this));
        }
        if (etudiants != null) {
            etudiants.forEach(i -> i.addMatiere(this));
        }
        this.etudiants = etudiants;
    }

    public Matiere etudiants(Set<Etudiant> etudiants) {
        this.setEtudiants(etudiants);
        return this;
    }

    public Matiere addEtudiant(Etudiant etudiant) {
        this.etudiants.add(etudiant);
        etudiant.getMatieres().add(this);
        return this;
    }

    public Matiere removeEtudiant(Etudiant etudiant) {
        this.etudiants.remove(etudiant);
        etudiant.getMatieres().remove(this);
        return this;
    }

    public Long getHoraireId() {
        return this.horaireId;
    }

    public void setHoraireId(Long horaire) {
        this.horaireId = horaire;
    }

    public Long getEnseignantId() {
        return this.enseignantId;
    }

    public void setEnseignantId(Long enseignant) {
        this.enseignantId = enseignant;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Matiere)) {
            return false;
        }
        return getId() != null && getId().equals(((Matiere) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Matiere{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            ", code='" + getCode() + "'" +
            "}";
    }
}
