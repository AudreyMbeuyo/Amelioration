package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Enseignant.
 */
@Table("enseignant")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Enseignant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("nom")
    private String nom;

    @Column("email")
    private String email;

    @Column("password")
    private String password;

    @org.springframework.data.annotation.Transient
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

    public Enseignant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Enseignant nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return this.email;
    }

    public Enseignant email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public Enseignant password(String password) {
        this.setPassword(password);
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Departement getDepartement() {
        return this.departement;
    }

    public void setDepartement(Departement departement) {
        this.departement = departement;
        this.departementId = departement != null ? departement.getId() : null;
    }

    public Enseignant departement(Departement departement) {
        this.setDepartement(departement);
        return this;
    }

    public Set<Matiere> getMatieres() {
        return this.matieres;
    }

    public void setMatieres(Set<Matiere> matieres) {
        if (this.matieres != null) {
            this.matieres.forEach(i -> i.setEnseignant(null));
        }
        if (matieres != null) {
            matieres.forEach(i -> i.setEnseignant(this));
        }
        this.matieres = matieres;
    }

    public Enseignant matieres(Set<Matiere> matieres) {
        this.setMatieres(matieres);
        return this;
    }

    public Enseignant addMatiere(Matiere matiere) {
        this.matieres.add(matiere);
        matiere.setEnseignant(this);
        return this;
    }

    public Enseignant removeMatiere(Matiere matiere) {
        this.matieres.remove(matiere);
        matiere.setEnseignant(null);
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
        if (!(o instanceof Enseignant)) {
            return false;
        }
        return getId() != null && getId().equals(((Enseignant) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Enseignant{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", email='" + getEmail() + "'" +
            ", password='" + getPassword() + "'" +
            "}";
    }
}
