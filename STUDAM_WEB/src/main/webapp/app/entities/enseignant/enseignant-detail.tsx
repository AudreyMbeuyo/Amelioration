import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './enseignant.reducer';

export const EnseignantDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const enseignantEntity = useAppSelector(state => state.enseignant.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="enseignantDetailsHeading">
          <Translate contentKey="studamWebApp.enseignant.detail.title">Enseignant</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{enseignantEntity.id}</dd>
          <dt>
            <span id="nom">
              <Translate contentKey="studamWebApp.enseignant.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{enseignantEntity.nom}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="studamWebApp.enseignant.email">Email</Translate>
            </span>
          </dt>
          <dd>{enseignantEntity.email}</dd>
          <dt>
            <span id="password">
              <Translate contentKey="studamWebApp.enseignant.password">Password</Translate>
            </span>
          </dt>
          <dd>{enseignantEntity.password}</dd>
          <dt>
            <Translate contentKey="studamWebApp.enseignant.departement">Departement</Translate>
          </dt>
          <dd>{enseignantEntity.departement ? enseignantEntity.departement.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/enseignant" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/enseignant/${enseignantEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default EnseignantDetail;
