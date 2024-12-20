import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Matiere from './matiere';
import MatiereDetail from './matiere-detail';
import MatiereUpdate from './matiere-update';
import MatiereDeleteDialog from './matiere-delete-dialog';

const MatiereRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Matiere />} />
    <Route path="new" element={<MatiereUpdate />} />
    <Route path=":id">
      <Route index element={<MatiereDetail />} />
      <Route path="edit" element={<MatiereUpdate />} />
      <Route path="delete" element={<MatiereDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default MatiereRoutes;
