import classe from 'app/entities/classe/classe.reducer';
import departement from 'app/entities/departement/departement.reducer';
import enseignant from 'app/entities/enseignant/enseignant.reducer';
import estpresent from 'app/entities/estpresent/estpresent.reducer';
import etudiant from 'app/entities/etudiant/etudiant.reducer';
import horaire from 'app/entities/horaire/horaire.reducer';
import matiere from 'app/entities/matiere/matiere.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  classe,
  departement,
  enseignant,
  estpresent,
  etudiant,
  horaire,
  matiere,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
