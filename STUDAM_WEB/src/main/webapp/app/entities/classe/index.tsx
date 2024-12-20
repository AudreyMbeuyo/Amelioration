import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Classe from './classe';
import ClasseDetail from './classe-detail';
import ClasseUpdate from './classe-update';
import ClasseDeleteDialog from './classe-delete-dialog';

const ClasseRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Classe />} />
    <Route path="new" element={<ClasseUpdate />} />
    <Route path=":id">
      <Route index element={<ClasseDetail />} />
      <Route path="edit" element={<ClasseUpdate />} />
      <Route path="delete" element={<ClasseDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ClasseRoutes;
