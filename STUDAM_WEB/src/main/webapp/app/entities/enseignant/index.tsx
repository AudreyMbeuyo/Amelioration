import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Enseignant from './enseignant';
import EnseignantDetail from './enseignant-detail';
import EnseignantUpdate from './enseignant-update';
import EnseignantDeleteDialog from './enseignant-delete-dialog';

const EnseignantRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Enseignant />} />
    <Route path="new" element={<EnseignantUpdate />} />
    <Route path=":id">
      <Route index element={<EnseignantDetail />} />
      <Route path="edit" element={<EnseignantUpdate />} />
      <Route path="delete" element={<EnseignantDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default EnseignantRoutes;
