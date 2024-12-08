import React from 'react';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Classe from './classe';
import Departement from './departement';
import Enseignant from './enseignant';
import Estpresent from './estpresent';
import Etudiant from './etudiant';
import Horaire from './horaire';
import Matiere from './matiere';
import { Route } from 'react-router';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="classe/*" element={<Classe />} />
        <Route path="departement/*" element={<Departement />} />
        <Route path="enseignant/*" element={<Enseignant />} />
        <Route path="estpresent/*" element={<Estpresent />} />
        <Route path="etudiant/*" element={<Etudiant />} />
        <Route path="horaire/*" element={<Horaire />} />
        <Route path="matiere/*" element={<Matiere />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
