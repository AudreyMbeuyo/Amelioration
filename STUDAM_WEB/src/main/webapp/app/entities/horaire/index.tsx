import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Horaire from './horaire';
import HoraireDetail from './horaire-detail';
import HoraireUpdate from './horaire-update';
import HoraireDeleteDialog from './horaire-delete-dialog';

const HoraireRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Horaire />} />
    <Route path="new" element={<HoraireUpdate />} />
    <Route path=":id">
      <Route index element={<HoraireDetail />} />
      <Route path="edit" element={<HoraireUpdate />} />
      <Route path="delete" element={<HoraireDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default HoraireRoutes;
