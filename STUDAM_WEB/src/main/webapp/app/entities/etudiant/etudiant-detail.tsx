import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './etudiant.reducer';

export const EtudiantDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const etudiantEntity = useAppSelector(state => state.etudiant.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="etudiantDetailsHeading">
          <Translate contentKey="studamWebApp.etudiant.detail.title">Etudiant</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{etudiantEntity.id}</dd>
          <dt>
            <span id="matricule">
              <Translate contentKey="studamWebApp.etudiant.matricule">Matricule</Translate>
            </span>
          </dt>
          <dd>{etudiantEntity.matricule}</dd>
          <dt>
            <span id="nom">
              <Translate contentKey="studamWebApp.etudiant.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{etudiantEntity.nom}</dd>
          <dt>
            <span id="prenom">
              <Translate contentKey="studamWebApp.etudiant.prenom">Prenom</Translate>
            </span>
          </dt>
          <dd>{etudiantEntity.prenom}</dd>
          <dt>
            <Translate contentKey="studamWebApp.etudiant.matiere">Matiere</Translate>
          </dt>
          <dd>
            {etudiantEntity.matieres
              ? etudiantEntity.matieres.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {etudiantEntity.matieres && i === etudiantEntity.matieres.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <dt>
            <Translate contentKey="studamWebApp.etudiant.classe">Classe</Translate>
          </dt>
          <dd>
            {etudiantEntity.classes
              ? etudiantEntity.classes.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {etudiantEntity.classes && i === etudiantEntity.classes.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/etudiant" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/etudiant/${etudiantEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default EtudiantDetail;
