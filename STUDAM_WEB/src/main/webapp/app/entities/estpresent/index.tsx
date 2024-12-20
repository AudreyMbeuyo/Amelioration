import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Estpresent from './estpresent';
import EstpresentDetail from './estpresent-detail';
import EstpresentUpdate from './estpresent-update';
import EstpresentDeleteDialog from './estpresent-delete-dialog';

const EstpresentRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Estpresent />} />
    <Route path="new" element={<EstpresentUpdate />} />
    <Route path=":id">
      <Route index element={<EstpresentDetail />} />
      <Route path="edit" element={<EstpresentUpdate />} />
      <Route path="delete" element={<EstpresentDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default EstpresentRoutes;
