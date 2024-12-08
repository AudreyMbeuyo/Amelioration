import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { TextFormat, Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './horaire.reducer';

export const Horaire = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const horaireList = useAppSelector(state => state.horaire.entities);
  const loading = useAppSelector(state => state.horaire.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="horaire-heading" data-cy="HoraireHeading">
        <Translate contentKey="studamWebApp.horaire.home.title">Horaires</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="studamWebApp.horaire.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/horaire/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="studamWebApp.horaire.home.createLabel">Create new Horaire</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {horaireList && horaireList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="studamWebApp.horaire.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('jour')}>
                  <Translate contentKey="studamWebApp.horaire.jour">Jour</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('jour')} />
                </th>
                <th className="hand" onClick={sort('heureDebut')}>
                  <Translate contentKey="studamWebApp.horaire.heureDebut">Heure Debut</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('heureDebut')} />
                </th>
                <th className="hand" onClick={sort('heureFin')}>
                  <Translate contentKey="studamWebApp.horaire.heureFin">Heure Fin</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('heureFin')} />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {horaireList.map((horaire, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/horaire/${horaire.id}`} color="link" size="sm">
                      {horaire.id}
                    </Button>
                  </td>
                  <td>
                    <Translate contentKey={`studamWebApp.Jour.${horaire.jour}`} />
                  </td>
                  <td>{horaire.heureDebut ? <TextFormat type="date" value={horaire.heureDebut} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{horaire.heureFin ? <TextFormat type="date" value={horaire.heureFin} format={APP_DATE_FORMAT} /> : null}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/horaire/${horaire.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/horaire/${horaire.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/horaire/${horaire.id}/delete`)}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="studamWebApp.horaire.home.notFound">No Horaires found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Horaire;
