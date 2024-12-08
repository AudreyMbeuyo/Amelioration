import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Etudiant from './etudiant';
import EtudiantDetail from './etudiant-detail';
import EtudiantUpdate from './etudiant-update';
import EtudiantDeleteDialog from './etudiant-delete-dialog';

const EtudiantRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Etudiant />} />
    <Route path="new" element={<EtudiantUpdate />} />
    <Route path=":id">
      <Route index element={<EtudiantDetail />} />
      <Route path="edit" element={<EtudiantUpdate />} />
      <Route path="delete" element={<EtudiantDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default EtudiantRoutes;
