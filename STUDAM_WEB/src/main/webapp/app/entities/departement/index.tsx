import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Departement from './departement';
import DepartementDetail from './departement-detail';
import DepartementUpdate from './departement-update';
import DepartementDeleteDialog from './departement-delete-dialog';

const DepartementRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Departement />} />
    <Route path="new" element={<DepartementUpdate />} />
    <Route path=":id">
      <Route index element={<DepartementDetail />} />
      <Route path="edit" element={<DepartementUpdate />} />
      <Route path="delete" element={<DepartementDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default DepartementRoutes;
